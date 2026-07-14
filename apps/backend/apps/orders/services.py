from datetime import timedelta
from decimal import Decimal

from django.conf import settings
from django.db import transaction
from django.db.models import F
from django.utils import timezone

from apps.accounts.models import Address
from apps.cart.models import Cart
from apps.discounts.models import Coupon, DiscountRule
from apps.inventory.models import Inventory
from apps.shipping.models import Shipment

from .models import Order, OrderItem, OrderStatusHistory


class CheckoutError(ValueError):
    pass


def _address_snapshot(address: Address) -> dict:
    return {
        "recipient_name": address.recipient_name,
        "phone": address.phone,
        "province": address.province,
        "city": address.city,
        "postal_code": address.postal_code,
        "address_line": address.address_line,
    }


def _rule_matches(rule: DiscountRule, items, subtotal: Decimal) -> bool:
    if rule.min_order_total is not None and subtotal < rule.min_order_total:
        return False
    if rule.category_id and not any(item.variant.product.category_id == rule.category_id for item in items):
        return False
    if rule.product_id and not any(item.variant.product_id == rule.product_id for item in items):
        return False
    return True


def _resolve_coupon(items, subtotal: Decimal, coupon_code: str = "") -> tuple[Coupon | None, Decimal]:
    if not coupon_code:
        return None, Decimal("0.00")

    coupon = Coupon.objects.select_for_update().filter(code__iexact=coupon_code, is_active=True).first()
    if coupon is None:
        raise CheckoutError("کد تخفیف معتبر نیست.")
    now = timezone.now()
    if coupon.starts_at and coupon.starts_at > now:
        raise CheckoutError("کد تخفیف هنوز فعال نشده است.")
    if coupon.ends_at and coupon.ends_at < now:
        raise CheckoutError("کد تخفیف منقضی شده است.")
    if coupon.usage_limit is not None and coupon.used_count >= coupon.usage_limit:
        raise CheckoutError("ظرفیت استفاده از این کد تخفیف تمام شده است.")

    rules = list(coupon.rules.select_related("category", "product"))
    if rules and not any(_rule_matches(rule, items, subtotal) for rule in rules):
        raise CheckoutError("این کد تخفیف برای سبد خرید شما قابل استفاده نیست.")

    if coupon.discount_type == Coupon.DiscountType.PERCENT:
        discount = subtotal * coupon.value / Decimal("100")
    else:
        discount = coupon.value
    return coupon, min(subtotal, discount.quantize(Decimal("0.01")))


def _shipping_cost(method: str) -> Decimal:
    if method == Order.ShippingMethod.EXPRESS:
        return Decimal(str(settings.EXPRESS_SHIPPING_COST))
    return Decimal(str(settings.STANDARD_SHIPPING_COST))


@transaction.atomic
def release_order_inventory(order: Order, *, cancel_order: bool = False) -> None:
    order = Order.objects.select_for_update().get(pk=order.pk)
    if not order.inventory_reserved:
        return
    for item in order.items.select_related("variant"):
        inventory = Inventory.objects.select_for_update().get(variant=item.variant)
        inventory.reserved_quantity = max(0, inventory.reserved_quantity - item.quantity)
        inventory.save(update_fields=["reserved_quantity", "updated_at"])
    order.inventory_reserved = False
    update_fields = ["inventory_reserved", "updated_at"]
    if cancel_order and order.status == Order.Status.PENDING_PAYMENT:
        previous = order.status
        order.status = Order.Status.CANCELLED
        update_fields.append("status")
        OrderStatusHistory.objects.create(order=order, from_status=previous, to_status=order.status, note="مهلت پرداخت منقضی شد.")
    order.save(update_fields=update_fields)


def release_expired_orders() -> int:
    expired = list(
        Order.objects.filter(
            status=Order.Status.PENDING_PAYMENT,
            inventory_reserved=True,
            expires_at__lt=timezone.now(),
        ).only("id")
    )
    for order in expired:
        release_order_inventory(order, cancel_order=True)
    return len(expired)


@transaction.atomic
def create_pending_order_from_cart(
    cart: Cart,
    address: Address,
    coupon_code: str = "",
    shipping_method: str = Order.ShippingMethod.STANDARD,
    customer_note: str = "",
) -> Order:
    cart = Cart.objects.select_for_update().get(pk=cart.pk)
    items = list(cart.items.select_related("variant", "variant__product", "variant__product__category"))
    if not items:
        raise CheckoutError("سبد خرید خالی است.")
    if cart.user_id is None:
        raise CheckoutError("برای ثبت سفارش ابتدا وارد حساب کاربری شوید.")
    if address.user_id != cart.user_id:
        raise CheckoutError("آدرس ارسال متعلق به این کاربر نیست.")

    subtotal = Decimal("0.00")
    locked_inventory = []
    for item in items:
        if not item.variant.is_active or item.variant.product.status != "active":
            raise CheckoutError("یکی از محصولات سبد دیگر قابل فروش نیست.")
        inventory = Inventory.objects.select_for_update().filter(variant=item.variant).first()
        if inventory is None or inventory.available_quantity < item.quantity:
            raise CheckoutError("موجودی یکی از محصولات کافی نیست.")
        subtotal += item.variant.price * item.quantity
        locked_inventory.append((inventory, item.quantity))

    coupon, discount_total = _resolve_coupon(items, subtotal, coupon_code)
    shipping_total = _shipping_cost(shipping_method)
    snapshot = _address_snapshot(address)
    order = Order.objects.create(
        user=cart.user,
        status=Order.Status.PENDING_PAYMENT,
        subtotal=subtotal,
        discount_total=discount_total,
        shipping_total=shipping_total,
        grand_total=subtotal - discount_total + shipping_total,
        customer_note=customer_note,
        coupon=coupon,
        shipping_method=shipping_method,
        shipping_address=snapshot,
        expires_at=timezone.now() + timedelta(minutes=settings.ORDER_PAYMENT_TIMEOUT_MINUTES),
        inventory_reserved=True,
    )

    for item in items:
        OrderItem.objects.create(
            order=order,
            variant=item.variant,
            product_title=item.variant.product.title,
            sku=item.variant.sku,
            quantity=item.quantity,
            unit_price=item.variant.price,
            line_total=item.variant.price * item.quantity,
        )
    for inventory, quantity in locked_inventory:
        Inventory.objects.filter(pk=inventory.pk).update(reserved_quantity=F("reserved_quantity") + quantity)

    Shipment.objects.create(order=order, status=Shipment.Status.PENDING, carrier=shipping_method, address_snapshot=snapshot)
    OrderStatusHistory.objects.create(order=order, from_status=Order.Status.DRAFT, to_status=Order.Status.PENDING_PAYMENT)
    cart.items.all().delete()
    return order
