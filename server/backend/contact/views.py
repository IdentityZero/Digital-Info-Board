from datetime import timedelta
from django.db.models import Q

from django.utils.timezone import now

from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveDestroyAPIView,
    UpdateAPIView,
)
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_429_TOO_MANY_REQUESTS, HTTP_200_OK

from utils.permissions import IsAdmin
from utils.pagination import CustomPageNumberPagination

from .serializers import (
    PrimaryContactUsMessageSerializer,
    ContactUsMessageWithUserNamesSerializer,
)
from .models import ContactUsMessage


class CreateContactUsMessageAPIView(ListCreateAPIView):
    permission_classes = [AllowAny]
    queryset = ContactUsMessage.objects.all()
    serializer_class = PrimaryContactUsMessageSerializer
    pagination_class = CustomPageNumberPagination

    def get_permissions(self):
        if self.request.method == "GET":
            return [IsAuthenticated(), IsAdmin()]
        elif self.request.method == "POST":
            return [AllowAny()]
        return super().get_permissions()

    def post(self, request, *args, **kwargs):
        email = request.data.get("email")

        yesterday = now().date() - timedelta(days=1)
        already_exists = ContactUsMessage.objects.filter(
            email=email, created_at__gte=yesterday
        ).exists()

        if already_exists:
            return Response(
                {"error": "Your email can only submit once per day."},
                status=HTTP_429_TOO_MANY_REQUESTS,
            )

        return super().post(request, *args, **kwargs)

    def perform_create(self, serializer):
        instance = serializer.save()

        from notifications.utils import create_notification_for_admins

        create_notification_for_admins(
            None,
            "New message was created. Check it out.",
            "message_created",
            instance.id,
        )


class RetrieveContactUsMessageApiView(RetrieveDestroyAPIView):
    queryset = ContactUsMessage.objects.all()
    serializer_class = ContactUsMessageWithUserNamesSerializer
    permission_classes = [IsAuthenticated, IsAdmin]


class UpdateRespondedApiView(UpdateAPIView):
    queryset = ContactUsMessage.objects.all()
    serializer_class = PrimaryContactUsMessageSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_responded = True
        instance.responded_by = request.user
        instance.save()

        serializer = self.get_serializer(instance)
        return Response(serializer.data, status=HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)
