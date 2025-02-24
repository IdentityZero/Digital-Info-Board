from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.contrib.auth.models import User

from utils.utils import extract_react_quill_text

from .models import Announcements
from notifications.models import Notifications


@receiver(post_save, sender=Announcements)
def send_notif_on_new_announcements(sender, instance, created, **kwargs):
    """
    Send and create notifications if new announcements are created by non-admins
    """

    if instance.author.profile.is_admin:
        return

    if created:
        return
    creator = instance.author
    title = extract_react_quill_text(instance.title)
    message = f"Created a new Content waiting for approval{f' entitled {title}' if title else ''}. Check it out."

    admins = User.objects.filter(profile__is_admin=True)

    for admin in admins:
        notification = Notifications.objects.create(
            user=admin,
            created_by=creator,
            message=message,
            action="approve_announcement",
            target_id=instance.id,
        )
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"notification_{admin.id}",
            {
                "type": "send.notif",
                "target_id": notification.id,
            },
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
