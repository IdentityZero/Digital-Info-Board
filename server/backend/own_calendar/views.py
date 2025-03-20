from rest_framework import generics, permissions

from utils.permissions import IsAdmin
from .models import Calendar
from .serializers import CalendarSerializer


class ListCreateCalendarEventApiView(generics.ListCreateAPIView):
    serializer_class = CalendarSerializer
    queryset = Calendar.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.request.method == "GET":
            return [permissions.AllowAny()]
        elif self.request.method == "POST":
            return [permissions.IsAuthenticated()]
        return super().get_permissions()


class UpdateDeleteCalendarEventApiView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CalendarSerializer
    queryset = Calendar.objects.all()
    permission_classes = [permissions.IsAuthenticated]
