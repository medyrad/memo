from django.core.management.base import BaseCommand

from apps.orders.services import release_expired_orders


class Command(BaseCommand):
    help = "Release inventory reservations for expired pending-payment orders."

    def handle(self, *args, **options):
        count = release_expired_orders()
        self.stdout.write(self.style.SUCCESS(f"Released {count} expired order reservation(s)."))
