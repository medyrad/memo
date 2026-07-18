from django.conf import settings
from django.db import models

from apps.common import TimeStampedModel


class Notification(TimeStampedModel):
    class Channel(models.TextChoices):
        EMAIL = "email", "Email"
        SMS = "sms", "SMS"
        IN_APP = "in_app", "In app"

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        SENT = "sent", "Sent"
        FAILED = "failed", "Failed"
        SKIPPED = "skipped", "Skipped"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notifications")
    channel = models.CharField(max_length=30, choices=Channel.choices)
    subject = models.CharField(max_length=180)
    body = models.TextField()
    recipient = models.CharField(max_length=80, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    provider_reference = models.CharField(max_length=160, blank=True)
    error_message = models.CharField(max_length=500, blank=True)
    provider_response = models.JSONField(default=dict, blank=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    read_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        indexes = [models.Index(fields=["user", "read_at"]), models.Index(fields=["channel", "status", "created_at"], name="notificatio_channel_bfbc35_idx")]
