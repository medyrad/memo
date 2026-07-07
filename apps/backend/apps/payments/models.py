from django.db import models

from apps.common import TimeStampedModel


class Payment(TimeStampedModel):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        SUCCEEDED = "succeeded", "Succeeded"
        FAILED = "failed", "Failed"
        REFUNDED = "refunded", "Refunded"

    order = models.ForeignKey("orders.Order", on_delete=models.CASCADE, related_name="payments")
    provider = models.CharField(max_length=80, default="manual")
    status = models.CharField(max_length=30, choices=Status.choices, default=Status.PENDING)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    authority = models.CharField(max_length=160, blank=True)
    reference_id = models.CharField(max_length=160, blank=True)
    raw_response = models.JSONField(default=dict, blank=True)

    class Meta:
        indexes = [models.Index(fields=["order", "status"]), models.Index(fields=["authority"])]

