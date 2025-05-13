from datetime import timedelta

from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError


from utils.models import TimestampedModel
from .validators import (
    validate_image_file_with_gif,
    validate_file_name_length,
    validate_video_file,
)

from .utils import check_valid_display_duration


class ActiveManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(deleted_at__isnull=True)


class DeletedManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(deleted_at__isnull=False)


class Announcements(TimestampedModel):
    class Meta:
        verbose_name = "Announcement"
        verbose_name_plural = "Announcements"

    title = models.JSONField()  # Using Quill Library
    author = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="my_announcements"
    )
    start_date = models.DateTimeField(
        verbose_name="Display start",
        help_text="Select the date and time when the announcement will be displayed",
    )
    end_date = models.DateTimeField(
        verbose_name="Display end",
        help_text="Select the date and time when the announcement will no longer be displayed.",
    )
    is_active = models.BooleanField(default=False)
    position = models.PositiveIntegerField(blank=True, null=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    objects = ActiveManager()
    all_objects = models.Manager()
    deleted_objects = DeletedManager()

    def soft_delete(self):
        self.deleted_at = timezone.now()
        self.save()

    def restore(self):
        self.deleted_at = None
        self.save()

    def clean(self):
        errors = {}

        # For some reason it is accepting null as a value then causing an error during serialization
        if self.title is None or self.title == "":
            errors["title"] = "This field is required."

        if self.end_date and self.end_date <= self.start_date:
            errors["end_date"] = "Display end time must be after display start"

        if errors:
            raise ValidationError(errors)

        return super().clean()

    def __str__(self):

        return f"{self.title}"


class TextAnnouncements(TimestampedModel):
    class Meta:
        verbose_name = "Text Announcement"
        verbose_name_plural = "Text Announcements"

    announcement = models.OneToOneField(
        Announcements, on_delete=models.CASCADE, related_name="text_announcement"
    )
    details = models.JSONField()
    duration = models.DurationField(
        verbose_name="Display duration",
        help_text="Duration for which the text announcement will be displayed",
        default=timedelta(seconds=40),
    )

    def clean(self):
        errors = {}

        # For some reason it is accepting null as a value then causing an error during serialization and integerity error
        if self.details is None or self.details == "":
            errors["details"] = "This field is required."

        if check_valid_display_duration(
            self.announcement.start_date, self.announcement.end_date, self.duration
        ):
            errors["duration"] = (
                "Duration can't be longer than the total Display time of the announcement"
            )

        if errors:
            raise ValidationError(errors)

        return super().clean()


class ImageAnnouncements(TimestampedModel):
    class Meta:
        verbose_name = "Image Announcement"
        verbose_name_plural = "Image Announcement"

    announcement = models.ForeignKey(
        Announcements, on_delete=models.CASCADE, related_name="image_announcement"
    )
    image = models.ImageField(
        upload_to="image_announcements",
        validators=[validate_image_file_with_gif, validate_file_name_length],
    )
    duration = models.DurationField(
        verbose_name="Display duration",
        help_text="Duration for which the text announcement will be displayed",
        default=timedelta(seconds=40),
    )

    def clean(self):
        errors = {}

        if check_valid_display_duration(
            self.announcement.start_date, self.announcement.end_date, self.duration
        ):
            errors["duration"] = (
                "Duration can't be longer than the total Display time of the announcement"
            )

        if errors:
            raise ValidationError(errors)

        return super().clean()


class VideoAnnouncements(TimestampedModel):
    class Meta:
        verbose_name = "Video Announcement"
        verbose_name_plural = "Video Announcement"

    announcement = models.ForeignKey(
        Announcements, on_delete=models.CASCADE, related_name="video_announcement"
    )
    video = models.FileField(
        upload_to="video_announcements",
        validators=[validate_video_file, validate_file_name_length],
    )
    duration = models.DurationField(
        verbose_name="Display duration",
        help_text="Duration for which the text announcement will be displayed",
        default=timedelta(seconds=40),
    )

    def clean(self):
        errors = {}

        if check_valid_display_duration(
            self.announcement.start_date, self.announcement.end_date, self.duration
        ):
            errors["duration"] = (
                "Duration can't be longer than the total Display time of the announcement"
            )

        if errors:
            raise ValidationError(errors)

        return super().clean()
