from rest_framework import viewsets

from .models import Review, Wishlist, WishlistItem
from .serializers import ReviewSerializer, WishlistItemSerializer, WishlistSerializer


class WishlistViewSet(viewsets.ModelViewSet):
    queryset = Wishlist.objects.prefetch_related("items").all()
    serializer_class = WishlistSerializer
    filterset_fields = ["user"]


class WishlistItemViewSet(viewsets.ModelViewSet):
    queryset = WishlistItem.objects.select_related("wishlist", "product").all()
    serializer_class = WishlistItemSerializer
    filterset_fields = ["wishlist", "product"]


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.select_related("user", "product").all().order_by("-created_at")
    serializer_class = ReviewSerializer
    filterset_fields = ["product", "user", "status", "rating"]

