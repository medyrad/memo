from rest_framework import serializers

from .models import Payment


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = "__all__"


class PaymentVerifySerializer(serializers.Serializer):
    reference_id = serializers.CharField(required=False, allow_blank=True)


class PaymentStartSerializer(serializers.Serializer):
    order_id = serializers.UUIDField()
    provider = serializers.CharField(required=False, default="mock")
