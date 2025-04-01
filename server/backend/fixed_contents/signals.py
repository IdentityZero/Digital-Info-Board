from django.utils import timezone

from django.db.models.signals import post_delete, post_save, pre_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from utils.signals import delete_old_file, delete_files_of_deleted_objects

from .models import OrganizationMembers, UpcomingEvents, MediaDisplays
from .serializers import (
    OrganizationMembersSerializer,
    UpcomingEventsSerializer,
    MediaDisplaysSerializer,
)

from utils.utils import get_mock_request

# region Topic: Organization Members


@receiver(post_save, sender=OrganizationMembers)
def post_save_org_members_signal(sender, instance, created, *args, **kwargs):
    """
    Send update on CREATED OR UPDATED Organiztion Members
    """

    action = "create" if created else "update"

    channel_layer = get_channel_layer()
    request = get_mock_request()
    serializer = OrganizationMembersSerializer(instance, context={"request": request})
    async_to_sync(channel_layer.group_send)(
        "realtime_update",
        {
            "type": "send.update",
            "content": "organization",
            "action": action,
            "content_id": instance.pk,
            "data": serializer.data,
        },
    )


@receiver(pre_save, sender=OrganizationMembers)
def pre_save_org_members_signal(sender, instance: OrganizationMembers, *args, **kwargs):
    delete_old_file(sender, instance, "image", "org_members/default.png")


@receiver(post_delete, sender=OrganizationMembers)
def post_delete_org_members_signal(sender, instance, *args, **kwargs):
    """
    DELETE org Members signal
    """
    send_update_on_delete_org_members(instance)
    delete_files_of_deleted_objects(instance, "image", "org_members/default.png")


def send_update_on_delete_org_members(instance: OrganizationMembers):
    """
    Send update on DELETED Organiztion Members
    """

    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        "realtime_update",
        {
            "type": "send.update",
            "content": "organization",
            "action": "delete",
            "content_id": instance.pk,
        },
    )


# endregion

# region Topic: Upcoming Events


@receiver(post_save, sender=UpcomingEvents)
def send_update_on_created_upcoming_events(
    sender, instance: UpcomingEvents, created, *args, **kwargs
):
    action = "create" if created else "update"

    channel_layer = get_channel_layer()
    serializer = UpcomingEventsSerializer(instance)
    async_to_sync(channel_layer.group_send)(
        "realtime_update",
        {
            "type": "send.update",
            "content": "upcoming_events",
            "action": action,
            "content_id": instance.pk,
            "data": serializer.data,
        },
    )


@receiver(post_delete, sender=UpcomingEvents)
def send_update_on_deleted_upcoming_events(sender, instance, *args, **kwargs):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        "realtime_update",
        {
            "type": "send.update",
            "content": "upcoming_events",
            "action": "delete",
            "content_id": instance.pk,
        },
    )


# endregion

# region Topic: Media Displays


@receiver(post_save, sender=MediaDisplays)
def send_update_on_created_media_displays(sender, instance, created, *args, **kwargs):
    """
    Send update on CREATED OR UPDATED Media Displays
    """

    action = "create" if created else "update"

    channel_layer = get_channel_layer()
    request = get_mock_request()
    serializer = MediaDisplaysSerializer(instance, context={"request": request})
    async_to_sync(channel_layer.group_send)(
        "realtime_update",
        {
            "type": "send.update",
            "content": "media_displays",
            "action": action,
            "content_id": instance.pk,
            "data": serializer.data,
        },
    )


@receiver(pre_save, sender=MediaDisplays)
def pre_save_media_displays_signal(sender, instance, *args, **kwargs):
    delete_old_file(sender, instance, "file")


@receiver(post_delete, sender=MediaDisplays)
def post_delete_media_displays_signal(sender, instance, *args, **kwargs):
    send_update_on_deleted_media_displays(instance)
    delete_files_of_deleted_objects(instance, "file")


def send_update_on_deleted_media_displays(instance):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        "realtime_update",
        {
            "type": "send.update",
            "content": "media_displays",
            "action": "delete",
            "content_id": instance.pk,
        },
    )


# endregion
