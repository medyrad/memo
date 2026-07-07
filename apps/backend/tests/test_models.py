import pytest
from django.contrib.auth import get_user_model

from apps.catalog.models import Category, Product, ProductVariant
from apps.inventory.models import Inventory


@pytest.mark.django_db
def test_product_variant_inventory_low_stock_flag():
    category = Category.objects.create(title="گردنبند", slug="necklaces")
    product = Product.objects.create(category=category, title="گردنبند مینیمال", slug="minimal-necklace", status=Product.Status.ACTIVE)
    variant = ProductVariant.objects.create(product=product, sku="N-001", price="850000.00")
    inventory = Inventory.objects.create(variant=variant, quantity=2, low_stock_threshold=3)

    assert inventory.is_low_stock is True


@pytest.mark.django_db
def test_custom_user_uses_uuid_primary_key():
    user = get_user_model().objects.create_user(username="memo", email="memo@example.com", password="test-pass")

    assert user.id is not None
    assert user.email == "memo@example.com"

