# Generated by Django 5.1.2 on 2024-12-06 04:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("announcements", "0011_alter_imageannouncements_image_videoannouncements"),
    ]

    operations = [
        migrations.AlterField(
            model_name="announcements",
            name="is_active",
            field=models.BooleanField(default=False),
        ),
    ]
