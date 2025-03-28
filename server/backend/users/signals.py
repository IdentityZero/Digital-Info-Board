import os

from django.dispatch import receiver
from django.db.models.signals import pre_save, post_save
from django.contrib.auth.models import User

from .models import Profile, NewUserInvitation
from notifications.models import Notifications


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


@receiver(post_save, sender=User)
def create_notification_on_new_user(sender, instance: User, created, *args, **kwargs):
    """
    Send welcome notification to new user and notify inviter of the success of invitation
    """
    if not created:
        return

    inviter = None
    if instance.email:
        try:
            inviter = NewUserInvitation.objects.get(email=instance.email).inviter

            # Send notification to inviter
            Notifications.objects.create(
                user=inviter,
                target_id=instance.pk,
                message=f"Your invitation to {instance.email} has been answered. New user is added.",
            )

        except NewUserInvitation.DoesNotExist:
            pass

    # Send notification to new user
    Notifications.objects.create(
        user=instance,
        created_by=inviter,
        target_id=instance.pk,
        action="welcome_new_user",
        message=f"Welcome {instance.first_name} to our Information Board. I hope you are excited to create your first Content. Lets go!",
    )
