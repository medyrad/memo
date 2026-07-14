from django.contrib import admin

from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ["id", "order", "provider", "status", "amount", "reference_id", "created_at"]
    list_filter = ["provider", "status", "created_at"]
    search_fields = ["id", "order__id", "authority", "reference_id", "idempotency_key"]
    readonly_fields = [field.name for field in Payment._meta.fields]
