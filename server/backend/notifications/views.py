from rest_framework import generics, permissions, pagination
from django.shortcuts import get_object_or_404

from .models import Notifications
from .serializers import NotificationsSerializer, MarkNotificationReadSerializer


class NotificationsListAPIView(generics.ListAPIView):
    serializer_class = NotificationsSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = pagination.LimitOffsetPagination
    page_size = 6

    def get_queryset(self):
        qs = self.request.user.notifications.all().order_by("-created_at")

        return qs

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)

        unread_count = self.request.user.notifications.filter(is_read=False).count()
        response.data["unread_count"] = unread_count

        return response


class MarkNotificationReadAPIView(generics.UpdateAPIView):
    serializer_class = MarkNotificationReadSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.request.user.notifications.all()

    def get_object(self):
        pk = self.kwargs.get("pk")
        return get_object_or_404(Notifications, id=pk)
