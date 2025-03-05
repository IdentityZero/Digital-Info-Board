import re
from typing import Dict, Any
import socket

from django.conf import settings
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.template.loader import render_to_string
from django.core.mail import EmailMessage
from email.utils import formataddr

from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import api_view, permission_classes


from .serializers import (
    UserSerializer,
    SetActiveUserSerializer,
    ChangePasswordSerializer,
    InviteNewUserSerializer,
)
from .models import NewUserInvitation
from utils.permissions import IsAdmin
from utils.pagination import CustomPageNumberPagination


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        invitation_code = request.data.get("invitation_code")

        if not invitation_code:
            return Response(
                {"invitation_code": ["Invitation code is required."]},
                status=status.HTTP_400_BAD_REQUEST,
            )

        invitation = NewUserInvitation.objects.filter(
            code=invitation_code, is_used=False
        )

        if not invitation.exists():
            return Response(
                {
                    "invitation_code": [
                        "This invitation code is invalid or has already been used. Please request a new one."
                    ]
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        invitation = invitation.first()
        data = request.data.copy()
        data["email"] = invitation.email
        data["profile.position"] = invitation.position
        data["profile.role"] = invitation.role

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        invitation.is_used = True
        invitation.save()

        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )


class RetrieveUpdateUserView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        pk = self.kwargs.get("pk")
        return get_object_or_404(User, id=pk)

    def update(self, request, *args, **kwargs):
        data = request.data.dict()
        profile = self.get_profile_data(data)
        if profile:
            data["profile"] = profile

        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, "_prefetched_objects_cache", None):
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)

    def get_profile_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        instance = self.get_object().profile
        found_data = {}
        pattern = r"^profile\[([^\]]+)\]$"
        keys_to_exclude_if_same = ["id_number"]

        for key, value in data.items():
            match = re.match(pattern, key)
            if match is None:
                continue
            extracted_key = match.group(1)

            old_value = getattr(instance, extracted_key)
            if old_value == value and extracted_key in keys_to_exclude_if_same:
                continue

            found_data[extracted_key] = value

        return found_data


class ListInactiveUserView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

    def get_queryset(self):
        qs = User.objects.filter(is_active=False)
        return qs


class SetActiveUserView(generics.UpdateAPIView):
    serializer_class = SetActiveUserSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

    def get_object(self):
        pk = self.kwargs.get("pk")
        return get_object_or_404(User, id=pk)


class ListAllUsersView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

    def get_queryset(self):
        qs = User.objects.select_related("profile").filter(profile__isnull=False)

        user = self.request.user
        # Remove the user in the queryset

        return qs.exclude(id=user.id)


class DeleteUserView(generics.DestroyAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

    def get_object(self):
        pk = self.kwargs.get("pk")
        return get_object_or_404(User, id=pk)


class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        """Retrieve the user object, ensuring proper access control."""
        pk = self.kwargs.get("pk")
        user = self.request.user

        if user.profile.is_admin:
            return get_object_or_404(User, id=pk)

        if str(user.id) != str(pk):
            raise PermissionDenied("You can only change your own password.")

        return user


def send_email(code: str, to_email: str, url: str) -> None:
    subject = "Welcome to Computer Engineering - MMSU Digital Information Board"
    html_content = render_to_string(
        "users/email_invitation.html",
        {"code": code, "host": url},
    )

    from_email = formataddr(
        (
            "CpE MMSU Digital Info Board",
            getattr(settings, "EMAIL_HOST_USER", "mmsucpe@gmail.com"),
        )
    )
    email = EmailMessage(subject, html_content, from_email, [to_email])
    email.content_subtype = "html"
    email.send()


class ListCreateUserInvitationView(generics.ListCreateAPIView):
    serializer_class = InviteNewUserSerializer
    permission_classes = [IsAuthenticated, IsAdmin]
    pagination_class = CustomPageNumberPagination

    def list(self, request, *args, **kwargs):
        self.queryset = NewUserInvitation.objects.filter(inviter=self.request.user)
        return super().list(request, *args, **kwargs)

    def get_queryset(self):
        qs = NewUserInvitation.objects.filter(inviter=self.request.user).order_by("-id")
        return qs

    def perform_create(self, serializer):
        inst = serializer.save(inviter=self.request.user)

        try:
            registration_url = self.request.build_absolute_uri("/")
            send_email(inst.code, inst.email, registration_url)
            inst.is_email_sent = True
            inst.save()
        except (socket.gaierror, socket.timeout, OSError) as e:
            pass
            # is_email_sent is False by Default
            # inst.is_email_sent = False
            # inst.save()


class DeleteUserInvitationView(generics.DestroyAPIView):
    serializer_class = InviteNewUserSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

    def get_queryset(self):
        qs = NewUserInvitation.objects.filter(inviter=self.request.user)
        return qs


class RetrieveInvitationCodeDetailsView(generics.RetrieveAPIView):
    serializer_class = InviteNewUserSerializer
    permission_classes = [AllowAny]
    lookup_field = "code"

    def get_serializer(self, *args, **kwargs):
        kwargs["context"] = {"use_minimal": True}
        return super().get_serializer(*args, **kwargs)

    def get_queryset(self):
        qs = NewUserInvitation.objects.all()
        return qs


@api_view(["POST"])
@permission_classes([IsAuthenticated, IsAdmin])
def resend_invitation_email(request, pk):
    inst = get_object_or_404(NewUserInvitation, id=pk)

    try:
        registration_url = request.build_absolute_uri("/")
        send_email(inst.code, inst.email, registration_url)
        inst.is_email_sent = True
        inst.save()
        return JsonResponse(
            {"success": True, "message": "Invitation email resent successfully."}
        )
    except:
        return JsonResponse({"success": False, "message": "Failed to send email."})
