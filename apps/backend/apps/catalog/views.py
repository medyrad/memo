from rest_framework import viewsets

from apps.common_permissions import IsAdminOrReadOnly

from .models import Category, Product, ProductImage, ProductVariant
from .serializers import CategorySerializer, ProductImageSerializer, ProductSerializer, ProductVariantSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    filterset_fields = ["parent", "is_active"]
    search_fields = ["title", "slug"]


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.select_related("category").prefetch_related("variants", "images", "attributes").all().order_by("-created_at")
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrReadOnly]
    filterset_fields = ["category", "status"]
    search_fields = ["title", "slug", "short_description"]
    ordering_fields = ["created_at", "title"]


class ProductVariantViewSet(viewsets.ModelViewSet):
    queryset = ProductVariant.objects.select_related("product").all()
    serializer_class = ProductVariantSerializer
    permission_classes = [IsAdminOrReadOnly]
    filterset_fields = ["product", "is_active", "color", "material", "size"]


class ProductImageViewSet(viewsets.ModelViewSet):
    queryset = ProductImage.objects.select_related("product").all()
    serializer_class = ProductImageSerializer
    permission_classes = [IsAdminOrReadOnly]
