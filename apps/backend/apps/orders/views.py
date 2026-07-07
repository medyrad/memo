from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

from apps.cart.models import Cart
from .models import Order, OrderItem, OrderStatusHistory
from .serializers import CheckoutSerializer, OrderItemSerializer, OrderSerializer, OrderStatusHistorySerializer
from .services import CheckoutError, create_pending_order_from_cart


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.select_related("user").prefetch_related("items", "status_history").all().order_by("-created_at")
    serializer_class = OrderSerializer
    filterset_fields = ["user", "status"]

    @action(detail=False, methods=["post"])
    def checkout(self, request):
        serializer = CheckoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            cart = Cart.objects.get(id=serializer.validated_data["cart_id"])
            order = create_pending_order_from_cart(cart, serializer.validated_data.get("coupon_code", ""))
        except Cart.DoesNotExist:
            return Response({"code": "cart_not_found", "message": "سبد خرید پیدا نشد."}, status=status.HTTP_404_NOT_FOUND)
        except CheckoutError as exc:
            return Response({"code": "checkout_failed", "message": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.select_related("order", "variant").all()
    serializer_class = OrderItemSerializer
    filterset_fields = ["order", "variant"]


class OrderStatusHistoryViewSet(viewsets.ModelViewSet):
    queryset = OrderStatusHistory.objects.select_related("order", "changed_by").all()
    serializer_class = OrderStatusHistorySerializer
    filterset_fields = ["order", "to_status"]
