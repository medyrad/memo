from django.core.exceptions import ObjectDoesNotExist
from rest_framework import serializers

from .models import Category, Product, ProductAttribute, ProductImage, ProductVariant


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class ProductVariantSerializer(serializers.ModelSerializer):
    available_quantity = serializers.SerializerMethodField()

    class Meta:
        model = ProductVariant
        fields = "__all__"

    def get_available_quantity(self, obj):
        try:
            return obj.inventory.available_quantity
        except ObjectDoesNotExist:
            return 0


class ProductImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = "__all__"

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get("request")
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return obj.external_url

    def validate(self, attrs):
        image = attrs.get("image", getattr(self.instance, "image", None))
        external_url = attrs.get("external_url", getattr(self.instance, "external_url", ""))
        if not image and not external_url:
            raise serializers.ValidationError("فایل تصویر یا آدرس خارجی تصویر الزامی است.")
        return attrs


class ProductAttributeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductAttribute
        fields = "__all__"


class ProductSerializer(serializers.ModelSerializer):
    variants = ProductVariantSerializer(many=True, read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    attributes = ProductAttributeSerializer(many=True, read_only=True)
    category_title = serializers.CharField(source="category.title", read_only=True)
    category_slug = serializers.CharField(source="category.slug", read_only=True)
    rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = "__all__"

    def get_rating(self, obj):
        reviews = [review.rating for review in obj.reviews.all() if review.status == "approved"]
        return round(sum(reviews) / len(reviews), 1) if reviews else 0

    def get_review_count(self, obj):
        return sum(1 for review in obj.reviews.all() if review.status == "approved")
