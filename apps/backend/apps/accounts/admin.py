from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import Address, CustomerProfile, Permission, Role, User

admin.site.register(User, UserAdmin)
admin.site.register(Permission)
admin.site.register(Role)
admin.site.register(CustomerProfile)
admin.site.register(Address)

