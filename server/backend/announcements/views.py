import re
from typing import Dict, Any, List

from django.urls import reverse
import json

from rest_framework import generics, response, exceptions, status, response, parsers
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import JSONParser, FormParser, MultiPartParser

from .serializers import (
    CreateAnnouncementSerializer,
    RetrieveFullAnnouncementSerializer,
    UpdateFullImageAnnouncementSerializer,
    UpdateFullVideoAnnouncementSerializer,
    ActivateAnnouncementSerializer,
)
from .models import Announcements


class ListCreateAllAnnouncementAPIView(generics.ListCreateAPIView):
    """
    This endpoint uses a customized serialization, use [] for nesting or for arrays
    For text based:
        text_announcement[details]
        text_announcement[duration]

    For image and video(Use 0 for 1 instance only) or set content type to multipart
        image_announcement[0].image
        image_announcement[0].duration

        video_announcement[0].video
        video_announcement[0].duration


    Remove text_announcement if you dont want to add text announcement or set text_announcement details to null or ''
    """

    queryset = Announcements.objects.all()
    serializer_class = CreateAnnouncementSerializer
    permission_classes = [AllowAny]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    def create(self, request, *args, **kwargs):
        """
        Nested data was not properly handled in the 2nd depth.
        So we created
            get_text_announcements
            get_image_announcements
            get_video_announcements
        """

        data = request.data.dict()

        text_announcement = self.get_text_announcements(data)
        if text_announcement:
            data["text_announcement"] = text_announcement

        image_announcement = self.get_image_announcements(data)
        if image_announcement:
            data["image_announcement"] = image_announcement

        video_announcement = self.get_video_announcements(data)
        if video_announcement:
            data["video_announcement"] = video_announcement

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return response.Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )

    def get_video_announcements(self, data: Dict[str, Any]) -> Dict[str, Any]:
        found_data = []
        pattern = r"^video_announcement\[\d+\]\[video\]$"

        for video_key, value in data.items():
            if re.match(pattern, video_key):
                dict = {}
                duration_key_pattern = video_key.replace("[video]", "[duration]")

                if duration_key_pattern in data:
                    dict["duration"] = data[duration_key_pattern]

                dict["video"] = value
                found_data.append(dict)

        return found_data

    def get_image_announcements(self, data: Dict[str, Any]) -> List[Dict[str, Any]]:
        found_data = []
        pattern = r"^image_announcement\[\d+\]\[image\]$"

        for image_key, value in data.items():
            if re.match(pattern, image_key):
                dict = {}
                duration_key_pattern = image_key.replace("[image]", "[duration]")

                if duration_key_pattern in data:
                    dict["duration"] = data[duration_key_pattern]

                dict["image"] = value
                found_data.append(dict)

        return found_data

    def get_text_announcements(self, data: Dict[str, Any]) -> Dict[str, Any]:
        found_data = {}
        if "text_announcement[details]" in data:
            found_data["details"] = data["text_announcement[details]"]

            if "text_announcement[duration]" in data:

                found_data["duration"] = data["text_announcement[duration]"]

        return found_data

    def get_permissions(self):
        if self.request.method == "POST":
            self.permission_classes = [IsAuthenticated]

        return super().get_permissions()

    def perform_create(self, serializer):

        if serializer.is_valid(raise_exception=True):
            serializer.save(author=self.request.user)


class UpdateAnnouncementActiveStatusAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = ActivateAnnouncementSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = Announcements.objects.filter(author=self.request.user)
        return qs


class RetrieveUpdateDestroyAnnouncementAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    Can only retrieve, update, and delete own announcements
    We can only update text announcement here
    """

    serializer_class = RetrieveFullAnnouncementSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    def get_queryset(self):
        qs = Announcements.objects.filter(author=self.request.user)
        return qs


class RetrieveUpdateImageAnnouncementAPIView(generics.RetrieveUpdateAPIView):
    """
    This endpoint will
        - Delete Image Content individually
        - Add New Image Content
        - Update Existing Image content (duration only).
    Updating image is not supported instead, delete existing image content then add new one

    How to delete:
        Add 'to_delete' which will contain a list of IDs of the Image Announcement to be deleted.
        'to_delete' will be in the top level, alongside the title and dates

    How to update:
        Add 'to_update which will contain a list of key-value pair that will contain id and value to update.
        E.G
        [
            {
                id: 1,
                duration: '00:00:40'
            }
        ]
        'to_update' will be in the top level, alongside the title and dates

    """

    serializer_class = UpdateFullImageAnnouncementSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        data = request.data.dict()

        image_announcement = self.get_image_announcements(data)
        if image_announcement:
            data["image_announcement"] = image_announcement

        to_update = self.get_to_update(data)
        if to_update:
            data["to_update"] = to_update

        stringified_to_delete = data.get("to_delete")
        if stringified_to_delete:
            data["to_delete"] = json.loads(stringified_to_delete)

        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, "_prefetched_objects_cache", None):
            instance._prefetched_objects_cache = {}

        return response.Response(serializer.data)

    def get_image_announcements(self, data: Dict[str, Any]) -> List[Dict[str, Any]]:
        found_data = []
        pattern = r"^image_announcement\[\d+\]\[image\]$"

        for image_key, value in data.items():
            if re.match(pattern, image_key):
                dict = {}
                duration_key_pattern = image_key.replace("[image]", "[duration]")

                if duration_key_pattern in data:
                    dict["duration"] = data[duration_key_pattern]

                dict["image"] = value
                found_data.append(dict)

        return found_data

    def get_to_update(self, data: Dict[str, Any]) -> List[Dict[str, Any]]:
        found_data = []
        pattern = r"^to_update\[\d+\]\[id\]$"

        for key, value in data.items():
            if re.match(pattern, key):
                dict = {}
                duration_key_pattern = key.replace("[id]", "[duration]")

                if duration_key_pattern in data:
                    dict["duration"] = data[duration_key_pattern]

                dict["id"] = value
                found_data.append(dict)

        return found_data

    def get_queryset(self):
        qs = Announcements.objects.filter(author=self.request.user)
        return qs


class RetrieveUpdateVideoAnnouncementAPIView(generics.RetrieveUpdateAPIView):
    """
    This endpoint will
        - Delete Video Content individually
        - Add New Video Content
        - Update Existing Video content (duration only).
    Updating video is not supported instead, delete existing video content then add new one

    How to delete:
        Add 'to_delete' which will contain a list of IDs of the Video Announcement to be deleted.
        'to_delete' will be in the top level, alongside the title and dates

    How to update:
        Add 'to_update which will contain a list of key-value pair that will contain id and value to update.
        E.G
        [
            {
                id: 1,
                duration: '00:00:40'
            }
        ]
        'to_update' will be in the top level, alongside the title and dates

    """

    serializer_class = UpdateFullVideoAnnouncementSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        data = request.data.dict()

        video_announcement = self.get_video_announcements(data)
        print(video_announcement)
        if video_announcement:
            data["video_announcement"] = video_announcement

        to_update = self.get_to_update(data)
        if to_update:
            data["to_update"] = to_update

        stringified_to_delete = data.get("to_delete")
        if stringified_to_delete:
            data["to_delete"] = json.loads(stringified_to_delete)

        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, "_prefetched_objects_cache", None):
            instance._prefetched_objects_cache = {}

        return response.Response(serializer.data)

    def get_to_update(self, data: Dict[str, Any]) -> List[Dict[str, Any]]:
        found_data = []
        pattern = r"^to_update\[\d+\]\[id\]$"

        for key, value in data.items():
            if re.match(pattern, key):
                dict = {}
                duration_key_pattern = key.replace("[id]", "[duration]")

                if duration_key_pattern in data:
                    dict["duration"] = data[duration_key_pattern]

                dict["id"] = value
                found_data.append(dict)

        return found_data

    def get_video_announcements(self, data: Dict[str, Any]) -> List[Dict[str, Any]]:
        found_data = []
        pattern = r"^video_announcement\[\d+\]\[video\]$"

        for video_key, value in data.items():
            if re.match(pattern, video_key):
                dict = {}
                duration_key_pattern = video_key.replace("[video]", "[duration]")

                if duration_key_pattern in data:
                    dict["duration"] = data[duration_key_pattern]

                dict["video"] = value
                found_data.append(dict)

        return found_data

    def get_queryset(self):
        qs = Announcements.objects.filter(author=self.request.user)
        return qs


class ListTextAnnouncementAPIView(generics.ListAPIView):
    """
    List of Base Announcement with Text Announcement and is owned by User
    """

    serializer_class = CreateAnnouncementSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = Announcements.objects.filter(
            author=self.request.user, text_announcement__isnull=False
        )
        return qs


class ListImageAnnouncementAPIView(generics.ListAPIView):
    """
    List of Base Announcement with Image Announcement and is owned by User
    """

    serializer_class = CreateAnnouncementSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = Announcements.objects.filter(
            author=self.request.user, image_announcement__isnull=False
        ).distinct()
        return qs


class ListVideoAnnouncementAPIView(generics.ListAPIView):
    """
    List of Base Announcement with Video Announcement and is owned by User
    """

    serializer_class = CreateAnnouncementSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = Announcements.objects.filter(
            author=self.request.user, video_announcement__isnull=False
        ).distinct()
        return qs
