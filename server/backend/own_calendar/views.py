from datetime import datetime

from rest_framework import generics, permissions

from .models import Calendar
from .serializers import CalendarSerializer

from notifications.utils import create_notification_for_admins


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

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code in [200, 201]:
            start_date = datetime.fromisoformat(response.data["start"]).strftime(
                "%B %d, %Y %I:%M %p"
            )
            end_date = datetime.fromisoformat(response.data["end"]).strftime(
                "%B %d, %Y %I:%M %p"
            )

            create_notification_for_admins(
                self.request.user,
                f"Calendar event entitled, {response.data["title"]} on {start_date} to {end_date} is added. Check it out.",
                action="calendar_event_added",
                target_id=response.data["id"],
            )

        return response


class UpdateDeleteCalendarEventApiView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CalendarSerializer
    queryset = Calendar.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        object = self.get_object()
        response = super().delete(request, *args, **kwargs)

        if response.status_code in [200, 202, 204]:
            start_date = object.start.strftime("%B %d, %Y %I:%M %p")
            end_date = object.end.strftime("%B %d, %Y %I:%M %p")
            create_notification_for_admins(
                self.request.user,
                f"Calendar event, {object.title} on {start_date} to {end_date}, is deleted from the Upcoming events default displays. Check it out",
                action="calendar_event_deleted",
            )

        return response

    def patch(self, request, *args, **kwargs):
        response = super().patch(request, *args, **kwargs)

        if response.status_code in [200, 201, 204]:
            self.send_notification(response)

        return response

    def put(self, request, *args, **kwargs):
        response = super().patch(request, *args, **kwargs)

        if response.status_code in [200, 201, 204]:
            self.send_notification(response)

        return response

    def send_notification(self, response):

        start_date = datetime.fromisoformat(response.data["start"]).strftime(
            "%B %d, %Y %I:%M %p"
        )
        end_date = datetime.fromisoformat(response.data["end"]).strftime(
            "%B %d, %Y %I:%M %p"
        )

        create_notification_for_admins(
            self.request.user,
            f"Calendar event entitled, {response.data["title"]} on {start_date} to {end_date} is updated. Check it out.",
            action="calendar_event_updated",
            target_id=response.data["id"],
        )
