from django.shortcuts import render
from rest_framework import generics, permissions

from .models import Notifications
from .serializers import NotificationsSerializer


class NotificationsListAPIView(generics.ListAPIView):
    serializer_class = NotificationsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = Notifications.objects.filter(user=user)

        return qs
