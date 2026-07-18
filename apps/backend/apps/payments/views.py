from django.conf import settings
from django.http import Http404, HttpResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import MethodNotAllowed
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle

from apps.orders.models import Order
from apps.orders.services import release_expired_orders

from .gateways import GatewayError
from .models import Payment
from .serializers import PaymentSerializer, PaymentStartSerializer
from .services import mark_payment_failed, request_gateway_payment, verify_gateway_payment, PaymentVerificationError


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.select_related("order", "order__user").all().order_by("-created_at")
    serializer_class = PaymentSerializer
    filterset_fields = ["order", "provider", "status"]
    http_method_names = ["get", "post", "head", "options"]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "payment"
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        if not self.request.user.is_authenticated:
            return queryset.none()
        return queryset if self.request.user.is_staff else queryset.filter(order__user=self.request.user)

    def create(self, request, *args, **kwargs):
        raise MethodNotAllowed("POST")

    @action(detail=False, methods=["post"])
    def start(self, request):
        release_expired_orders()
        serializer = PaymentStartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            order = Order.objects.get(id=serializer.validated_data["order_id"], user=request.user)
        except Order.DoesNotExist:
            return Response({"code": "order_not_found", "message": "سفارش پیدا نشد."}, status=status.HTTP_404_NOT_FOUND)
        if order.status != Order.Status.PENDING_PAYMENT or not order.inventory_reserved or (order.expires_at and order.expires_at <= timezone.now()):
            return Response({"code": "order_not_payable", "message": "این سفارش قابل پرداخت نیست."}, status=status.HTTP_409_CONFLICT)

        key = serializer.validated_data["idempotency_key"]
        payment, created = Payment.objects.get_or_create(
            idempotency_key=key,
            defaults={"order": order, "provider": "zarinpal", "amount": order.grand_total},
        )
        if payment.order_id != order.id:
            return Response({"code": "idempotency_conflict", "message": "کلید تکرار برای سفارش دیگری استفاده شده است."}, status=status.HTTP_409_CONFLICT)
        if payment.amount != order.grand_total:
            return Response({"code": "payment_amount_mismatch", "message": "مبلغ تلاش پرداخت با سفارش مطابقت ندارد."}, status=status.HTTP_409_CONFLICT)
        if payment.authority and payment.status == Payment.Status.PENDING:
            payment_url = settings.ZARINPAL_GATEWAY_URL.format(authority=payment.authority)
            return Response({**PaymentSerializer(payment).data, "payment_url": payment_url})
        claimed = Payment.objects.filter(
            pk=payment.pk,
            authority__isnull=True,
            gateway_request_started_at__isnull=True,
        ).update(gateway_request_started_at=timezone.now())
        if not claimed:
            return Response(
                {"code": "payment_initializing", "message": "ساخت پرداخت در حال انجام است؛ چند لحظه دیگر دوباره بررسی کنید."},
                status=status.HTTP_409_CONFLICT,
            )
        payment.refresh_from_db()
        try:
            payment, payment_url = request_gateway_payment(payment)
        except GatewayError as exc:
            mark_payment_failed(payment, str(exc))
            return Response({"code": "gateway_unavailable", "message": str(exc)}, status=status.HTTP_502_BAD_GATEWAY)
        response_status = status.HTTP_201_CREATED if created else status.HTTP_200_OK
        return Response({**PaymentSerializer(payment).data, "payment_url": payment_url}, status=response_status)

    @action(detail=True, methods=["post"])
    def verify(self, request, pk=None):
        payment = self.get_object()
        try:
            payment = verify_gateway_payment(payment)
        except PaymentVerificationError as exc:
            return Response({"code": "payment_verify_failed", "message": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(PaymentSerializer(payment).data)

    @action(detail=True, methods=["get"], url_path="test-gateway", permission_classes=[permissions.AllowAny], authentication_classes=[])
    def test_gateway(self, request, pk=None):
        if not settings.PAYMENT_GATEWAY_TEST_MODE:
            raise Http404
        payment = get_object_or_404(Payment.objects.select_related("order"), pk=pk)
        result = request.query_params.get("result")
        if not result:
            return HttpResponse("<html lang='fa' dir='rtl'><body><h1>درگاه تست memostyles</h1><a id='pay-success' href='?result=success'>پرداخت موفق</a><br><a id='pay-failure' href='?result=failure'>پرداخت ناموفق</a></body></html>")
        if result == "success":
            payment = mark_payment_succeeded(payment, f"E2E-REF-{str(payment.id)[:8]}", {"mode": "e2e"})
            return HttpResponseRedirect(f"{settings.STOREFRONT_URL}/checkout/success?payment={payment.id}")
        payment = mark_payment_failed(payment, "پرداخت در درگاه تست ناموفق شد.", {"mode": "e2e"})
        return HttpResponseRedirect(f"{settings.STOREFRONT_URL}/checkout/failure?payment={payment.id}")

    @action(detail=False, methods=["get"], permission_classes=[permissions.AllowAny], authentication_classes=[])
    def callback(self, request):
        authority = request.query_params.get("Authority", "")
        gateway_status = request.query_params.get("Status", "")
        payment = Payment.objects.filter(authority=authority).first()
        if payment is None:
            return HttpResponseRedirect(f"{settings.STOREFRONT_URL}/checkout/failure?reason=payment_not_found")
        if gateway_status.upper() != "OK":
            mark_payment_failed(payment, "پرداخت توسط کاربر یا درگاه لغو شد.")
            return HttpResponseRedirect(f"{settings.STOREFRONT_URL}/checkout/failure?payment={payment.id}")
        try:
            payment = verify_gateway_payment(payment)
        except PaymentVerificationError as exc:
            mark_payment_failed(payment, str(exc))
            return HttpResponseRedirect(f"{settings.STOREFRONT_URL}/checkout/failure?payment={payment.id}")
        return HttpResponseRedirect(f"{settings.STOREFRONT_URL}/checkout/success?payment={payment.id}")
