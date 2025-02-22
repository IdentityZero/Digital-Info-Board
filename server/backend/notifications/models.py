from django.db import models
from django.contrib.auth.models import User

from utils.models import TimestampedModel


class Notifications(TimestampedModel):
    class Meta:
        verbose_name = "Notification"
        verbose_name_plural = "Notifications"
        ordering = ["created_at"]  # from Timestamp Model

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="notifications"
    )
    message = models.TextField()
    is_read = models.BooleanField(False)

    def mark_as_read(self):
        self.is_read = True
        self.save()
