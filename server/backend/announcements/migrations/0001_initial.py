# Generated by Django 5.1.2 on 2024-10-24 05:16

import announcements.validators
import datetime
import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Announcements",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "created_at",
                    models.DateTimeField(auto_now_add=True, verbose_name="Created at"),
                ),
                (
                    "last_modified",
                    models.DateTimeField(auto_now=True, verbose_name="Last modified"),
                ),
                (
                    "title",
                    models.CharField(
                        help_text="Limit of 255 characters.",
                        max_length=255,
                        verbose_name="Title",
                    ),
                ),
                ("content", models.TextField(verbose_name="Content")),
                (
                    "media",
                    models.FileField(
                        blank=True,
                        help_text="Upload a video/image file (MP4, AVI, etc.).",
                        max_length=255,
                        null=True,
                        upload_to="announcements",
                        validators=[
                            announcements.validators.validate_image_or_video_file
                        ],
                        verbose_name="Media File",
                    ),
                ),
                (
                    "display_start",
                    models.DateTimeField(
                        default=django.utils.timezone.now,
                        help_text="Select the date and time when the announcement will be displayed.",
                        verbose_name="Display start",
                    ),
                ),
                (
                    "display_end",
                    models.DateTimeField(
                        help_text="Select the date and time when the announcement will no longer be displayed.",
                        verbose_name="Display end",
                    ),
                ),
                (
                    "title_duration",
                    models.DurationField(
                        default=datetime.timedelta(seconds=40),
                        help_text="Duration for which the header will be displayed.",
                        verbose_name="Title Duration",
                    ),
                ),
                (
                    "media_duration",
                    models.DurationField(
                        default=datetime.timedelta(seconds=30),
                        help_text="Duration for which the media file will be displayed.",
                        verbose_name="Media Duration",
                    ),
                ),
                (
                    "content_duration",
                    models.DurationField(
                        default=datetime.timedelta(seconds=40),
                        help_text="Duration for which the content will be displayed.",
                        verbose_name="Content Duration",
                    ),
                ),
                (
                    "author",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="my_announcements",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "verbose_name": "Announcement",
                "verbose_name_plural": "Announcements",
            },
        ),
    ]
