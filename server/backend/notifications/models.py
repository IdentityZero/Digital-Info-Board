from django.db import models
from django.contrib.auth.models import User

from utils.models import TimestampedModel


class Notifications(TimestampedModel):
    class Meta:
        verbose_name = "Notification"
        verbose_name_plural = "Notifications"
        ordering = ["created_at"]  # from Timestamp Model

    NOTIFICATION_ACTIONS = [("approve_announcement", "Approve Announcement")]

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="notifications"
    )
    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="created_notifications",
    )
    message = models.TextField()
    action = models.CharField(
        max_length=32, choices=NOTIFICATION_ACTIONS, null=True, blank=True
    )
    target_id = models.PositiveIntegerField(
        null=True, blank=True
    )  # target id for the action
    is_read = models.BooleanField(default=False)

    def mark_as_read(self):
        self.is_read = True
        self.save()
