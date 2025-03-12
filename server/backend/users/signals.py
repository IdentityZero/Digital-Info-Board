import os

from django.db.models.signals import pre_save
from django.dispatch import receiver

from .models import Profile


# TODO add signal to ready
@receiver(pre_save, sender=Profile)
def delete_old_user_image(sender, instance, *args, **kwargs):
    # Stop for newly created
    if not instance.pk:
        return

    try:
        old_instance = sender.objects.get(pk=instance.pk)
    except sender.DoesNotExist:
        return

    # Empty or equal to default
    if not old_instance.image or old_instance.image == "profile_pics/profile.png":
        return

    new_image = instance.image

    if old_instance.image == new_image:
        return

    if os.path.isfile(old_instance.image.path):
        os.remove(old_instance.image.path)
