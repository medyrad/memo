from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import MethodNotAllowed
from rest_framework.response import Response

from apps.catalog.models import ProductVariant
from .models import Cart, CartItem
from .serializers import AddCartItemSerializer, CartItemSerializer, CartSerializer, UpdateCartItemSerializer


@method_decorator(csrf_protect, name="dispatch")
class CartViewSet(viewsets.ModelViewSet):
    queryset = Cart.objects.prefetch_related("items", "items__variant", "items__variant__product").all().order_by("-updated_at")
    serializer_class = CartSerializer
    http_method_names = ["get", "post", "head", "options"]
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.request.user.is_authenticated:
            return queryset.filter(user=self.request.user)
        session_key = self.request.session.session_key
        return queryset.filter(user=None, session_key=session_key) if session_key else queryset.none()

    def create(self, request, *args, **kwargs):
        raise MethodNotAllowed("POST")

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


@method_decorator(csrf_protect, name="dispatch")
class CartItemViewSet(viewsets.ModelViewSet):
    queryset = CartItem.objects.select_related("cart", "variant").all()
    serializer_class = CartItemSerializer
    filterset_fields = ["cart", "variant"]
    http_method_names = ["get", "post", "delete", "head", "options"]
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.request.user.is_authenticated:
            return queryset.filter(cart__user=self.request.user)
        session_key = self.request.session.session_key
        return queryset.filter(cart__user=None, cart__session_key=session_key) if session_key else queryset.none()

    def create(self, request, *args, **kwargs):
        raise MethodNotAllowed("POST")

    @action(detail=True, methods=["post"])
    def set_quantity(self, request, pk=None):
        item = self.get_object()
        serializer = UpdateCartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        item.quantity = serializer.validated_data["quantity"]
        item.save(update_fields=["quantity", "updated_at"])
        return Response(CartItemSerializer(item).data)
