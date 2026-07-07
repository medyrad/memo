from django.db import models

from apps.common import TimeStampedModel


class Shipment(TimeStampedModel):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        READY = "ready", "Ready"
        SHIPPED = "shipped", "Shipped"
        DELIVERED = "delivered", "Delivered"
        RETURNED = "returned", "Returned"

    order = models.ForeignKey("orders.Order", on_delete=models.CASCADE, related_name="shipments")
    status = models.CharField(max_length=30, choices=Status.choices, default=Status.PENDING)
    carrier = models.CharField(max_length=100, blank=True)
    tracking_code = models.CharField(max_length=120, blank=True)
    address_snapshot = models.JSONField(default=dict, blank=True)
    shipped_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        indexes = [models.Index(fields=["order", "status"]), models.Index(fields=["tracking_code"])]

