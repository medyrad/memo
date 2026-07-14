from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser

from .models import Shipment
from .serializers import ShipmentSerializer


class ShipmentViewSet(viewsets.ModelViewSet):
    queryset = Shipment.objects.select_related("order").all().order_by("-created_at")
    serializer_class = ShipmentSerializer
    filterset_fields = ["order", "status", "carrier"]
    permission_classes = [IsAdminUser]
