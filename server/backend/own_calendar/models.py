from django.db import models

from utils.models import TimestampedModel


class Calendar(TimestampedModel):
    class Meta:
        verbose_name = "Calendar Event"
        verbose_name_plural = "Calendar Events"

    title = models.CharField(max_length=128, verbose_name="Event title")
    description = models.TextField(
        blank=True, null=True, verbose_name="Event description"
    )
    location = models.CharField(
        max_length=128, verbose_name="Event location", blank=True, null=True
    )
    start = models.DateTimeField(
        verbose_name="Event start datetime",
    )
    end = models.DateTimeField(
        verbose_name="Event start datetime",
    )

    def __str__(self):
        return f"{self.title}"
