from django.db import models

from utils.models import TimestampedModel


class FixedContent(TimestampedModel):
    class Meta:
        verbose_name = "Fixed Content"
        verbose_name_plural = "Fixed Contents"

    title = models.CharField(verbose_name="Title", max_length=127)
    description = models.TextField(verbose_name="Description", blank=True)
    is_displayed = models.BooleanField(default=True)

    def __str__(self):
        return self.title
