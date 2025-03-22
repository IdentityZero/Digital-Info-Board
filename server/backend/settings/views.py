from rest_framework import generics, permissions
from rest_framework.status import HTTP_405_METHOD_NOT_ALLOWED, HTTP_400_BAD_REQUEST
from rest_framework.response import Response

from utils.permissions import IsAdmin

from . import serializers
from .models import Settings

# see SERIALIZER_MAP


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

    serializer_class = serializers.ListSettingsSerializer
    permission_classes = [permissions.AllowAny]

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
        else:
            return [permissions.IsAuthenticated()]
