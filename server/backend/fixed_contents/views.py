from rest_framework import generics, permissions

from utils.permissions import IsAdmin
from utils.pagination import CustomPageNumberPagination

from . import serializers, models


class ListCreateOrgMembersApiView(generics.ListCreateAPIView):
    serializer_class = serializers.OrganizationMembersSerializer
    queryset = models.OrganizationMembers.objects.all()
    pagination_class = CustomPageNumberPagination

    def get_permissions(self):
        if self.request.method == "GET":
            return [permissions.AllowAny()]
        else:
            return [permissions.IsAuthenticated(), IsAdmin()]


class DeleteOrganizationMembersApiView(generics.DestroyAPIView):
    serializer_class = serializers.OrganizationMembersSerializer
    queryset = models.OrganizationMembers.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsAdmin]


class ListCreateUpcomingEventApiView(generics.ListCreateAPIView):
    serializer_class = serializers.UpcomingEventsSerializer
    queryset = models.UpcomingEvents.objects.all()
    pagination_class = CustomPageNumberPagination

    def get_permissions(self):
        if self.request.method == "GET":
            return [permissions.AllowAny()]
        else:
            return [permissions.IsAuthenticated(), IsAdmin()]


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
