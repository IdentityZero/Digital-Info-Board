from rest_framework import serializers

from .models import Notifications
from users.serializers import UserSerializer


class NotificationsSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = Notifications
        fields = [
            "id",
            "user",
            "created_by",
            "message",
            "is_read",
            "created_at",
            "last_modified",
        ]
