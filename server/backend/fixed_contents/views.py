from datetime import datetime
import requests

from django.db import transaction
from django.http import JsonResponse
from django.conf import settings
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import OrderBy, F, Case, When, Value, IntegerField
from django.utils.timezone import now

from utils.pagination import CustomPageNumberPagination
from notifications.utils import create_notification_for_admins

from . import serializers, models


class ListCreateOrgMembersApiView(generics.ListCreateAPIView):
    serializer_class = serializers.OrganizationMembersSerializer
    pagination_class = CustomPageNumberPagination

    def get_permissions(self):
        if self.request.method == "GET":
            return [permissions.AllowAny()]
        else:
            return [permissions.IsAuthenticated()]

    def get_queryset(self):
        qs = models.OrganizationMembers.objects.all().order_by(
            OrderBy(F("priority"), nulls_last=True)
        )
        return qs

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code in [200, 201]:
            create_notification_for_admins(
                self.request.user,
                f"New member, {response.data['name']} as {response.data['position']}, is added to Organization default displays. Check it out",
                action="organization_member_added",
                target_id=response.data["id"],
            )

        return response


@api_view(["PUT"])
@permission_classes([permissions.IsAuthenticated])
def update_org_priority(request):
    """
    Expects data as application/json
    """
    data = request.data
    if not isinstance(data, list):
        return Response(
            {"message": "Expected a list of objects", "success": False},
            status=status.HTTP_400_BAD_REQUEST,
        )

    instances = []

    for item in data:
        id = item.get("id")

        try:
            obj = models.OrganizationMembers.objects.get(id=id)
            for key, value in item.items():
                setattr(obj, key, value)
            instances.append(obj)
        except models.OrganizationMembers.DoesNotExist:
            return Response(
                {
                    "message": f"ID no.{id} cannot be found. Please refresh the page to get latest data.",
                    "success": False,
                },
                status=status.HTTP_404_NOT_FOUND,
            )

    with transaction.atomic():
        models.OrganizationMembers.objects.bulk_update(instances, ["priority"])

    # change key names from priority to new_position
    updated_data = [
        {"id": item["id"], "new_position": item["priority"]} for item in data
    ]
    # Send to auto update
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        "realtime_update",
        {
            "type": "send.update",
            "content": "organization",
            "action": "sequence_update",
            "data": updated_data,
        },
    )

    # create notification
    create_notification_for_admins(
        request.user,
        "Sequence of Organization displays was changed. Check it out",
        action="organization_sequence_update",
    )

    return Response(
        {"message": "Update successful", "success": True}, status=status.HTTP_200_OK
    )


class DeleteUpdateOrganizationMembersApiView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.OrganizationMembersSerializer
    queryset = models.OrganizationMembers.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        object = self.get_object()
        response = super().delete(request, *args, **kwargs)

        if response.status_code in [200, 202, 204]:
            create_notification_for_admins(
                self.request.user,
                f"Member, {object.name} as {object.position}, is deleted from the Organization default displays. Check it out",
                action="organization_member_deleted",
            )

        return response


class ListCreateUpcomingEventApiView(generics.ListCreateAPIView):
    serializer_class = serializers.UpcomingEventsSerializer
    pagination_class = CustomPageNumberPagination

    def get_permissions(self):
        if self.request.method == "GET":
            return [permissions.AllowAny()]
        else:
            return [permissions.IsAuthenticated()]

    def get_queryset(self):
        qs = models.UpcomingEvents.objects.all()

        today = now().date()

        # Annotate events to distinguish upcoming (0) and past (1) events
        qs = qs.annotate(
            is_past=Case(
                When(date__lt=today, then=Value(1)),  # Past events get value 1
                default=Value(0),  # Upcoming events get value 0
                output_field=IntegerField(),
            )
        ).order_by(
            "is_past", "date"
        )  # Sort upcoming first, then by date

        # Filter for active events if requested
        active = self.request.query_params.get("active")
        if active:
            qs = qs.filter(date__gte=today)

        return qs

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code in [200, 201]:
            date_string = response.data["date"]
            formatted_date = datetime.strptime(date_string, "%Y-%m-%d").strftime(
                "%B %d, %Y"
            )
            create_notification_for_admins(
                self.request.user,
                f"An upcoming event entitled, {response.data['name']} on {formatted_date}, is added to Upcoming events default displays. Check it out",
                action="upcoming_event_added",
                target_id=response.data["id"],
            )

        return response


class DeleteUpdateUpcomingEventApiView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.UpcomingEventsSerializer
    queryset = models.UpcomingEvents.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        object = self.get_object()
        response = super().delete(request, *args, **kwargs)

        if response.status_code in [200, 202, 204]:
            formatted_date = object.date.strftime("%B %d, %Y")
            create_notification_for_admins(
                self.request.user,
                f"Event, {object.name} on {formatted_date}, is deleted from the Upcoming events default displays. Check it out",
                action="upcoming_event_deleted",
            )

        return response


class ListCreateMediaDisplaysApiView(generics.ListCreateAPIView):
    serializer_class = serializers.MediaDisplaysSerializer
    queryset = models.MediaDisplays.objects.all()
    pagination_class = CustomPageNumberPagination

    def get_permissions(self):
        if self.request.method == "GET":
            return [permissions.AllowAny()]
        else:
            return [permissions.IsAuthenticated()]

    def get_queryset(self):
        qs = models.MediaDisplays.objects.all().order_by(
            OrderBy(F("priority"), nulls_last=True)
        )
        return qs

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code in [200, 201]:
            create_notification_for_admins(
                self.request.user,
                f"New media display, {response.data["name"]}, is added to Media default displays. Check it out",
                action="media_display_added",
                target_id=response.data["id"],
            )

        return response


@api_view(["PUT"])
@permission_classes([permissions.IsAuthenticated])
def update_media_displays_priority(request):
    """
    Expects data as application/json
    """
    data = request.data
    if not isinstance(data, list):
        return Response(
            {"message": "Expected a list of objects", "success": False},
            status=status.HTTP_400_BAD_REQUEST,
        )

    instances = []

    for item in data:
        id = item.get("id")

        try:
            obj = models.MediaDisplays.objects.get(id=id)
            for key, value in item.items():
                setattr(obj, key, value)
            instances.append(obj)
        except models.MediaDisplays.DoesNotExist:
            return Response(
                {
                    "message": f"ID no.{id} cannot be found. Please refresh the page to get latest data.",
                    "success": False,
                },
                status=status.HTTP_404_NOT_FOUND,
            )

    with transaction.atomic():
        models.MediaDisplays.objects.bulk_update(instances, ["priority"])

    updated_data = [
        {"id": item["id"], "new_position": item["priority"]} for item in data
    ]
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        "realtime_update",
        {
            "type": "send.update",
            "content": "media_displays",
            "action": "sequence_update",
            "data": updated_data,
        },
    )

    # create notification
    create_notification_for_admins(
        request.user,
        "Sequence of Media displays was changed. Check it out",
        action="media_sequence_update",
    )

    return Response(
        {"message": "Update successful", "success": True}, status=status.HTTP_200_OK
    )


class DeleteUpdateMediaDisplayApiView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.MediaDisplaysSerializer
    queryset = models.MediaDisplays.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        object = self.get_object()
        response = super().delete(request, *args, **kwargs)

        if response.status_code in [200, 202, 204]:
            create_notification_for_admins(
                self.request.user,
                f"Media display, {object.name}, is deleted from the Media default displays. Check it out",
                action="media_display_deleted",
            )

        return response


def get_weather_data(request):
    key = settings.VITE_WEATHER_API_KEY
    URL = f"https://api.weatherapi.com/v1/forecast.json?key={key}&q=Laoag&days=5"
    response = requests.get(URL)

    return JsonResponse(response.json())
