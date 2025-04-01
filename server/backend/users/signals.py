from django.dispatch import receiver
from django.db.models.signals import pre_save, post_save, post_delete
from django.contrib.auth.models import User

from utils.signals import delete_old_file, delete_files_of_deleted_objects

from .models import Profile, NewUserInvitation
from notifications.models import Notifications


# TODO add signal to ready
@receiver(pre_save, sender=Profile)
def delete_old_user_image(sender, instance, *args, **kwargs):
    delete_old_file(sender, instance, "image", "profile_pics/profile.png")


@receiver(post_delete, sender=Profile)
def post_delete_users_signal(sender, instance, *args, **kwargs):
    delete_files_of_deleted_objects(instance, "image", "profile_pics/profile.png")


# TODO DELETE IMAGE OF DELETED USER


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
