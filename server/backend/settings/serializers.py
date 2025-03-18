from rest_framework import serializers

from .models import Settings


class SettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Settings
        fields = ["announcement_start"]


# V2


class ListSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Settings
        fields = [
            "announcement_start",
            "show_organization",
            "show_upcoming_events",
            "show_media_displays",
            "show_weather_forecast",
            "show_calendar",
        ]


class AnnouncementStartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Settings
        fields = ["announcement_start"]


class ShowOrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Settings
        fields = ["show_organization"]


class ShowUpcomingEventsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Settings
        fields = ["show_upcoming_events"]


class ShowMediaDisplaysSerializer(serializers.ModelSerializer):
    class Meta:
        model = Settings
        fields = ["show_media_displays"]


class ShowWeatherForecastSerializer(serializers.ModelSerializer):
    class Meta:
        model = Settings
        fields = ["show_weather_forecast"]


class ShowCalendarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Settings
        fields = ["show_calendar"]
