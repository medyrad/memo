from django.conf import settings
from django.core.management import call_command
from django.core.management.base import BaseCommand, CommandError

from apps.accounts.models import Address, User


class Command(BaseCommand):
    help = "Seed deterministic users and catalog for Playwright. Refuses non-E2E settings."

    def handle(self, *args, **options):
        if not settings.PAYMENT_GATEWAY_TEST_MODE:
            raise CommandError("seed_e2e is only allowed with PAYMENT_GATEWAY_TEST_MODE.")
        call_command("seed_initial_catalog")
        admin, _ = User.objects.get_or_create(username="e2e-admin", defaults={"email": "e2e-admin@example.com", "is_staff": True, "is_superuser": True})
        admin.is_staff = True; admin.is_superuser = True; admin.set_password("Admin-pass-123"); admin.save()
        customer, _ = User.objects.get_or_create(username="e2e-customer", defaults={"email": "e2e@example.com", "phone": "09120000001"})
        customer.set_password("Customer-pass-123"); customer.save()
        Address.objects.update_or_create(user=customer, is_default=True, defaults={"title":"منزل","recipient_name":"کاربر تست","phone":"09120000001","province":"تهران","city":"تهران","postal_code":"1234567890","address_line":"خیابان تست، پلاک ۱"})
        self.stdout.write(self.style.SUCCESS("E2E data is ready."))
