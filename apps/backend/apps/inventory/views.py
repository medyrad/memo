from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser

from .models import Inventory
from .serializers import InventorySerializer


class InventoryViewSet(viewsets.ModelViewSet):
    queryset = Inventory.objects.select_related("variant", "variant__product").all().order_by("variant__sku")
    serializer_class = InventorySerializer
    filterset_fields = ["variant"]
    permission_classes = [IsAdminUser]
