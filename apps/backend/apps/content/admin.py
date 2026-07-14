from django.contrib import admin

from .models import Banner, BlogPost, HomepageSection, Page, SiteSetting


@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ["title", "slug", "is_published", "updated_at"]
    list_editable = ["is_published"]
    search_fields = ["title", "body"]
    prepopulated_fields = {"slug": ["title"]}


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ["title", "is_published", "published_at", "updated_at"]
    list_filter = ["is_published"]
    search_fields = ["title", "excerpt", "body"]
    prepopulated_fields = {"slug": ["title"]}


@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ["title", "placement", "sort_order", "is_active"]
    list_editable = ["sort_order", "is_active"]
    list_filter = ["placement", "is_active"]
    search_fields = ["title", "subtitle"]


@admin.register(HomepageSection)
class HomepageSectionAdmin(admin.ModelAdmin):
    list_display = ["title", "key", "kind", "sort_order", "is_active"]
    list_editable = ["sort_order", "is_active"]
    list_filter = ["kind", "is_active"]
    search_fields = ["title", "subtitle", "key"]


@admin.register(SiteSetting)
class SiteSettingAdmin(admin.ModelAdmin):
    list_display = ["label", "key", "is_public", "updated_at"]
    list_editable = ["is_public"]
    search_fields = ["label", "key"]
