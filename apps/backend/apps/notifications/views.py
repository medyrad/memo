from rest_framework import viewsets

from .models import Notification
from .serializers import NotificationSerializer


class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.select_related("user").all().order_by("-created_at")
    serializer_class = NotificationSerializer
    filterset_fields = ["user", "channel"]

