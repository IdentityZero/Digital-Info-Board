from rest_framework import serializers
import mimetypes

from .models import OrganizationMembers, UpcomingEvents, MediaDisplays


class OrganizationMembersSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizationMembers
        fields = "__all__"


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
        fields = ["id", "name", "file", "file_size", "type"]

    def get_file_size(self, obj):

        if obj.file and obj.file.size:
            return obj.file.size
        return None

    def get_type(self, obj):

        type = get_mime_type(obj.file)

        if "video" in type:
            return "video"
        else:
            return "image"
