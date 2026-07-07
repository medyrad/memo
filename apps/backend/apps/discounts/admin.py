from django.contrib import admin

from .models import Coupon, DiscountRule

admin.site.register(Coupon)
admin.site.register(DiscountRule)

