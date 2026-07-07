from django.contrib import admin

from .models import Banner, BlogPost, Page

admin.site.register(Page)
admin.site.register(BlogPost)
admin.site.register(Banner)

