from django.contrib import admin

from .models import Review, Wishlist, WishlistItem


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ["product", "user", "rating", "status", "created_at"]
    list_filter = ["status", "rating"]
    list_editable = ["status"]
    search_fields = ["product__title", "user__username", "title", "body"]


admin.site.register(Wishlist)
admin.site.register(WishlistItem)
