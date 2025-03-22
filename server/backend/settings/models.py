from datetime import timedelta

from django.db import models
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator


class Settings(models.Model):
    CALENDAR_GRID_TYPES = [
        ("dayGridMonth", "Monthly"),
        ("timeGridWeek", "Weekly"),
        ("timeGridDay", "Daily"),
    ]

    announcement_start = models.DateTimeField(
        default=timezone.now, verbose_name="Reference point of announcement syncing"
    )

    # region Topic: Show Displays

    show_organization = models.BooleanField(
        default=True, verbose_name="Show Organization"
    )
    show_upcoming_events = models.BooleanField(
        default=True, verbose_name="Show Upcoming Events"
    )
    show_media_displays = models.BooleanField(
        default=True, verbose_name="Show Media Displays"
    )
    show_weather_forecast = models.BooleanField(
        default=True, verbose_name="Show Weather Forecasts"
    )
    show_calendar = models.BooleanField(default=True, verbose_name="Show Calendar")

    # endregion

    # region Topic: Display Slide duration

    organization_slide_duration = models.DurationField(
        default=timedelta(seconds=5), verbose_name="Duration of Organization per slide"
    )
    media_displays_slide_duration = models.DurationField(
        default=timedelta(seconds=5),
        verbose_name="Duration of Media Displays per slide",
    )
    upcoming_events_slide_duration = models.DurationField(
        default=timedelta(seconds=5),
        verbose_name="Duration of Upcoming Events per slide",
    )

    # endregion

    # region Topic: Calendar settings

    web_calendar_grid_type = models.CharField(
        max_length=32,
        choices=CALENDAR_GRID_TYPES,
        default="dayGridMonth",
        verbose_name="Web Calendar Grid Type",
    )
    web_max_events = models.SmallIntegerField(
        default=3,
        validators=[MinValueValidator(0), MaxValueValidator(5)],
        verbose_name="Max number of events to display before it collapses in Web Calendar",
    )
    web_show_events = models.BooleanField(
        default=True, verbose_name="Show events in Web Calendar"
    )
    web_show_weekends = models.BooleanField(
        default=True, verbose_name="Show weekends in Web Calendar"
    )
    web_show_grid_controls = models.BooleanField(
        default=True, verbose_name="Show grid controls in Web Calendar"
    )
    web_show_nav_controls = models.BooleanField(
        default=True, verbose_name="Show navigation controls in Web Calendar"
    )

    # Kiosk

    kiosk_calendar_grid_type = models.CharField(
        max_length=32,
        choices=CALENDAR_GRID_TYPES,
        default="dayGridMonth",
        verbose_name="Kiosk Calendar Grid Type",
    )
    kiosk_max_events = models.SmallIntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(5)],
        verbose_name="Max number of events to display before it collapses in Kiosk Calendar",
    )
    kiosk_show_events = models.BooleanField(
        default=True, verbose_name="Show events in Kiosk Calendar"
    )
    kiosk_show_weekends = models.BooleanField(
        default=True, verbose_name="Show weekends in Kiosk Calendar"
    )
    kiosk_show_grid_controls = models.BooleanField(
        default=True, verbose_name="Show grid controls in Kiosk Calendar"
    )
    kiosk_show_nav_controls = models.BooleanField(
        default=True, verbose_name="Show navigation controls in Kiosk Calendar"
    )

    # endregion

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
