import os
from django.conf import settings
from django.db.models.signals import post_delete
from django.dispatch import receiver

from .models import OrganizationMembers, MediaDisplays


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
