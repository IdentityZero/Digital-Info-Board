# Generated by Django 5.1.2 on 2025-03-18 01:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("settings", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="settings",
            name="show_calendar",
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name="settings",
            name="show_media_displays",
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name="settings",
            name="show_organization",
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name="settings",
            name="show_upcoming_events",
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name="settings",
            name="show_weather_forecast",
            field=models.BooleanField(default=True),
        ),
    ]
