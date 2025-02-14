from rest_framework import generics, permissions

from .serializers import SettingsSerializer
from .models import Settings


class RetrieveSettingsAPIView(generics.RetrieveAPIView):
    serializer_class = SettingsSerializer
    permission_classes = [permissions.AllowAny]

    def get_object(self):

        return Settings.get_solo()
