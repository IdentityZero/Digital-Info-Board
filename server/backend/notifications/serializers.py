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
            "target_id",
        ]


class MarkNotificationReadSerializer(NotificationsSerializer):
    class Meta(NotificationsSerializer.Meta):
        extra_kwargs = {
            field: {"read_only": True} for field in NotificationsSerializer.Meta.fields
        }
        extra_kwargs["is_read"] = {"read_only": False}
