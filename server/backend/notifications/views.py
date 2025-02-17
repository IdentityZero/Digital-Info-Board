from django.shortcuts import render
from rest_framework import generics, permissions

from .models import Notifications
from .serializers import NotificationsSerializer


class NotificationsListAPIView(generics.ListAPIView):
    serializer_class = NotificationsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = self.request.user.notifications.all().order_by("-created_at")

        return qs
