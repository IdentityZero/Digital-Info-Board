from rest_framework import serializers

from .models import Notifications


class NotificationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notifications
        fields = ["user", "message", "is_read", "created_at", "last_modified"]
