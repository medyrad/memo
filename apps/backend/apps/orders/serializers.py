from rest_framework import serializers

from .models import Order, OrderItem, OrderStatusHistory


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = "__all__"


class OrderStatusHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderStatusHistory
        fields = "__all__"


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    status_history = OrderStatusHistorySerializer(many=True, read_only=True)
    payment = serializers.SerializerMethodField()
    shipment = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = "__all__"
        read_only_fields = [
            "user", "status", "subtotal", "discount_total", "shipping_total", "grand_total",
            "coupon", "shipping_address", "expires_at", "inventory_reserved", "created_at", "updated_at",
        ]

    def get_payment(self, obj):
        payment = obj.payments.order_by("-created_at").first()
        if not payment:
            return None
        return {"id": str(payment.id), "status": payment.status, "provider": payment.provider, "reference_id": payment.reference_id}

    def get_shipment(self, obj):
        shipment = obj.shipments.order_by("-created_at").first()
        if not shipment:
            return None
        return {"status": shipment.status, "carrier": shipment.carrier, "tracking_code": shipment.tracking_code}


class CheckoutSerializer(serializers.Serializer):
    cart_id = serializers.UUIDField()
    address_id = serializers.UUIDField()
    coupon_code = serializers.CharField(required=False, allow_blank=True)
    shipping_method = serializers.ChoiceField(choices=Order.ShippingMethod.choices, default=Order.ShippingMethod.STANDARD)
    customer_note = serializers.CharField(required=False, allow_blank=True, max_length=1000)


class OrderStatusSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=Order.Status.choices)
    note = serializers.CharField(required=False, allow_blank=True, max_length=1000)
