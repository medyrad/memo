from django.contrib import admin

from .models import Category, Product, ProductAttribute, ProductImage, ProductVariant

admin.site.register(Category)
admin.site.register(Product)
admin.site.register(ProductVariant)
admin.site.register(ProductImage)
admin.site.register(ProductAttribute)

