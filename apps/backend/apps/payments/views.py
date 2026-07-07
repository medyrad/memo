from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

from .models import Payment
from apps.orders.models import Order
from .serializers import PaymentSerializer, PaymentStartSerializer, PaymentVerifySerializer
from .services import PaymentVerificationError, mark_payment_succeeded


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.select_related("order").all().order_by("-created_at")
    serializer_class = PaymentSerializer
    filterset_fields = ["order", "provider", "status"]

    @action(detail=False, methods=["post"])
    def start(self, request):
        serializer = PaymentStartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            order = Order.objects.get(id=serializer.validated_data["order_id"])
        except Order.DoesNotExist:
            return Response({"code": "order_not_found", "message": "سفارش پیدا نشد."}, status=status.HTTP_404_NOT_FOUND)
        payment = Payment.objects.create(
            order=order,
            provider=serializer.validated_data.get("provider", "mock"),
            amount=order.grand_total,
            authority=f"mock-{order.id}",
        )
        return Response({**PaymentSerializer(payment).data, "payment_url": f"/checkout?payment={payment.id}"}, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["post"])
    def verify(self, request, pk=None):
        payment = self.get_object()
        serializer = PaymentVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            payment = mark_payment_succeeded(payment, serializer.validated_data.get("reference_id", ""))
        except PaymentVerificationError as exc:
            return Response({"code": "payment_verify_failed", "message": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(PaymentSerializer(payment).data)
