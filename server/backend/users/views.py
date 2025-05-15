import random
import re
from typing import Dict, Any
import socket

from django.contrib.auth.tokens import default_token_generator
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.template.loader import render_to_string
from django.core.mail import EmailMessage, send_mail
from django.core.cache import cache
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from email.utils import formataddr

from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.decorators import api_view, permission_classes

from notifications.models import Notifications

from .serializers import (
    UserSerializer,
    SetActiveUserSerializer,
    ChangePasswordSerializer,
    InviteNewUserSerializer,
    AddEmailSerializer,
    VerifyEmailCodeSerializer,
)
from .models import NewUserInvitation, Profile
from utils.permissions import IsAdmin
from utils.pagination import CustomPageNumberPagination

FORMATTED_EMAIL_ADDRESS = formataddr(
    (
        "CpE MMSU Digital Info Board",
        getattr(settings, "EMAIL_HOST_USER", "mmsucpe@gmail.com"),
    )
)


@method_decorator(csrf_exempt, name="dispatch")
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        # bypass if no users yet
        if Profile.objects.count() == 0:
            return super().create(request, *args, **kwargs)

        invitation_code = request.data.get("invitation_code")

        if not invitation_code:
            return Response(
                {"invitation_code": ["Invitation code is required."]},
                status=status.HTTP_400_BAD_REQUEST,
            )

        invitation_qs = NewUserInvitation.objects.filter(
            code=invitation_code, is_used=False
        )

        data = request.data.copy()
        invitation_obj = None

        if invitation_qs.exists():
            invitation_obj = invitation_qs.first()
            data["email"] = invitation_obj.email
            data["profile.position"] = invitation_obj.position
            data["profile.role"] = invitation_obj.role

        serializer = self.get_serializer(data=data)
        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError as e:
            if invitation_obj is None:
                e.detail["invitation_code"] = [
                    "This invitation code is invalid or has already been used. Please request a new one."
                ]
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

        self.perform_create(serializer)

        invitation_obj.is_used = True
        invitation_obj.save()

        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )


class RetrieveUpdateUserView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user = self.request.user
        pk = self.kwargs.get("pk")

        if user.id != pk and not user.profile.is_admin:
            raise PermissionDenied("You are not allowed to access this data.")

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

        user: User = self.request.user
        object: User = self.get_object()

        # Create notification when updated by another user
        if user != object:
            Notifications.objects.create(
                user=object,
                created_by=user,
                message=f"Admin {user.first_name} {user.last_name} updated your profile. Check it out.",
                action="profile_update",
                target_id=object.id,
            )

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
    pagination_class = CustomPageNumberPagination

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


@api_view(["POST"])
@permission_classes([AllowAny])
def reset_password(request):
    email = request.data.get("email")

    if not email:
        return Response(
            {"message": "Email is required."}, status=status.HTTP_400_BAD_REQUEST
        )

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response(
            {"message": "User with this email does not exists."},
            status=status.HTTP_404_NOT_FOUND,
        )

    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    frontend_domain = getattr(
        settings, "FRONTEND_DOMAIN", "http://localhost:5173"
    ).rstrip("/")
    reset_url = f"{frontend_domain}/reset-password/{uid}/{token}/"

    send_mail(
        "Password Reset Request",
        f"Click the link below to reset your password:\n{reset_url}",
        FORMATTED_EMAIL_ADDRESS,
        [email],
    )

    return Response({"message": "Password reset email sent"}, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([AllowAny])
def confirm_reset_password(request, uidb64, token):
    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = User.objects.get(pk=uid)
    except (User.DoesNotExist, ValueError):
        return Response({"message": "Invalid user"}, status=status.HTTP_400_BAD_REQUEST)

    if not default_token_generator.check_token(user, token):
        return Response(
            {"message": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST
        )

    new_password = request.data.get("password")
    if not new_password:
        return Response(
            {"error": "Password is required"}, status=status.HTTP_400_BAD_REQUEST
        )

    user.set_password(new_password)
    user.save()

    return Response(
        {"message": "Password has been reset successfully"}, status=status.HTTP_200_OK
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_email(request):
    serializer = AddEmailSerializer(data=request.data)

    if serializer.is_valid(raise_exception=True):
        user = request.user
        email = serializer.validated_data["email"]

        verification_code = str(random.randint(100000, 999999))
        cache.set(f"email_verification_{user.id}", verification_code, timeout=600)

        send_mail(
            "Email Verification Code",
            f"Dear {user.first_name},\n\n"
            f"Your verification code is: {verification_code}\n\n"
            f"This code is valid for 10 minutes. Please do not share it with anyone.\n\n"
            f"If you did not request this code, please ignore this email.\n\n"
            f"Best regards,\n"
            f"CPE Department",
            FORMATTED_EMAIL_ADDRESS,
            [email],
        )

        return Response(
            {
                "message": "Verification code sent to your current email. You have 10 minutes before it expires."
            },
            status=status.HTTP_200_OK,
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def verify_email_code(request):
    serializer = VerifyEmailCodeSerializer(data=request.data)

    if serializer.is_valid():
        user = request.user
        email = serializer.validated_data["email"]
        code = serializer.validated_data["code"]

        stored_code = cache.get(f"email_verification_{user.id}")

        if code != stored_code:
            return Response(
                {
                    "message": "Invalid verification code.",
                    "code": ["Invalid verification code."],
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        recipient_list = [email]

        if user.email:
            recipient_list.append(user.email)

        user.email = email
        user.save()

        cache.delete(f"email_verification_{user.id}")

        send_mail(
            "Email Successfully Updated",
            f"Dear user,\n\n"
            f"We have successfully updated your email address to {email}.\n\n"
            f"If you made this change, no further action is required.\n"
            f"If you did not request this update, please contact our support team immediately.\n\n"
            f"Best regards,\n"
            f"CPE Department",
            FORMATTED_EMAIL_ADDRESS,
            recipient_list,
        )

        return Response(
            {"message": "Email successfully updated."}, status=status.HTTP_200_OK
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def send_email(code: str, to_email: str, url: str) -> None:
    subject = "Welcome to Computer Engineering - MMSU Digital Information Board"
    html_content = render_to_string(
        "users/email_invitation.html",
        {"code": code, "host": url},
    )

    email = EmailMessage(subject, html_content, FORMATTED_EMAIL_ADDRESS, [to_email])
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
            frontend_domain = getattr(
                settings, "FRONTEND_DOMAIN", "http://localhost:5173"
            ).rstrip("/")
            registration_url = f"{frontend_domain}/signup?ic={inst.code}"

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
        frontend_domain = getattr(
            settings, "FRONTEND_DOMAIN", "http://localhost:5173"
        ).rstrip("/")
        registration_url = f"{frontend_domain}/signup?ic={inst.code}"
        send_email(inst.code, inst.email, registration_url)
        inst.is_email_sent = True
        inst.save()
        return JsonResponse(
            {"success": True, "message": "Invitation email resent successfully."}
        )
    except:
        return JsonResponse({"success": False, "message": "Failed to send email."})
