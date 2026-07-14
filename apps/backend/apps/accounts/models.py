import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models

from apps.common import TimeStampedModel


class Permission(TimeStampedModel):
    code = models.CharField(max_length=120, unique=True)
    name = models.CharField(max_length=150)
    description = models.TextField(blank=True)

    def __str__(self) -> str:
        return self.code


class Role(TimeStampedModel):
    name = models.CharField(max_length=120, unique=True)
    permissions = models.ManyToManyField(Permission, blank=True, related_name="roles")

    def __str__(self) -> str:
        return self.name


class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True, null=True, blank=True)
    phone = models.CharField(max_length=20, unique=True, null=True, blank=True)
    roles = models.ManyToManyField(Role, blank=True, related_name="users")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    REQUIRED_FIELDS = []


class CustomerProfile(TimeStampedModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="customer_profile")
    birth_date = models.DateField(null=True, blank=True)
    marketing_opt_in = models.BooleanField(default=False)
    loyalty_points = models.PositiveIntegerField(default=0)

    def __str__(self) -> str:
        return str(self.user)


class Address(TimeStampedModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="addresses")
    title = models.CharField(max_length=80, default="آدرس اصلی")
    recipient_name = models.CharField(max_length=160)
    phone = models.CharField(max_length=20)
    province = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    address_line = models.TextField()
    is_default = models.BooleanField(default=False)

    class Meta:
        indexes = [models.Index(fields=["user", "is_default"])]
        constraints = [
            models.UniqueConstraint(fields=["user"], condition=models.Q(is_default=True), name="one_default_address_per_user"),
        ]

    def __str__(self) -> str:
        return f"{self.title} - {self.city}"
