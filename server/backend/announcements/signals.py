import os

from django.conf import settings
from django.utils import timezone
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.dispatch import receiver
from django.db.models.signals import post_save, post_delete, pre_save

from utils.utils import extract_react_quill_text, get_mock_request

from .models import (
    Announcements,
    ImageAnnouncements,
    VideoAnnouncements,
    UrgentAnnouncements,
)
from notifications.models import Notifications
from notifications.utils import create_notification_for_admins
from .serializers import (
    RetrieveFullAnnouncementSerializer,
    PrimaryUrgentAnnouncementSerializer,
)


@receiver(post_save, sender=Announcements)
def send_notif_on_new_announcements(sender, instance: Announcements, created, **kwargs):
    """
    Send and create notifications if new announcements are created by non-admins
    """

    if instance.author.profile.is_admin:
        return

    if not created:
        return

    now = timezone.now()

    if not (instance.start_date <= now <= instance.end_date):
        return

    creator = instance.author
    title = extract_react_quill_text(instance.title)
    message = f"Created a new Content waiting for approval{f' entitled {title}' if title else ''}. Check it out."

    create_notification_for_admins(
        creator, message, "approve_announcement", instance.id
    )


@receiver(pre_save, sender=Announcements)
def send_notif_on_updated_announcements(
    sender, instance: Announcements, *args, **kwargs
):
    if instance.author.profile.is_admin:
        return

    if not instance.pk:
        return

    try:
        old_instance: Announcements = sender.objects.get(pk=instance.pk)
    except sender.DoesNotExist:
        return

    if old_instance.is_active:
        return

    if not old_instance.is_active and instance.is_active:
        return

    now = timezone.now()

    if not old_instance.is_active and instance.start_date <= now <= instance.end_date:
        creator = instance.author
        title = extract_react_quill_text(instance.title)
        message = f"Updated a Content waiting for approval{f' entitled {title}' if title else ''}. Check it out."
        create_notification_for_admins(
            creator, message, "approve_announcement", instance.id
        )


@receiver(post_delete, sender=Announcements)
def delete_notif_on_deleted_announcements(sender, instance, **kwargs):
    """
    Remove notifications on deleted announcements to remove clutter in the notification of admins.
    """

    notifications = Notifications.objects.filter(
        target_id=instance.id, action="approve_announcement"
    )
    notifications.delete()


@receiver(post_delete, sender=ImageAnnouncements)
def delete_image_announcement_image(
    sender, instance: ImageAnnouncements, *args, **kwargs
):
    """
    Delete images of deleted image announcements
    """

    if not instance.image:
        return

    if os.path.isfile(instance.image.path):
        os.remove(instance.image.path)


@receiver(post_delete, sender=VideoAnnouncements)
def delete_video_announcement_video(
    sender, instance: VideoAnnouncements, *args, **kwargs
):
    """
    Delete videos of deleted video announcements
    """

    if not instance.video:
        return

    if os.path.isfile(instance.video.path):
        os.remove(instance.video.path)


@receiver(post_save, sender=Announcements)
def send_update_on_created_announcements(
    sender, instance: Announcements, created, *args, **kwargs
):
    """
    Send update on updated announcements through channels
    """

    if created and instance.author.profile.is_admin:
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "realtime_update",
            {
                "type": "send.update",
                "content": "announcement",
                "action": "create",
                "content_id": instance.pk,
            },
        )


@receiver(post_delete, sender=Announcements)
def send_update_on_deleted_announcements(sender, instance, *args, **kwargs):
    """
    Send update on deleted announcements through channels
    """

    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        "realtime_update",
        {
            "type": "send.update",
            "content": "announcement",
            "action": "delete",
            "content_id": instance.pk,
        },
    )


@receiver(pre_save, sender=Announcements)
def send_update_on_updated_announcements(
    sender, instance: Announcements, *args, **kwargs
):

    if not instance.pk:
        return

    try:
        old_instance: Announcements = sender.objects.get(pk=instance.pk)
    except sender.DoesNotExist:
        return

    if not old_instance.is_active and not instance.is_active:
        return

    request = get_mock_request()
    serializer = RetrieveFullAnnouncementSerializer(
        instance, context={"request": request}
    )
    channel_layer = get_channel_layer()

    # Sequence change. Will be handled differently. See Announcement consumers instead
    if instance.position != old_instance.position:
        return

    # Updated data
    if instance.is_active and old_instance.is_active:
        async_to_sync(channel_layer.group_send)(
            "realtime_update",
            {
                "type": "send.update",
                "content": "announcement",
                "action": "update",
                "content_id": instance.pk,
                "data": serializer.data,
            },
        )
        return

    # Activated
    if instance.is_active and not old_instance.is_active:
        async_to_sync(channel_layer.group_send)(
            "realtime_update",
            {
                "type": "send.update",
                "content": "announcement",
                "action": "activate",
                "content_id": instance.pk,
                "data": serializer.data,
            },
        )
        return

    # Deactivated
    if not instance.is_active and old_instance.is_active:
        async_to_sync(channel_layer.group_send)(
            "realtime_update",
            {
                "type": "send.update",
                "content": "announcement",
                "action": "deactivate",
                "content_id": instance.pk,
            },
        )
        return


@receiver(post_save, sender=UrgentAnnouncements)
def send_update_on_urgent_announcements(
    sender, instance: UrgentAnnouncements, created, *args, **kwargs
):
    if not created or not instance.author.profile.is_admin:
        return

    channel_layer = get_channel_layer()
    serializer = PrimaryUrgentAnnouncementSerializer(instance)
    async_to_sync(channel_layer.group_send)(
        "realtime_update",
        {
            "type": "send.update",
            "content": "announcement",
            "action": "urgent",
            "content_id": instance.pk,
            "data": serializer.data,
        },
    )
