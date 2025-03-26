from django.db import transaction
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import OrderBy, F, Case, When, Value, IntegerField
from django.utils.timezone import now

from utils.permissions import IsAdmin
from utils.pagination import CustomPageNumberPagination

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

    return Response(
        {"message": "Update successful", "success": True}, status=status.HTTP_200_OK
    )


class DeleteOrganizationMembersApiView(generics.DestroyAPIView):
    serializer_class = serializers.OrganizationMembersSerializer
    queryset = models.OrganizationMembers.objects.all()
    permission_classes = [permissions.IsAuthenticated]


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
            qs = qs.filter(date__gt=today)

        return qs


class DeleteUpcomingEventApiView(generics.DestroyAPIView):
    serializer_class = serializers.UpcomingEventsSerializer
    queryset = models.UpcomingEvents.objects.all()
    permission_classes = [permissions.IsAuthenticated]


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

    return Response(
        {"message": "Update successful", "success": True}, status=status.HTTP_200_OK
    )


class DeleteMediaDisplayApiView(generics.DestroyAPIView):
    serializer_class = serializers.MediaDisplaysSerializer
    queryset = models.MediaDisplays.objects.all()
    permission_classes = [permissions.IsAuthenticated]
