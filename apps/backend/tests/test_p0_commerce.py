from datetime import timedelta
from decimal import Decimal

import pytest
from django.utils import timezone
from rest_framework.test import APIClient

from apps.accounts.models import Address, User
from apps.accounts.serializers import UserSerializer
from apps.cart.models import Cart, CartItem
from apps.catalog.models import Category, Product, ProductVariant
from apps.discounts.models import Coupon, DiscountRule
from apps.inventory.models import Inventory
from apps.orders.models import Order
from apps.orders.services import create_pending_order_from_cart, release_expired_orders
from apps.payments.gateways import GatewayVerifyResult
from apps.payments.models import Payment
from apps.reviews.models import Review, Wishlist
from apps.shipping.models import Shipment


@pytest.fixture
def users(db):
    owner = User.objects.create_user(username="owner", email="owner@example.com", password="pass-12345")
    other = User.objects.create_user(username="other", email="other@example.com", password="pass-12345")
    staff = User.objects.create_superuser(username="admin", email="admin@example.com", password="pass-12345")
    return owner, other, staff


@pytest.fixture
def commerce(users):
    owner, _, _ = users
    category = Category.objects.create(title="گردنبند", slug="necklace")
    product = Product.objects.create(category=category, title="گردنبند واقعی", slug="real-necklace", status=Product.Status.ACTIVE)
    variant = ProductVariant.objects.create(product=product, sku="REAL-1", price=Decimal("100000"))
    inventory = Inventory.objects.create(variant=variant, quantity=5)
    cart = Cart.objects.create(user=owner)
    CartItem.objects.create(cart=cart, variant=variant, quantity=2)
    address = Address.objects.create(
        user=owner,
        recipient_name="کاربر تست",
        phone="09120000000",
        province="تهران",
        city="تهران",
        postal_code="1234567890",
        address_line="خیابان تست، پلاک ۱",
        is_default=True,
    )
    return owner, product, variant, inventory, cart, address


@pytest.mark.django_db
def test_sensitive_endpoints_are_staff_only_and_user_data_is_owned(users, commerce):
    owner, other, staff = users
    _, product, variant, _, cart, _ = commerce
    other_address = Address.objects.create(
        user=other, recipient_name="دیگری", phone="09121111111", province="تهران", city="تهران",
        postal_code="1111111111", address_line="آدرس دیگر",
    )
    other_cart = Cart.objects.create(user=other)
    other_item = CartItem.objects.create(cart=other_cart, variant=variant, quantity=1)
    other_order = Order.objects.create(user=other, grand_total=1000)
    other_payment = Payment.objects.create(order=other_order, amount=1000, authority="A-other")
    Wishlist.objects.create(user=owner)
    Wishlist.objects.create(user=other)
    review = Review.objects.create(user=other, product=product, rating=5)

    anonymous = APIClient()
    assert anonymous.get("/api/users/").status_code in [401, 403]

    client = APIClient()
    client.force_authenticate(owner)
    for path in ["/api/users/", "/api/roles/", "/api/permissions/", "/api/inventory/", "/api/coupons/", "/api/audit-logs/"]:
        assert client.get(path).status_code == 403
    assert client.post("/api/blog-posts/", {"title": "x", "slug": "x"}).status_code == 403
    assert client.get(f"/api/addresses/{other_address.id}/").status_code == 404
    assert client.get(f"/api/cart-items/{other_item.id}/").status_code == 404
    assert client.get(f"/api/orders/{other_order.id}/").status_code == 404
    assert client.get(f"/api/payments/{other_payment.id}/").status_code == 404
    assert client.patch(f"/api/reviews/{review.id}/", {"rating": 1}, format="json").status_code == 404
    wishlist_response = client.get("/api/wishlist/")
    assert wishlist_response.status_code == 200
    assert wishlist_response.data["count"] == 1

    client.force_authenticate(staff)
    assert client.get("/api/users/").status_code == 200
    assert client.get("/api/inventory/").status_code == 200


@pytest.mark.django_db
def test_public_user_serializer_cannot_escalate_staff_or_roles(users):
    owner, _, _ = users
    serializer = UserSerializer(
        owner,
        data={"is_staff": True, "is_active": False, "roles": []},
        partial=True,
    )
    assert serializer.is_valid(), serializer.errors
    serializer.save()
    owner.refresh_from_db()
    assert owner.is_staff is False
    assert owner.is_active is True


@pytest.mark.django_db
def test_session_mutations_require_csrf(users, commerce):
    owner, _, _ = users
    _, _, variant, _, _, _ = commerce
    client = APIClient(enforce_csrf_checks=True)

    login_response = client.post(
        "/api/users/login/",
        {"username": owner.username, "password": "pass-12345"},
        format="json",
    )
    assert login_response.status_code == 403
    assert client.post(
        "/api/cart/add_item/",
        {"variant_id": str(variant.id), "quantity": 1},
        format="json",
    ).status_code == 403

    csrf_response = client.get("/api/users/csrf/")
    token = csrf_response.cookies["csrftoken"].value
    login_response = client.post(
        "/api/users/login/",
        {"username": owner.username, "password": "pass-12345"},
        format="json",
        HTTP_X_CSRFTOKEN=token,
    )
    assert login_response.status_code == 200


@pytest.mark.django_db
def test_checkout_applies_rules_snapshots_address_reserves_stock_and_clears_cart(commerce, settings):
    owner, product, _, inventory, cart, address = commerce
    coupon = Coupon.objects.create(code="REAL10", discount_type=Coupon.DiscountType.PERCENT, value=10, usage_limit=2)
    DiscountRule.objects.create(coupon=coupon, min_order_total=150000, product=product)
    settings.EXPRESS_SHIPPING_COST = 39000

    order = create_pending_order_from_cart(cart, address, "REAL10", Order.ShippingMethod.EXPRESS, "زنگ نزنید")

    assert order.subtotal == Decimal("200000")
    assert order.discount_total == Decimal("20000.00")
    assert order.shipping_total == Decimal("39000")
    assert order.grand_total == Decimal("219000.00")
    assert order.shipping_address["postal_code"] == "1234567890"
    assert order.shipping_method == Order.ShippingMethod.EXPRESS
    assert order.inventory_reserved is True
    inventory.refresh_from_db()
    assert inventory.quantity == 5
    assert inventory.reserved_quantity == 2
    assert cart.items.count() == 0
    shipment = Shipment.objects.get(order=order)
    assert shipment.address_snapshot["recipient_name"] == "کاربر تست"
    coupon.refresh_from_db()
    assert coupon.used_count == 0


@pytest.mark.django_db
def test_checkout_rejects_foreign_address(users, commerce):
    _, other, _ = users
    owner, _, _, _, cart, _ = commerce
    foreign_address = Address.objects.create(
        user=other, recipient_name="دیگری", phone="09121111111", province="قم", city="قم",
        postal_code="1111111111", address_line="آدرس دیگر",
    )
    client = APIClient()
    client.force_authenticate(owner)
    response = client.post(
        "/api/orders/checkout/",
        {"cart_id": str(cart.id), "address_id": str(foreign_address.id), "shipping_method": "standard"},
        format="json",
    )
    assert response.status_code == 404


@pytest.mark.django_db
def test_payment_verify_is_server_side_atomic_and_idempotent(monkeypatch, commerce, settings):
    owner, _, _, inventory, cart, address = commerce
    coupon = Coupon.objects.create(code="FIXED", discount_type=Coupon.DiscountType.FIXED, value=10000, usage_limit=1)
    order = create_pending_order_from_cart(cart, address, "FIXED")
    payment = Payment.objects.create(
        order=order,
        provider="zarinpal",
        amount=order.grand_total,
        authority="A-verify",
        idempotency_key="verify-key-1",
    )
    settings.ZARINPAL_MERCHANT_ID = "00000000-0000-0000-0000-000000000000"
    monkeypatch.setattr(
        "apps.payments.services.ZarinpalGateway.verify",
        lambda self, **kwargs: GatewayVerifyResult(reference_id="123456", raw_response={"data": {"code": 100, "ref_id": 123456}}),
    )
    client = APIClient()
    client.force_authenticate(owner)

    first = client.post(f"/api/payments/{payment.id}/verify/", {}, format="json")
    second = client.post(f"/api/payments/{payment.id}/verify/", {}, format="json")
    assert first.status_code == 200, first.data
    assert second.status_code == 200
    payment.refresh_from_db()
    order.refresh_from_db()
    inventory.refresh_from_db()
    coupon.refresh_from_db()
    assert payment.status == Payment.Status.SUCCEEDED
    assert payment.reference_id == "123456"
    assert order.status == Order.Status.PAID
    assert inventory.quantity == 3
    assert inventory.reserved_quantity == 0
    assert coupon.used_count == 1


@pytest.mark.django_db
def test_payment_start_reuses_idempotency_key(monkeypatch, commerce):
    owner, _, _, _, cart, address = commerce
    order = create_pending_order_from_cart(cart, address)

    def fake_request(payment):
        payment.authority = "A-idempotent"
        payment.save(update_fields=["authority", "updated_at"])
        return payment, "https://gateway.example/A-idempotent"

    monkeypatch.setattr("apps.payments.views.request_gateway_payment", fake_request)
    client = APIClient()
    client.force_authenticate(owner)
    payload = {"order_id": str(order.id), "idempotency_key": "checkout-attempt-1"}
    first = client.post("/api/payments/start/", payload, format="json")
    second = client.post("/api/payments/start/", payload, format="json")
    assert first.status_code == 201
    assert second.status_code == 200
    assert first.data["id"] == second.data["id"]
    assert Payment.objects.filter(order=order).count() == 1


@pytest.mark.django_db
def test_concurrent_payment_start_does_not_create_a_second_gateway_request(monkeypatch, commerce):
    owner, _, _, _, cart, address = commerce
    order = create_pending_order_from_cart(cart, address)
    Payment.objects.create(
        order=order,
        amount=order.grand_total,
        idempotency_key="concurrent-attempt",
        gateway_request_started_at=timezone.now(),
    )
    gateway_called = False

    def unexpected_gateway_call(payment):
        nonlocal gateway_called
        gateway_called = True
        raise AssertionError("gateway must not be called by the concurrent request")

    monkeypatch.setattr("apps.payments.views.request_gateway_payment", unexpected_gateway_call)
    client = APIClient()
    client.force_authenticate(owner)
    response = client.post(
        "/api/payments/start/",
        {"order_id": str(order.id), "idempotency_key": "concurrent-attempt"},
        format="json",
    )

    assert response.status_code == 409
    assert response.data["code"] == "payment_initializing"
    assert gateway_called is False


@pytest.mark.django_db
def test_gateway_callback_verifies_on_server_without_user_session(monkeypatch, commerce, settings):
    _, _, _, _, cart, address = commerce
    order = create_pending_order_from_cart(cart, address)
    payment = Payment.objects.create(order=order, amount=order.grand_total, authority="A-callback")
    settings.STOREFRONT_URL = "https://shop.example"
    settings.ZARINPAL_MERCHANT_ID = "00000000-0000-0000-0000-000000000000"
    monkeypatch.setattr(
        "apps.payments.services.ZarinpalGateway.verify",
        lambda self, **kwargs: GatewayVerifyResult(reference_id="654321", raw_response={"data": {"code": 100, "ref_id": 654321}}),
    )

    response = APIClient().get("/api/payments/callback/?Authority=A-callback&Status=OK")

    assert response.status_code == 302
    assert response.url == f"https://shop.example/checkout/success?payment={payment.id}", response.url
    payment.refresh_from_db()
    assert payment.status == Payment.Status.SUCCEEDED


@pytest.mark.django_db
def test_expired_order_releases_reserved_inventory(commerce):
    _, _, _, inventory, cart, address = commerce
    order = create_pending_order_from_cart(cart, address)
    Order.objects.filter(pk=order.pk).update(expires_at=timezone.now() - timedelta(minutes=1))
    assert release_expired_orders() == 1
    order.refresh_from_db()
    inventory.refresh_from_db()
    assert order.status == Order.Status.CANCELLED
    assert order.inventory_reserved is False
    assert inventory.quantity == 5
    assert inventory.reserved_quantity == 0
