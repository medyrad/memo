from django.db import transaction
from django.db.models import F

from apps.discounts.models import Coupon
from apps.inventory.models import Inventory
from apps.notifications.models import Notification
from apps.orders.models import Order, OrderStatusHistory

from .gateways import GatewayError, ZarinpalGateway
from .models import Payment


class PaymentVerificationError(ValueError):
    pass


def request_gateway_payment(payment: Payment) -> tuple[Payment, str]:
    gateway = ZarinpalGateway()
    user = payment.order.user
    result = gateway.request(
        amount=payment.amount,
        description=f"پرداخت سفارش {payment.order_id}",
        mobile=user.phone or "",
        email=user.email or "",
    )
    payment.authority = result.authority
    payment.status = Payment.Status.PENDING
    payment.failure_reason = ""
    payment.raw_response = {"request": result.raw_response}
    payment.save(update_fields=["authority", "status", "failure_reason", "raw_response", "updated_at"])
    return payment, result.payment_url


@transaction.atomic
def mark_payment_failed(payment: Payment, reason: str, raw_response: dict | None = None) -> Payment:
    payment = Payment.objects.select_for_update().get(pk=payment.pk)
    if payment.status == Payment.Status.SUCCEEDED:
        return payment
    payment.status = Payment.Status.FAILED
    payment.gateway_request_started_at = None
    payment.failure_reason = reason[:250]
    if raw_response:
        payment.raw_response = {**payment.raw_response, "failure": raw_response}
    payment.save(update_fields=["status", "gateway_request_started_at", "failure_reason", "raw_response", "updated_at"])
    return payment


@transaction.atomic
def mark_payment_succeeded(payment: Payment, reference_id: str, gateway_response: dict | None = None) -> Payment:
    payment = Payment.objects.select_for_update().select_related("order").get(id=payment.id)
    order = Order.objects.select_for_update().get(id=payment.order_id)

    if payment.status == Payment.Status.SUCCEEDED:
        return payment
    if not reference_id:
        raise PaymentVerificationError("کد مرجع معتبر از درگاه دریافت نشد.")
    if payment.amount != order.grand_total:
        raise PaymentVerificationError("مبلغ پرداخت با مبلغ سفارش مطابقت ندارد.")
    if order.status != Order.Status.PENDING_PAYMENT or not order.inventory_reserved:
        raise PaymentVerificationError("این سفارش در وضعیت قابل پرداخت نیست.")

    for item in order.items.select_related("variant"):
        inventory = Inventory.objects.select_for_update().filter(variant=item.variant).first()
        if inventory is None or inventory.quantity < item.quantity or inventory.reserved_quantity < item.quantity:
            raise PaymentVerificationError("موجودی رزروشده برای تکمیل سفارش کافی نیست.")
        inventory.quantity -= item.quantity
        inventory.reserved_quantity -= item.quantity
        inventory.save(update_fields=["quantity", "reserved_quantity", "updated_at"])

    if order.coupon_id:
        coupon = Coupon.objects.select_for_update().get(pk=order.coupon_id)
        if coupon.usage_limit is not None and coupon.used_count >= coupon.usage_limit:
            raise PaymentVerificationError("ظرفیت استفاده از کد تخفیف تمام شده است.")
        Coupon.objects.filter(pk=coupon.pk).update(used_count=F("used_count") + 1)

    payment.status = Payment.Status.SUCCEEDED
    payment.reference_id = reference_id
    payment.failure_reason = ""
    if gateway_response:
        payment.raw_response = {**payment.raw_response, "verify": gateway_response}
    payment.save(update_fields=["status", "reference_id", "failure_reason", "raw_response", "updated_at"])

    previous_status = order.status
    order.status = Order.Status.PAID
    order.inventory_reserved = False
    order.save(update_fields=["status", "inventory_reserved", "updated_at"])
    OrderStatusHistory.objects.create(order=order, from_status=previous_status, to_status=Order.Status.PAID)
    Notification.objects.create(
        user=order.user,
        channel=Notification.Channel.IN_APP,
        subject="سفارش شما ثبت شد",
        body=f"سفارش {order.id} با موفقیت پرداخت شد.",
    )
    from apps.notifications.services import send_order_status_sms
    transaction.on_commit(lambda: send_order_status_sms(order.pk))
    return payment


def verify_gateway_payment(payment: Payment) -> Payment:
    if not payment.authority:
        raise PaymentVerificationError("شناسه پرداخت درگاه موجود نیست.")
    try:
        result = ZarinpalGateway().verify(amount=payment.amount, authority=payment.authority)
    except GatewayError as exc:
        raise PaymentVerificationError(str(exc)) from exc
    return mark_payment_succeeded(payment, result.reference_id, result.raw_response)
