from rest_framework import generics, permissions
from rest_framework.status import HTTP_405_METHOD_NOT_ALLOWED, HTTP_400_BAD_REQUEST
from rest_framework.response import Response

from utils.permissions import IsAdmin

from . import serializers
from .models import Settings


class RetrieveSettingsAPIView(generics.RetrieveAPIView):
    serializer_class = serializers.SettingsSerializer
    permission_classes = [permissions.AllowAny]

    def get_object(self):
        return Settings.get_solo()


class RetrieveUpdateSettingsApiView(generics.RetrieveUpdateAPIView):
    """
    Put request is disabled.
    param_key = setting
    """

    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    serializer_map = {
        "announcement_start": serializers.AnnouncementStartSerializer,
        "show_organization": serializers.ShowOrganizationSerializer,
        "show_upcoming_events": serializers.ShowUpcomingEventsSerializer,
        "show_media_displays": serializers.ShowMediaDisplaysSerializer,
        "show_weather_forecast": serializers.ShowWeatherForecastSerializer,
        "show_calendar": serializers.ShowCalendarSerializer,
    }

    not_editable_keys = ["announcement_start"]

    def put(self, request, *args, **kwargs):
        return Response(
            {"error": "PUT method is not allowed. Use PATCH instead."},
            status=HTTP_405_METHOD_NOT_ALLOWED,
        )

    def get_object(self):
        return Settings.get_solo()

    def get_permissions(self):
        if self.request.method == "GET":
            return [permissions.AllowAny()]
        elif self.request.method == "PATCH":
            return [permissions.IsAuthenticated(), IsAdmin()]
        return super().get_permissions()

    def get_serializer_class(self):
        setting_key = self.request.query_params.get("setting")
        print(setting_key)
        return self.serializer_map.get(setting_key, None)

    def get(self, request, *args, **kwargs):
        serializer_class = self.get_serializer_class()
        if serializer_class is None:
            return Response(
                {
                    "error": "Invalid setting key. Use one of: "
                    + ", ".join(self.serializer_map.keys())
                },
                status=HTTP_400_BAD_REQUEST,
            )

        return super().get(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        serializer_class = self.get_serializer_class()
        if serializer_class is None:
            return Response(
                {
                    "error": "Invalid setting key. Use one of: "
                    + ", ".join(self.serializer_map.keys())
                },
                status=HTTP_400_BAD_REQUEST,
            )

        setting_key = self.request.query_params.get("setting")

        if setting_key in self.not_editable_keys:
            return Response(
                {"error": f"Key '{setting_key}' is read only."},
                status=HTTP_400_BAD_REQUEST,
            )

        return super().patch(request, *args, **kwargs)


class RetrieveFixedContentSettingsApiView(generics.RetrieveAPIView):
    serializer_class = serializers.ListSettingsSerializer
    permission_classes = [permissions.AllowAny]

    def get_object(self):
        return Settings.get_solo()
