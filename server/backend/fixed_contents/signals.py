import os
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from .models import OrganizationMembers, MediaDisplays
from .serializers import OrganizationMembersSerializer

from utils.utils import extract_react_quill_text, get_mock_request


@receiver(post_delete, sender=OrganizationMembers)
def delete_old_org_member_image(sender, instance: OrganizationMembers, *args, **kwargs):
    """
    Delete images of deleted instances of Org members
    """
    if not instance.image or instance.image == "org_members/default.png":
        return

    if os.path.isfile(instance.image.path):
        os.remove(instance.image.path)


@receiver(post_delete, sender=MediaDisplays)
def delete_media_file(sender, instance: MediaDisplays, *args, **kwargs):
    """
    Delete files of deleted MediaDisplays instances
    """
    if not instance.file:
        return

    if os.path.isfile(instance.file.path):
        os.remove(instance.file.path)


@receiver(post_save, sender=OrganizationMembers)
def send_update_on_created_org_members(sender, instance, created, *args, **kwargs):
    """
    Send update on CREATED Organiztion Members
    """
    if created:
        channel_layer = get_channel_layer()
        request = get_mock_request()
        serializer = OrganizationMembersSerializer(
            instance, context={"request": request}
        )
        async_to_sync(channel_layer.group_send)(
            "realtime_update",
            {
                "type": "send.update",
                "content": "organization",
                "action": "create",
                "content_id": instance.pk,
                "data": serializer.data,
            },
        )


@receiver(post_delete, sender=OrganizationMembers)
def send_updated_on_deleted_org_members(sender, instance, *args, **kwargs):
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
