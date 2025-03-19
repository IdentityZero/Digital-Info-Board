from django.db import models

from utils.models import TimestampedModel
from utils.validators import validate_file_name_length


class OrganizationMembers(TimestampedModel):
    class Meta:
        verbose_name = "Organization Member"
        verbose_name_plural = "Organization Members"
        ordering = ["-created_at"]

    name = models.CharField(max_length=64)
    position = models.CharField(max_length=32)
    image = models.ImageField(
        upload_to="org_members", default="org_members/default.png"
    )
    priority = models.PositiveIntegerField(blank=True, null=True)


class UpcomingEvents(TimestampedModel):
    class Meta:
        verbose_name = "Upcoming Event"
        verbose_name_plural = "Upcoming Events"
        ordering = ["-created_at"]

    name = models.CharField(max_length=64)
    date = models.DateField()


class MediaDisplays(TimestampedModel):
    class Meta:
        verbose_name = "Media Display"
        verbose_name_plural = "Media Displays"
        ordering = ["-created_at"]

    name = models.CharField(max_length=64)
    file = models.FileField(
        upload_to="media_displays",
        validators=[validate_file_name_length],
    )
    priority = models.PositiveIntegerField(blank=True, null=True)
