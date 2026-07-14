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

    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset if self.request.user.is_staff else queryset.filter(is_active=True)


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.select_related("category").prefetch_related("variants", "variants__inventory", "images", "attributes", "reviews").all().order_by("-created_at")
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrReadOnly]
    filterset_fields = ["category", "category__slug", "status", "slug"]
    search_fields = ["title", "slug", "short_description"]
    ordering_fields = ["created_at", "title"]

    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset if self.request.user.is_staff else queryset.filter(status=Product.Status.ACTIVE, category__is_active=True)


class ProductVariantViewSet(viewsets.ModelViewSet):
    queryset = ProductVariant.objects.select_related("product").all()
    serializer_class = ProductVariantSerializer
    permission_classes = [IsAdminOrReadOnly]
    filterset_fields = ["product", "is_active", "color", "material", "size"]

    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset if self.request.user.is_staff else queryset.filter(is_active=True, product__status=Product.Status.ACTIVE)


class ProductImageViewSet(viewsets.ModelViewSet):
    queryset = ProductImage.objects.select_related("product").all()
    serializer_class = ProductImageSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset if self.request.user.is_staff else queryset.filter(product__status=Product.Status.ACTIVE)
