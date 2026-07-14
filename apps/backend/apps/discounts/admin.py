from django.contrib import admin

from .models import Coupon, DiscountRule


class DiscountRuleInline(admin.TabularInline):
    model = DiscountRule
    extra = 0


@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ["code", "discount_type", "value", "used_count", "usage_limit", "is_active", "ends_at"]
    list_editable = ["is_active"]
    list_filter = ["discount_type", "is_active"]
    search_fields = ["code"]
    readonly_fields = ["used_count"]
    inlines = [DiscountRuleInline]


@admin.register(DiscountRule)
class DiscountRuleAdmin(admin.ModelAdmin):
    list_display = ["coupon", "min_order_total", "category", "product"]
    list_filter = ["category"]
    autocomplete_fields = ["product"]
