from typing import Literal, Optional
from django.contrib.auth.models import User
from .models import Notifications


def create_notification_for_admins(
    created_by: Optional[User] = None,
    message: Optional[str] = "None",
    action: Optional[str] = None,
    target_id: Optional[int] = None,
) -> None:
    """
    Creates a notification for the administrators

    Args:
        created_by (Optional[User]): User instance who created the notification, defaults to None
        message (str): The notification message. Defaults to "None"
        action (Optional[Notification.actions]): Actions for the notification. Look at Notification Model for more information. Defaults to None
        target_id (Optional[int]): ID of the target entity relative to its model. Defaults to None


    Returns:
        None
    """
    admins = User.objects.filter(profile__is_admin=True)

    for admin in admins:
        if admin == created_by:
            continue
        Notifications.objects.create(
            user=admin,
            created_by=created_by,
            message=message,
            action=action,
            target_id=target_id,
        )
