import re
from typing import Dict, Any

from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404

from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied


from .serializers import (
    UserSerializer,
    SetActiveUserSerializer,
    ChangePasswordSerializer,
)
from utils.permissions import IsAdmin


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


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
        qs = User.objects.all()
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
