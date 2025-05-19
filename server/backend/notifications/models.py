from django.db import models
from django.contrib.auth.models import User

from utils.models import TimestampedModel


class Notifications(TimestampedModel):
    class Meta:
        verbose_name = "Notification"
        verbose_name_plural = "Notifications"
        ordering = ["created_at"]  # from Timestamp Model

    NOTIFICATION_ACTIONS = [
        ("approve_announcement", "Approve Announcement"),  # To approve
        ("approve_urgent_announcement", "Approve Urgent Announcement"),
        ("announcement_approved", "Announcement Approved"),
        ("text_announcement_deactivated", "Text Announcement Deactivated"),
        ("video_announcement_deactivated", "Video Announcement Deactivated"),
        ("image_announcement_deactivated", "Text Announcement Deactivated"),
        ("announcement_sequence_update", "Announcement Sequence Update"),
        ("welcome_new_user", "Welcome new user"),
        ("profile_update", "Profile Update"),
        ("settings_update", "settings Update"),
        ("organization_member_added", "Organization member added"),
        ("organization_member_deleted", "Organization member deleted"),
        ("organization_sequence_update", "Organization sequence update"),
        ("upcoming_event_added", "Upcoming event added"),
        ("upcoming_event_deleted", "Upcoming event deleted"),
        ("media_display_added", "Media display added"),
        ("media_sequence_update", "Media sequence update"),
        ("media_display_deleted", "Media display deleted"),
        ("calendar_event_added", "Calendar Event Added"),
        ("calendar_event_deleted", "Calendar Event Deleted"),
        ("calendar_event_updated", "Calendar Event Updated"),
        ("calendar_settings_updated", "Calendar Settings Updated"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="notifications",
        verbose_name="Target User/Recipient",
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
        null=True, blank=True, help_text="ID of the object in its relative table"
    )  # target id for the action
    is_read = models.BooleanField(default=False)

    def mark_as_read(self):
        self.is_read = True
        self.save()
