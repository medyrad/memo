from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Review, Wishlist, WishlistItem
from .serializers import ReviewSerializer, WishlistItemSerializer, WishlistSerializer


class WishlistViewSet(viewsets.ModelViewSet):
    queryset = Wishlist.objects.prefetch_related("items").all().order_by("-created_at")
    serializer_class = WishlistSerializer
    filterset_fields = ["user"]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset if self.request.user.is_staff else queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class WishlistItemViewSet(viewsets.ModelViewSet):
    queryset = WishlistItem.objects.select_related("wishlist", "product").all().order_by("-created_at")
    serializer_class = WishlistItemSerializer
    filterset_fields = ["wishlist", "product"]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset if self.request.user.is_staff else queryset.filter(wishlist__user=self.request.user)

    def perform_create(self, serializer):
        wishlist, _ = Wishlist.objects.get_or_create(user=self.request.user)
        serializer.save(wishlist=wishlist)


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.select_related("user", "product").all().order_by("-created_at")
    serializer_class = ReviewSerializer
    filterset_fields = ["product", "user", "status", "rating"]

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            from rest_framework.permissions import AllowAny
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.request.user.is_staff:
            return queryset
        if self.action in ["list", "retrieve"]:
            return queryset.filter(status="approved")
        return queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, status="pending")
