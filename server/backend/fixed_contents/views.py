from django.db import transaction
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import OrderBy, F
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
            return [permissions.IsAuthenticated(), IsAdmin()]

    def get_queryset(self):
        qs = models.OrganizationMembers.objects.all().order_by(
            OrderBy(F("priority"), nulls_last=True)
        )
        return qs


@api_view(["PUT"])
@permission_classes([permissions.IsAuthenticated, IsAdmin])
def update_org_priority(request):
    data = request.data
    if not isinstance(data, list):
        return Response(
            {"error": "Expected a list of objects", "success": False},
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
                    "error": f"ID no.{id} cannot be found. Please refresh the page to get latest data.",
                    "success": False,
                },
                status=status.HTTP_404_NOT_FOUND,
            )

    with transaction.atomic():
        models.OrganizationMembers.objects.bulk_update(instances, ["priority"])

    return Response(
        {"message": "Update successful", "success": True}, status=status.HTTP_200_OK
    )


class DeleteOrganizationMembersApiView(generics.DestroyAPIView):
    serializer_class = serializers.OrganizationMembersSerializer
    queryset = models.OrganizationMembers.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsAdmin]


class ListCreateUpcomingEventApiView(generics.ListCreateAPIView):
    serializer_class = serializers.UpcomingEventsSerializer
    pagination_class = CustomPageNumberPagination

    def get_permissions(self):
        if self.request.method == "GET":
            return [permissions.AllowAny()]
        else:
            return [permissions.IsAuthenticated(), IsAdmin()]

    def get_queryset(self):
        qs = models.UpcomingEvents.objects.all()

        active = self.request.query_params.get("active")

        if active:
            today = now().date()
            qs = qs.filter(date__gt=today)

        return qs


class DeleteUpcomingEventApiView(generics.DestroyAPIView):
    serializer_class = serializers.UpcomingEventsSerializer
    queryset = models.UpcomingEvents.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsAdmin]


class ListCreateMediaDisplaysApiView(generics.ListCreateAPIView):
    serializer_class = serializers.MediaDisplaysSerializer
    queryset = models.MediaDisplays.objects.all()
    pagination_class = CustomPageNumberPagination

    def get_permissions(self):
        if self.request.method == "GET":
            return [permissions.AllowAny()]
        else:
            return [permissions.IsAuthenticated(), IsAdmin()]


class DeleteMediaDisplayApiView(generics.DestroyAPIView):
    serializer_class = serializers.MediaDisplaysSerializer
    queryset = models.MediaDisplays.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
