from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser

from .models import Coupon, DiscountRule
from .serializers import CouponSerializer, DiscountRuleSerializer


class CouponViewSet(viewsets.ModelViewSet):
    queryset = Coupon.objects.all().order_by("-created_at")
    serializer_class = CouponSerializer
    filterset_fields = ["code", "is_active", "discount_type"]
    permission_classes = [IsAdminUser]


class DiscountRuleViewSet(viewsets.ModelViewSet):
    queryset = DiscountRule.objects.select_related("coupon", "category", "product").all()
    serializer_class = DiscountRuleSerializer
    filterset_fields = ["coupon", "category", "product"]
    permission_classes = [IsAdminUser]
