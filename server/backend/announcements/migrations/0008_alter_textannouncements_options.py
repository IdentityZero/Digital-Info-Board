# Generated by Django 5.1.2 on 2024-11-18 11:09

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("announcements", "0007_imageannouncements"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="textannouncements",
            options={
                "verbose_name": "Text Announcement",
                "verbose_name_plural": "Text Announcements",
            },
        ),
    ]