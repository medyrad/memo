from rest_framework import serializers

from apps.orders.serializers import OrderSerializer

from .models import Payment


class PaymentSerializer(serializers.ModelSerializer):
    order_detail = OrderSerializer(source="order", read_only=True)

    class Meta:
        model = Payment
        fields = [
            "id", "order", "order_detail", "provider", "status", "amount", "reference_id",
            "failure_reason", "created_at", "updated_at",
        ]
        read_only_fields = [
            "order", "provider", "status", "amount", "reference_id", "failure_reason", "created_at", "updated_at",
        ]


class PaymentStartSerializer(serializers.Serializer):
    order_id = serializers.UUIDField()
    idempotency_key = serializers.CharField(min_length=8, max_length=80)
