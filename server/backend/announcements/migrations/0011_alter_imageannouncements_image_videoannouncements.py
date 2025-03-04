# Generated by Django 5.1.2 on 2024-11-22 02:38

import announcements.validators
import datetime
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("announcements", "0010_alter_announcements_start_date"),
    ]

    operations = [
        migrations.AlterField(
            model_name="imageannouncements",
            name="image",
            field=models.ImageField(
                upload_to="image_announcements",
                validators=[
                    announcements.validators.validate_image_file_with_gif,
                    announcements.validators.validate_file_name_length,
                ],
            ),
        ),
        migrations.CreateModel(
            name="VideoAnnouncements",
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
                    "video",
                    models.FileField(
                        upload_to="video_announcements",
                        validators=[
                            announcements.validators.validate_video_file,
                            announcements.validators.validate_file_name_length,
                        ],
                    ),
                ),
                (
                    "duration",
                    models.DurationField(
                        default=datetime.timedelta(seconds=40),
                        help_text="Duration for which the text announcement will be displayed",
                        verbose_name="Display duration",
                    ),
                ),
                (
                    "announcement",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="video_announcement",
                        to="announcements.announcements",
                    ),
                ),
            ],
            options={
                "verbose_name": "Video Announcement",
                "verbose_name_plural": "Video Announcement",
            },
        ),
    ]
