import mimetypes
from django.db.models import Max
from rest_framework import serializers

from .models import OrganizationMembers, UpcomingEvents, MediaDisplays


class OrganizationMembersSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizationMembers
        fields = "__all__"

    def create(self, validated_data):
        try:
            priority_number = (
                OrganizationMembers.objects.aggregate(max_value=Max("priority"))[
                    "max_value"
                ]
                + 1
                or 0
            )
        except TypeError:  # If max value is None
            priority_number = 1

        inst = OrganizationMembers.objects.create(
            **validated_data, priority=priority_number
        )

        return inst


class UpcomingEventsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UpcomingEvents
        fields = "__all__"


def get_mime_type(file_field):
    file_path = file_field.path
    mime_type, _ = mimetypes.guess_type(file_path)
    return mime_type


class MediaDisplaysSerializer(serializers.ModelSerializer):
    file_size = serializers.SerializerMethodField(read_only=True)
    type = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = MediaDisplays
        fields = ["id", "priority", "name", "file", "file_size", "type"]

    def get_file_size(self, obj):
        try:
            if obj.file and obj.file.size:
                return obj.file.size
        except:
            return None

    def get_type(self, obj):

        type = get_mime_type(obj.file)

        if "video" in type:
            return "video"
        else:
            return "image"

    def create(self, validated_data):
        try:
            priority_number = (
                MediaDisplays.objects.aggregate(max_value=Max("priority"))["max_value"]
                + 1
                or 0
            )
        except TypeError:  # max value is None
            priority_number = 1

        inst = MediaDisplays.objects.create(**validated_data, priority=priority_number)

        return inst
