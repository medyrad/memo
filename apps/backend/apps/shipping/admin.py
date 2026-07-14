from django.contrib import admin

from .models import Shipment


@admin.register(Shipment)
class ShipmentAdmin(admin.ModelAdmin):
    list_display = ["order", "carrier", "tracking_code", "status", "shipped_at", "delivered_at"]
    list_filter = ["carrier", "status"]
    search_fields = ["order__id", "tracking_code"]
    readonly_fields = ["address_snapshot", "created_at", "updated_at"]
