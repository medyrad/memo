from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser

from .models import AuditLog
from .serializers import AuditLogSerializer


class AuditLogViewSet(viewsets.ModelViewSet):
    queryset = AuditLog.objects.select_related("actor").all()
    serializer_class = AuditLogSerializer
    filterset_fields = ["actor", "action", "entity_type", "entity_id"]
    permission_classes = [IsAdminUser]
    http_method_names = ["get", "head", "options"]
