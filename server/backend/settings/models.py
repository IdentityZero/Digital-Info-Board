from django.db import models
from django.utils import timezone


class Settings(models.Model):
    announcement_start = models.DateTimeField(default=timezone.now)
    show_organization = models.BooleanField(default=True)
    show_upcoming_events = models.BooleanField(default=True)
    show_media_displays = models.BooleanField(default=True)
    show_weather_forecast = models.BooleanField(default=True)
    show_calendar = models.BooleanField(default=True)

    def save(self, *args, **kwargs):
        self.pk = 1
        super(Settings, self).save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        pass

    @classmethod
    def get_solo(cls):
        obj, created = cls.objects.get_or_create(pk=1)
        return obj

    def __str__(self):
        return "Site Settings"
