# Generated by Django 5.1.2 on 2025-03-17 13:19

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Calendar",
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
                ("title", models.CharField(max_length=128, verbose_name="Event title")),
                (
                    "description",
                    models.TextField(
                        blank=True, null=True, verbose_name="Event description"
                    ),
                ),
                (
                    "location",
                    models.CharField(max_length=128, verbose_name="Event location"),
                ),
                ("start", models.DateTimeField(verbose_name="Event start datetime")),
                ("end", models.DateTimeField(verbose_name="Event start datetime")),
            ],
            options={
                "verbose_name": "Calendar Event",
                "verbose_name_plural": "Calendar Events",
            },
        ),
    ]
