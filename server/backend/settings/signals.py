from django.dispatch import receiver
from django.db.models.signals import post_migrate, post_save
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from .models import Settings
from .serializers import ListSettingsSerializer


@receiver(post_migrate)
def populate_settings(sender, **kwargs):
    if not sender.name == "fixed_contents":
        return

    if Settings.objects.exists():
        return

    initial_values = {}  # Set initial values if it does not contain a default

    Settings.objects.create(**initial_values)


@receiver(post_save, sender=Settings)
def send_update_on_updated_settings(sender, instance, created, **kwargs):
    if created:
        return

    channel_layer = get_channel_layer()
    serializer = ListSettingsSerializer(instance)
    async_to_sync(channel_layer.group_send)(
        "realtime_update",
        {
            "type": "send.update",
            "content": "settings",
            "action": "update",
            "data": serializer.data,
        },
    )
