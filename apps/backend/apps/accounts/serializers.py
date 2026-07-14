from django.contrib.auth import authenticate
from django.db.models import Q
from rest_framework import serializers

from .models import Address, CustomerProfile, Permission, Role, User


class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = "__all__"


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "phone", "first_name", "last_name", "is_active", "is_staff", "roles", "created_at", "updated_at"]
        read_only_fields = ["is_active", "is_staff", "roles", "created_at", "updated_at"]


class CustomerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerProfile
        fields = "__all__"
        read_only_fields = ["user", "loyalty_points"]


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = "__all__"
        read_only_fields = ["user"]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ["id", "username", "email", "phone", "first_name", "last_name", "password"]
        read_only_fields = ["id"]

    def create(self, validated_data):
        password = validated_data.pop("password")
        email = validated_data.get("email")
        validated_data["email"] = email or None
        if not validated_data.get("phone") and validated_data.get("username", "").startswith("09"):
            validated_data["phone"] = validated_data["username"]
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        CustomerProfile.objects.create(user=user)
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        identifier = attrs["username"].strip()
        matched_user = User.objects.filter(Q(username__iexact=identifier) | Q(email__iexact=identifier) | Q(phone=identifier)).first()
        user = authenticate(username=matched_user.username, password=attrs["password"]) if matched_user else None
        if user is None:
            raise serializers.ValidationError("نام کاربری یا رمز عبور درست نیست.")
        if not user.is_active:
            raise serializers.ValidationError("حساب کاربری غیرفعال است.")
        attrs["user"] = user
        return attrs
