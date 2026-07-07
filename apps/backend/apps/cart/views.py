from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.catalog.models import ProductVariant
from .models import Cart, CartItem
from .serializers import AddCartItemSerializer, CartItemSerializer, CartSerializer, UpdateCartItemSerializer


class CartViewSet(viewsets.ModelViewSet):
    queryset = Cart.objects.prefetch_related("items", "items__variant", "items__variant__product").all().order_by("-updated_at")
    serializer_class = CartSerializer

    def _get_current_cart(self, request):
        if request.user.is_authenticated:
            cart, _ = Cart.objects.get_or_create(user=request.user)
            return cart
        if not request.session.session_key:
            request.session.create()
        cart, _ = Cart.objects.get_or_create(session_key=request.session.session_key, user=None)
        return cart

    @action(detail=False, methods=["get"])
    def current(self, request):
        cart = self._get_current_cart(request)
        return Response(CartSerializer(cart).data)

    @action(detail=False, methods=["post"])
    def add_item(self, request):
        serializer = AddCartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        cart = self._get_current_cart(request)
        try:
            variant = ProductVariant.objects.get(id=serializer.validated_data["variant_id"], is_active=True)
        except ProductVariant.DoesNotExist:
            return Response({"code": "variant_not_found", "message": "تنوع محصول پیدا نشد."}, status=status.HTTP_404_NOT_FOUND)

        item, created = CartItem.objects.get_or_create(cart=cart, variant=variant, defaults={"quantity": serializer.validated_data["quantity"]})
        if not created:
            item.quantity += serializer.validated_data["quantity"]
            item.save(update_fields=["quantity", "updated_at"])
        return Response(CartItemSerializer(item).data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


class CartItemViewSet(viewsets.ModelViewSet):
    queryset = CartItem.objects.select_related("cart", "variant").all()
    serializer_class = CartItemSerializer
    filterset_fields = ["cart", "variant"]

    @action(detail=True, methods=["post"])
    def set_quantity(self, request, pk=None):
        item = self.get_object()
        serializer = UpdateCartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        item.quantity = serializer.validated_data["quantity"]
        item.save(update_fields=["quantity", "updated_at"])
        return Response(CartItemSerializer(item).data)
