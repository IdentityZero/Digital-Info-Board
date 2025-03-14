from rest_framework import generics, permissions
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
        qs = models.OrganizationMembers.objects.all()
        return qs


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
