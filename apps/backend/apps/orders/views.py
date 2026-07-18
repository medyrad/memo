from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from django.db.models import Count, Sum
from django.db.models.functions import TruncDate
from django.utils import timezone

from apps.accounts.models import Address
from apps.cart.models import Cart
from .models import Order, OrderItem, OrderStatusHistory
from .serializers import CheckoutSerializer, OrderItemSerializer, OrderSerializer, OrderStatusHistorySerializer, OrderStatusSerializer
from .services import CheckoutError, create_pending_order_from_cart, release_expired_orders, release_order_inventory


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.select_related("user").prefetch_related("items", "status_history", "payments", "shipments").all().order_by("-created_at")
    serializer_class = OrderSerializer
    filterset_fields = ["user", "status"]

    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset if self.request.user.is_staff else queryset.filter(user=self.request.user)

    def get_permissions(self):
        if self.action in ["dashboard", "set_status", "create", "update", "partial_update", "destroy"]:
            return [permissions.IsAdminUser()]
        return [permissions.IsAuthenticated()]

    @action(detail=False, methods=["get"], url_path="dashboard")
    def dashboard(self, request):
        """Aggregated dashboard data calculated from persisted commerce records."""
        start = timezone.now() - timezone.timedelta(days=6)
        paid_statuses = [Order.Status.PAID, Order.Status.PROCESSING, Order.Status.SHIPPED, Order.Status.DELIVERED]
        completed = self.get_queryset().filter(status__in=paid_statuses)
        sales = completed.aggregate(total=Sum("grand_total"))["total"] or 0
        series_rows = (
            completed.filter(created_at__gte=start)
            .annotate(day=TruncDate("created_at"))
            .values("day")
            .annotate(value=Sum("grand_total"), orders=Count("id"))
            .order_by("day")
        )
        category_rows = (
            OrderItem.objects.filter(order__status__in=paid_statuses)
            .values("variant__product__category__title")
            .annotate(value=Sum("line_total"))
            .order_by("-value")[:6]
        )
        recent = self.get_queryset().select_related("user")[:5]
        return Response({
            "metrics": {
                "total_sales": sales,
                "orders": self.get_queryset().count(),
                "customers": self.get_queryset().values("user_id").distinct().count(),
                "average_order_value": (sales / completed.count()) if completed.count() else 0,
            },
            "sales_series": [
                {"date": row["day"].isoformat(), "value": row["value"], "orders": row["orders"]}
                for row in series_rows
            ],
            "category_sales": [
                {"name": row["variant__product__category__title"] or "بدون دسته‌بندی", "value": row["value"]}
                for row in category_rows
            ],
            "recent_orders": [
                {"id": str(order.id), "customer": order.user.get_full_name() or order.user.username, "total": order.grand_total, "status": order.status}
                for order in recent
            ],
        })

    @action(detail=False, methods=["post"])
    def checkout(self, request):
        serializer = CheckoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            release_expired_orders()
            cart = Cart.objects.get(id=serializer.validated_data["cart_id"], user=request.user)
            address = Address.objects.get(id=serializer.validated_data["address_id"], user=request.user)
            order = create_pending_order_from_cart(
                cart,
                address,
                serializer.validated_data.get("coupon_code", ""),
                serializer.validated_data["shipping_method"],
                serializer.validated_data.get("customer_note", ""),
            )
        except (Cart.DoesNotExist, Address.DoesNotExist):
            return Response({"code": "checkout_resource_not_found", "message": "سبد خرید یا آدرس معتبر نیست."}, status=status.HTTP_404_NOT_FOUND)
        except CheckoutError as exc:
            return Response({"code": "checkout_failed", "message": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["post"], url_path="set-status")
    def set_status(self, request, pk=None):
        order = self.get_object()
        serializer = OrderStatusSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        target = serializer.validated_data["status"]
        allowed = {
            # Only server-side gateway verification may mark an order as paid.
            Order.Status.PENDING_PAYMENT: {Order.Status.CANCELLED},
            Order.Status.PAID: {Order.Status.PROCESSING, Order.Status.REFUNDED},
            Order.Status.PROCESSING: {Order.Status.SHIPPED, Order.Status.CANCELLED},
            Order.Status.SHIPPED: {Order.Status.DELIVERED},
            Order.Status.DELIVERED: {Order.Status.REFUNDED},
        }
        if target not in allowed.get(order.status, set()):
            return Response({"code": "invalid_status_transition", "message": "تغییر وضعیت سفارش مجاز نیست."}, status=status.HTTP_409_CONFLICT)
        if target == Order.Status.CANCELLED and order.inventory_reserved:
            release_order_inventory(order)
            order.refresh_from_db()
        previous = order.status
        order.status = target
        order.save(update_fields=["status", "updated_at"])
        OrderStatusHistory.objects.create(
            order=order,
            from_status=previous,
            to_status=order.status,
            note=serializer.validated_data.get("note", ""),
            changed_by=request.user,
        )
        from apps.notifications.services import send_order_status_sms
        transaction.on_commit(lambda: send_order_status_sms(order.pk))
        return Response(OrderSerializer(order).data)


class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.select_related("order", "variant").all()
    serializer_class = OrderItemSerializer
    filterset_fields = ["order", "variant"]
    permission_classes = [permissions.IsAdminUser]


class OrderStatusHistoryViewSet(viewsets.ModelViewSet):
    queryset = OrderStatusHistory.objects.select_related("order", "changed_by").all()
    serializer_class = OrderStatusHistorySerializer
    filterset_fields = ["order", "to_status"]
    permission_classes = [permissions.IsAdminUser]
