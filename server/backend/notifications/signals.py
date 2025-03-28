from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.dispatch import receiver
from django.db.models.signals import post_save

from .models import Notifications
from .serializers import NotificationsSerializer

from utils.utils import get_mock_request


@receiver(post_save, sender=Notifications)
def send_notifications_on_created_notifications(
    sender, instance: Notifications, created, *args, **kwargs
):
    if not created:
        return

    request = get_mock_request()
    channel_layer = get_channel_layer()
    serializer = NotificationsSerializer(instance, context={"request": request})

    async_to_sync(channel_layer.group_send)(
        f"notification_{instance.user.id}",
        {"type": "send.notification", "data": serializer.data},
    )
