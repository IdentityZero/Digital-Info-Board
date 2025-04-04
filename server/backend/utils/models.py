from django.db import models


class TimestampedModel(models.Model):
    created_at = models.DateTimeField(verbose_name="Created at", auto_now_add=True)
    last_modified = models.DateTimeField(verbose_name="Last modified", auto_now=True)

    class Meta:
        abstract = True
