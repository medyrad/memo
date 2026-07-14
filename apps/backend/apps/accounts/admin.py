from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import Address, CustomerProfile, Permission, Role, User


class AddressInline(admin.TabularInline):
    model = Address
    extra = 0


@admin.register(User)
class MemoUserAdmin(UserAdmin):
    list_display = ["username", "email", "phone", "first_name", "last_name", "is_staff", "is_active"]
    list_filter = ["is_staff", "is_active", "roles"]
    search_fields = ["username", "email", "phone", "first_name", "last_name"]
    fieldsets = UserAdmin.fieldsets + (("اطلاعات فروشگاه", {"fields": ("phone", "roles")}),)
    add_fieldsets = UserAdmin.add_fieldsets + (("اطلاعات فروشگاه", {"fields": ("email", "phone", "roles")}),)
    inlines = [AddressInline]


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ["title", "user", "recipient_name", "province", "city", "is_default"]
    list_filter = ["province", "city", "is_default"]
    search_fields = ["user__username", "recipient_name", "phone", "postal_code", "address_line"]


admin.site.register(Permission)
admin.site.register(Role)
admin.site.register(CustomerProfile)
