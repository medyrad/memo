from django.db import transaction

from apps.inventory.models import Inventory
from apps.notifications.models import Notification
from apps.orders.models import Order, OrderStatusHistory
from apps.shipping.models import Shipment

from .models import Payment


class PaymentVerificationError(ValueError):
    pass


@transaction.atomic
def mark_payment_succeeded(payment: Payment, reference_id: str = "") -> Payment:
    payment = Payment.objects.select_for_update().select_related("order").get(id=payment.id)
    order = Order.objects.select_for_update().get(id=payment.order_id)

    if payment.status == Payment.Status.SUCCEEDED:
        return payment
    if order.status not in [Order.Status.PENDING_PAYMENT, Order.Status.DRAFT]:
        raise PaymentVerificationError("این سفارش در وضعیت قابل پرداخت نیست.")

    for item in order.items.select_related("variant"):
        inventory = Inventory.objects.select_for_update().filter(variant=item.variant).first()
        if inventory is None or inventory.quantity < item.quantity:
            raise PaymentVerificationError("موجودی برای تکمیل سفارش کافی نیست.")
        inventory.quantity -= item.quantity
        inventory.save(update_fields=["quantity", "updated_at"])

    payment.status = Payment.Status.SUCCEEDED
    payment.reference_id = reference_id or payment.reference_id
    payment.save(update_fields=["status", "reference_id", "updated_at"])

    previous_status = order.status
    order.status = Order.Status.PAID
    order.save(update_fields=["status", "updated_at"])
    OrderStatusHistory.objects.create(order=order, from_status=previous_status, to_status=Order.Status.PAID)
    Shipment.objects.get_or_create(order=order, defaults={"status": Shipment.Status.PENDING})
    Notification.objects.create(
        user=order.user,
        channel=Notification.Channel.IN_APP,
        subject="سفارش شما ثبت شد",
        body=f"سفارش {order.id} با موفقیت پرداخت شد.",
    )
    return payment
