import pytest
from django.core.management import call_command
from rest_framework.test import APIClient

from apps.accounts.models import User
from apps.catalog.models import Category, Product
from apps.content.models import Banner, HomepageSection, SiteSetting


@pytest.mark.django_db
def test_starter_catalog_seed_is_complete_and_idempotent():
    call_command("seed_initial_catalog")
    call_command("seed_initial_catalog")

    assert Category.objects.filter(slug__in=["necklaces", "bracelets", "gifts", "bags"], is_active=True).count() == 4
    assert Product.objects.filter(status=Product.Status.ACTIVE).count() == 24
    assert Product.objects.filter(variants__inventory__isnull=False).distinct().count() == 24
    assert Product.objects.filter(images__is_primary=True).distinct().count() == 24
    assert Banner.objects.filter(placement="home-hero", is_active=True).exists()
    assert HomepageSection.objects.filter(key="home-best-sellers", is_active=True).exists()
    assert SiteSetting.objects.filter(key="contact", is_public=True).exists()
    assert SiteSetting.objects.filter(key="footer", is_public=True).exists()


@pytest.mark.django_db
def test_catalog_and_public_cms_are_readable_but_only_staff_can_mutate():
    call_command("seed_initial_catalog")
    anonymous = APIClient()
    for path in ["/api/products/", "/api/categories/", "/api/banners/", "/api/homepage-sections/", "/api/site-settings/"]:
        assert anonymous.get(path).status_code == 200

    user = User.objects.create_user(username="customer", password="safe-pass-123")
    client = APIClient()
    client.force_authenticate(user)
    assert client.post("/api/banners/", {"title": "غیرمجاز", "placement": "home"}, format="json").status_code == 403
    assert client.post("/api/products/", {"title": "غیرمجاز", "slug": "forbidden"}, format="json").status_code == 403

    staff = User.objects.create_superuser(username="operator", email="operator@example.com", password="safe-pass-123")
    client.force_authenticate(staff)
    response = client.post(
        "/api/banners/",
        {"title": "بنر عملیاتی", "placement": "home", "external_url": "https://example.com/banner.webp"},
        format="json",
    )
    assert response.status_code == 201
