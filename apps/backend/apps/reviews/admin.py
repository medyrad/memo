from django.contrib import admin

from .models import Review, Wishlist, WishlistItem

admin.site.register(Wishlist)
admin.site.register(WishlistItem)
admin.site.register(Review)

