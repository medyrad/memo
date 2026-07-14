from django.contrib import admin

from apps.inventory.models import Inventory

from .models import Category, Product, ProductAttribute, ProductImage, ProductVariant


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 0
    fields = ["image", "external_url", "alt_text", "sort_order", "is_primary"]


class ProductAttributeInline(admin.TabularInline):
    model = ProductAttribute
    extra = 0


class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 0
    fields = ["sku", "color", "material", "size", "price", "compare_at_price", "is_active"]


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["title", "slug", "parent", "is_active", "sort_order"]
    list_editable = ["is_active", "sort_order"]
    list_filter = ["is_active", "parent"]
    search_fields = ["title", "slug"]
    prepopulated_fields = {"slug": ["title"]}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["title", "category", "status", "variant_count", "created_at"]
    list_filter = ["status", "category"]
    search_fields = ["title", "slug", "variants__sku"]
    prepopulated_fields = {"slug": ["title"]}
    readonly_fields = ["created_at", "updated_at"]
    inlines = [ProductVariantInline, ProductImageInline, ProductAttributeInline]
    actions = ["activate_products", "archive_products"]

    @admin.display(description="تعداد تنوع")
    def variant_count(self, obj):
        return obj.variants.count()

    @admin.action(description="فعال‌کردن محصولات انتخاب‌شده")
    def activate_products(self, request, queryset):
        queryset.update(status=Product.Status.ACTIVE)

    @admin.action(description="آرشیو محصولات انتخاب‌شده")
    def archive_products(self, request, queryset):
        queryset.update(status=Product.Status.ARCHIVED)


@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):
    list_display = ["sku", "product", "price", "is_active", "stock"]
    list_filter = ["is_active", "product__category"]
    list_editable = ["price", "is_active"]
    search_fields = ["sku", "product__title"]
    autocomplete_fields = ["product"]

    @admin.display(description="موجودی")
    def stock(self, obj):
        try:
            return obj.inventory.available_quantity
        except Inventory.DoesNotExist:
            return 0


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ["product", "alt_text", "is_primary", "sort_order"]
    list_filter = ["is_primary"]
    search_fields = ["product__title", "alt_text"]
    autocomplete_fields = ["product"]


@admin.register(ProductAttribute)
class ProductAttributeAdmin(admin.ModelAdmin):
    list_display = ["product", "name", "value"]
    search_fields = ["product__title", "name", "value"]
    autocomplete_fields = ["product"]
