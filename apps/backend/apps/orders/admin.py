from django.contrib import admin

from .models import Order, OrderItem, OrderStatusHistory


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    can_delete = False
    readonly_fields = ["variant", "product_title", "sku", "quantity", "unit_price", "line_total"]


class OrderStatusHistoryInline(admin.TabularInline):
    model = OrderStatusHistory
    extra = 0
    can_delete = False
    readonly_fields = ["from_status", "to_status", "note", "changed_by", "created_at"]


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ["id", "customer", "status", "grand_total", "shipping_method", "created_at"]
    list_filter = ["status", "shipping_method", "created_at"]
    search_fields = ["id", "user__username", "user__email", "user__phone"]
    readonly_fields = [
        "user", "subtotal", "discount_total", "shipping_total", "grand_total", "coupon",
        "shipping_address", "inventory_reserved", "expires_at", "created_at", "updated_at",
    ]
    inlines = [OrderItemInline, OrderStatusHistoryInline]

    @admin.display(description="مشتری")
    def customer(self, obj):
        return obj.user.get_full_name() or obj.user.username


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ["order", "product_title", "sku", "quantity", "line_total"]
    search_fields = ["order__id", "product_title", "sku"]
    readonly_fields = [field.name for field in OrderItem._meta.fields]


@admin.register(OrderStatusHistory)
class OrderStatusHistoryAdmin(admin.ModelAdmin):
    list_display = ["order", "from_status", "to_status", "changed_by", "created_at"]
    list_filter = ["to_status"]
    search_fields = ["order__id", "note"]
    readonly_fields = [field.name for field in OrderStatusHistory._meta.fields]
