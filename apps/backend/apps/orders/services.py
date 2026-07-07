from decimal import Decimal

from django.utils import timezone
from django.db import transaction

from apps.cart.models import Cart
from apps.discounts.models import Coupon
from apps.inventory.models import Inventory

from .models import Order, OrderItem, OrderStatusHistory


class CheckoutError(ValueError):
    pass


def _calculate_discount(subtotal: Decimal, coupon_code: str = "") -> Decimal:
    if not coupon_code:
        return Decimal("0.00")

    coupon = Coupon.objects.filter(code__iexact=coupon_code, is_active=True).first()
    if coupon is None:
        raise CheckoutError("کد تخفیف معتبر نیست.")
    now = timezone.now()
    if coupon.starts_at and coupon.starts_at > now:
        raise CheckoutError("کد تخفیف هنوز فعال نشده است.")
    if coupon.ends_at and coupon.ends_at < now:
        raise CheckoutError("کد تخفیف منقضی شده است.")
    if coupon.usage_limit is not None and coupon.used_count >= coupon.usage_limit:
        raise CheckoutError("ظرفیت استفاده از این کد تخفیف تمام شده است.")

    if coupon.discount_type == Coupon.DiscountType.PERCENT:
        return min(subtotal, subtotal * coupon.value / Decimal("100"))
    return min(subtotal, coupon.value)


@transaction.atomic
def create_pending_order_from_cart(cart: Cart, coupon_code: str = "") -> Order:
    items = list(cart.items.select_related("variant", "variant__product"))
    if not items:
        raise CheckoutError("سبد خرید خالی است.")
    if cart.user_id is None:
        raise CheckoutError("برای ثبت سفارش ابتدا وارد حساب کاربری شوید.")

    subtotal = Decimal("0.00")
    for item in items:
        inventory = Inventory.objects.select_for_update().filter(variant=item.variant).first()
        if inventory is None or inventory.quantity < item.quantity:
            raise CheckoutError("موجودی یکی از محصولات کافی نیست.")
        subtotal += item.variant.price * item.quantity

    discount_total = _calculate_discount(subtotal, coupon_code)
    shipping_total = Decimal("0.00")
    grand_total = subtotal - discount_total + shipping_total

    order = Order.objects.create(
        user=cart.user,
        status=Order.Status.PENDING_PAYMENT,
        subtotal=subtotal,
        discount_total=discount_total,
        shipping_total=shipping_total,
        grand_total=grand_total,
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

    OrderStatusHistory.objects.create(order=order, from_status=Order.Status.DRAFT, to_status=Order.Status.PENDING_PAYMENT)
    return order
