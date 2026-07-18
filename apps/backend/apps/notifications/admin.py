from django.contrib import admin

from .models import Notification

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ("subject", "user", "channel", "recipient", "status", "sent_at", "created_at")
    list_filter = ("channel", "status", "created_at")
    search_fields = ("subject", "recipient", "user__username", "user__email")
    readonly_fields = ("provider_reference", "provider_response", "error_message", "sent_at", "created_at", "updated_at")
