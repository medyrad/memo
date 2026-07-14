from django.contrib import admin

from .models import Inventory


@admin.register(Inventory)
class InventoryAdmin(admin.ModelAdmin):
    list_display = ["sku", "product", "quantity", "reserved_quantity", "available", "low_stock_threshold"]
    list_editable = ["quantity", "low_stock_threshold"]
    list_filter = ["variant__product__category"]
    search_fields = ["variant__sku", "variant__product__title"]
    autocomplete_fields = ["variant"]

    @admin.display(description="SKU")
    def sku(self, obj):
        return obj.variant.sku

    @admin.display(description="محصول")
    def product(self, obj):
        return obj.variant.product

    @admin.display(description="قابل فروش")
    def available(self, obj):
        return obj.available_quantity
