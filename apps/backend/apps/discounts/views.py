from rest_framework import viewsets

from .models import Coupon, DiscountRule
from .serializers import CouponSerializer, DiscountRuleSerializer


class CouponViewSet(viewsets.ModelViewSet):
    queryset = Coupon.objects.all().order_by("-created_at")
    serializer_class = CouponSerializer
    filterset_fields = ["code", "is_active", "discount_type"]


class DiscountRuleViewSet(viewsets.ModelViewSet):
    queryset = DiscountRule.objects.select_related("coupon", "category", "product").all()
    serializer_class = DiscountRuleSerializer
    filterset_fields = ["coupon", "category", "product"]

