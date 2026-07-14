from rest_framework import serializers

from apps.catalog.serializers import ProductSerializer

from .models import Review, Wishlist, WishlistItem


class WishlistItemSerializer(serializers.ModelSerializer):
    product_detail = ProductSerializer(source="product", read_only=True)

    class Meta:
        model = WishlistItem
        fields = "__all__"
        read_only_fields = ["wishlist"]


class WishlistSerializer(serializers.ModelSerializer):
    items = WishlistItemSerializer(many=True, read_only=True)

    class Meta:
        model = Wishlist
        fields = "__all__"
        read_only_fields = ["user"]


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = "__all__"
        read_only_fields = ["user", "status"]

    def validate_rating(self, value):
        if not 1 <= value <= 5:
            raise serializers.ValidationError("امتیاز باید بین ۱ تا ۵ باشد.")
        return value
