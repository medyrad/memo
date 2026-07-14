from django.db import models

from apps.common import TimeStampedModel


class Payment(TimeStampedModel):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        SUCCEEDED = "succeeded", "Succeeded"
        FAILED = "failed", "Failed"
        REFUNDED = "refunded", "Refunded"

    order = models.ForeignKey("orders.Order", on_delete=models.CASCADE, related_name="payments")
    provider = models.CharField(max_length=80, default="zarinpal")
    status = models.CharField(max_length=30, choices=Status.choices, default=Status.PENDING)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    authority = models.CharField(max_length=160, null=True, blank=True, unique=True)
    reference_id = models.CharField(max_length=160, null=True, blank=True, unique=True)
    idempotency_key = models.CharField(max_length=80, null=True, blank=True, unique=True)
    gateway_request_started_at = models.DateTimeField(null=True, blank=True)
    failure_reason = models.CharField(max_length=250, blank=True)
    raw_response = models.JSONField(default=dict, blank=True)

    class Meta:
        indexes = [models.Index(fields=["order", "status"]), models.Index(fields=["authority"])]
        constraints = [
            models.CheckConstraint(check=models.Q(amount__gt=0), name="payment_amount_positive"),
        ]
