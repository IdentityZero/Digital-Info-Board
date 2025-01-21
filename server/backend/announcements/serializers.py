from typing import Optional, Dict, Any, List
from django.urls import reverse

from rest_framework import serializers
from django.utils import timezone

from .models import (
    Announcements,
    TextAnnouncements,
    ImageAnnouncements,
    VideoAnnouncements,
)
from users.serializers import UserSerializer

"""
Primary Serializers contain the methods:
    create
    validate methods

Full Serializers contains:
    attribute:
        author
        base announcement
    method:
        update
"""


class PrimaryChildAnnouncementSerializerInterface:
    """
    Use to create methods that will all be used within the Primary serializers of
        TextAnnouncement
        ImageAnnouncement
        VideoAnnouncement
    """

    def validate_before_save(self, attrs):
        """
        Use to validate data before updating child announcement
        Custom clean methods of models do not run intrinsically with the serializers, that is why we do this
        """
        view = self.context.get("view")
        if view is not None:
            lookup_value = view.kwargs.get("announcement_pk")
            if lookup_value is not None:
                parent_ann = Announcements.objects.get(id=lookup_value)
                updated_child_ann = self.Meta.model(**attrs, announcement=parent_ann)
                updated_child_ann.clean()


# region Topic: Text Announcement Serializers
class TextAnnouncementSerializer(serializers.ModelSerializer):
    """
    Set Details to '' or None if you dont want to add a Text Announcement
    """

    class Meta:
        model = TextAnnouncements
        fields = ["id", "details", "duration", "last_modified", "created_at"]


class PrimaryTextAnnouncementSerializer(
    TextAnnouncementSerializer, PrimaryChildAnnouncementSerializerInterface
):
    def validate(self, attrs):
        self.validate_before_save(attrs)

        return super().validate(attrs)

    def create(self, validated_data):
        view = self.context.get("view")
        ann_pk = view.kwargs.get("announcement_pk")
        ann_inst = Announcements.objects.get(id=ann_pk)
        validated_data["announcement"] = ann_inst

        return super().create(validated_data)


# endregion

# region Topic: Image Announcement Serializers


class ImageAnnouncementSerializer(serializers.ModelSerializer):
    file_size = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = ImageAnnouncements
        fields = ["id", "image", "duration", "last_modified", "created_at", "file_size"]

    def get_file_size(self, obj):
        if obj.image and obj.image.size:
            return obj.image.size  # File size in bytes
        return None


class PrimaryImageAnnouncementSerializer(
    ImageAnnouncementSerializer,
    PrimaryChildAnnouncementSerializerInterface,
):
    def validate(self, attrs):
        super().validate(attrs)
        self.validate_before_save(attrs)

        return attrs

    def create(self, validated_data):
        view = self.context.get("view")
        ann_pk = view.kwargs.get("announcement_pk")
        ann_inst = Announcements.objects.get(id=ann_pk)
        validated_data["announcement"] = ann_inst
        return super().create(validated_data)


# endregion

# region Topic: Video Announcement Serializers


class VideoAnnouncementSerializer(serializers.ModelSerializer):
    file_size = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = VideoAnnouncements
        fields = ["id", "video", "duration", "last_modified", "created_at", "file_size"]

    def get_file_size(self, obj):
        if obj.video and obj.video.size:
            return obj.video.size  # File size in bytes
        return None


class PrimaryVideoAnnouncementSerializer(
    VideoAnnouncementSerializer,
    PrimaryChildAnnouncementSerializerInterface,
):
    def validate(self, attrs):
        super().validate(attrs)
        self.validate_before_save(attrs)

        return attrs

    def create(self, validated_data):
        view = self.context.get("view")
        ann_pk = view.kwargs.get("announcement_pk")
        ann_inst = Announcements.objects.get(id=ann_pk)
        validated_data["announcement"] = ann_inst

        return super().create(validated_data)


# endregion

# region Topic: Base Announcement Serializers


class AnnouncementValidationMixin:
    def validate(self, attrs):
        """
        This is to run Custom clean methods for the base announcement and child announcement.

        Why:
            We put it all here because child announcements validate functions will run earlier compared to the parent announcement. And the validate function will raise an error if it sees an error. We want to catch all errors immediately then give it back to the client
        """

        errors = {}
        ann_err = None

        ann_data = {
            "title": attrs["title"],
            "start_date": attrs["start_date"],
            "end_date": attrs["end_date"],
        }

        ann = Announcements(**ann_data)
        # This structure looks like validate_child_announcements, but lets verbosely call it here because we need the Announcement instance
        # validate_child_announcements only gives the None or a dictionary, not the instance
        try:
            ann_err = ann.clean()
        except Exception as e:
            ann_err = e.message_dict

        if ann_err is not None:
            errors = ann_err

        if (
            "text_announcement" in attrs
            and attrs["text_announcement"]["details"] != ""
            and attrs["text_announcement"]["details"] is not None
        ):
            text_ann_errors = self.validate_child_announcements(
                {**attrs["text_announcement"], "announcement": ann}, TextAnnouncements
            )

            if text_ann_errors is not None:
                errors["text_announcement"] = text_ann_errors

        if "image_announcement" in attrs:
            image_ann_errors = self.validate_child_list_announcements(
                attrs["image_announcement"], ann, ImageAnnouncements
            )

            if not all(value == 0 for value in image_ann_errors):
                errors["image_announcement"] = image_ann_errors

        if "video_announcement" in attrs:
            video_ann_errors = self.validate_child_list_announcements(
                attrs["video_announcement"], ann, VideoAnnouncements
            )

            if not all(value == 0 for value in video_ann_errors):
                errors["video_announcement"] = video_ann_errors

        if errors:
            raise serializers.ValidationError(errors)

        return super().validate(attrs)

    def validate_child_list_announcements(
        self,
        child_ann_data_list: List[Dict[str, Any]],
        AnnouncementInstance: Announcements,
        ChildAnnouncementCls: ImageAnnouncements,
    ) -> List[Dict[str, Any]]:
        """
        Validates a list of child announcements.

        Returns:
            A list of dictionaries if validation fails, or a list of zeros if validation passes.
        """
        errors = []

        for child_ann_datum in child_ann_data_list:
            complete_data = {
                **child_ann_datum,
                "announcement": AnnouncementInstance,
            }
            ann = ChildAnnouncementCls(**complete_data)
            try:
                ann.full_clean(exclude=["announcement"])
                errors.append(0)
            except Exception as e:
                errors.append(e.message_dict)

        return errors

    def validate_child_announcements(
        self,
        child_ann_data: Dict[str, Any],
        ChildAnnouncementCls: TextAnnouncements,
    ) -> Optional[Dict[str, Any]]:
        """
        Args:
            child_ann_data contains the data for the ChildAnnouncementCls, including the announcement instance
            ChildAnnouncementCls is the class of the Announcement type

        Returns:
            None or a dictionary of errors
        """

        ann = ChildAnnouncementCls(**child_ann_data)

        try:
            return ann.clean()
        except Exception as e:
            return e.message_dict


class AnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcements
        fields = [
            "title",
            "start_date",
            "end_date",
            "last_modified",
            "created_at",
            "is_active",
        ]


class RetrieveFullAnnouncementSerializer(
    AnnouncementValidationMixin, AnnouncementSerializer
):
    author = UserSerializer(read_only=True)
    text_announcement = TextAnnouncementSerializer()
    image_announcement = ImageAnnouncementSerializer(read_only=True, many=True)
    video_announcement = VideoAnnouncementSerializer(read_only=True, many=True)

    class Meta(AnnouncementSerializer.Meta):
        fields = AnnouncementSerializer.Meta.fields + [
            "author",
            "id",
            "text_announcement",
            "image_announcement",
            "video_announcement",
        ]

    def update(self, instance, validated_data):
        text_ann_data = None
        if "text_announcement" in validated_data:
            text_ann_data = validated_data.pop("text_announcement")

        updated_ann = super().update(instance, validated_data)

        if (
            text_ann_data is not None
            and text_ann_data["details"] is not None
            and text_ann_data["details"] != ""
        ):
            text_ann_inst = TextAnnouncements.objects.get(
                announcement__id=updated_ann.id
            )
            for field, value in text_ann_data.items():
                setattr(text_ann_inst, field, value)

            text_ann_inst.save()

        return updated_ann


class ActivateAnnouncementSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    text_announcement = TextAnnouncementSerializer(read_only=True)
    image_announcement = ImageAnnouncementSerializer(read_only=True, many=True)
    video_announcement = VideoAnnouncementSerializer(read_only=True, many=True)

    class Meta:
        model = Announcements
        fields = [
            "id",
            "title",
            "start_date",
            "end_date",
            "last_modified",
            "created_at",
            "is_active",
            "author",
            "text_announcement",
            "image_announcement",
            "video_announcement",
        ]


class IDDurationFieldSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    duration = serializers.DurationField()

    class Meta:
        fields = ["id", "duration"]


class UpdateFullImageAnnouncementSerializer(
    AnnouncementValidationMixin, AnnouncementSerializer
):
    """
    This serializer will be based on the Base Announcement but will handle the Image Announcement
    """

    author = UserSerializer(read_only=True)
    image_announcement = ImageAnnouncementSerializer(many=True, required=False)
    to_delete = serializers.ListField(write_only=True, required=False)
    to_update = IDDurationFieldSerializer(write_only=True, required=False, many=True)

    class Meta(AnnouncementSerializer.Meta):
        fields = AnnouncementSerializer.Meta.fields + [
            "id",
            "author",
            "image_announcement",
            "to_delete",
            "to_update",
        ]

    def validate_updates(self, data, image_announcements):
        errors = []

        base_ann_data = {
            "title": data["title"],
            "start_date": data["start_date"],
            "end_date": data["end_date"],
        }

        base_ann_inst = Announcements(**base_ann_data)

        for to_update in data["to_update"]:
            inst = ImageAnnouncements.objects.filter(id=to_update["id"])
            if (
                not inst.exists()
                or not image_announcements.filter(id=inst.first().id).exists()
            ):
                errors.append(0)
                continue

            complete_data = {
                **to_update,
                "announcement": base_ann_inst,
            }
            ann = ImageAnnouncements(**complete_data)
            try:
                ann.full_clean(exclude=["announcement", "image", "id"])
                errors.append(0)
            except Exception as e:
                errors.append(e.message_dict)

        return errors

    def update(self, instance, validated_data):
        image_announcements = instance.image_announcement.all()
        if "to_update" in validated_data:
            update_errors = self.validate_updates(validated_data, image_announcements)
            if not all(value == 0 for value in update_errors):
                raise serializers.ValidationError({"to_update": update_errors})

        if "to_delete" in validated_data:
            ids_to_delete = validated_data.pop("to_delete")

            for id in ids_to_delete:
                inst = ImageAnnouncements.objects.filter(id=id)

                if (
                    not inst.exists()
                    or not image_announcements.filter(id=inst.first().id).exists()
                ):
                    continue

                inst.delete()

        if "to_update" in validated_data:
            to_update_list = validated_data.pop("to_update")

            for to_update in to_update_list:
                id, duration = to_update.values()
                inst = ImageAnnouncements.objects.filter(id=id)

                if (
                    not inst.exists()
                    or not image_announcements.filter(id=inst.first().id).exists()
                ):
                    continue

                inst = inst.first()
                inst.duration = duration
                inst.save()

        if "image_announcement" in validated_data:
            image_announcement = validated_data.pop("image_announcement")

            if image_announcement and image_announcement is not None:
                for image_ann_datum in image_announcement:
                    ImageAnnouncements.objects.create(
                        announcement=instance, **image_ann_datum
                    )

        return super().update(instance, validated_data)


class UpdateFullVideoAnnouncementSerializer(
    AnnouncementValidationMixin, AnnouncementSerializer
):
    """
    This serializer will be based on the Base Announcement but will handle the Video Announcement
    """

    author = UserSerializer(read_only=True)
    video_announcement = VideoAnnouncementSerializer(many=True, required=False)
    to_delete = serializers.ListField(write_only=True, required=False)
    to_update = IDDurationFieldSerializer(write_only=True, required=False, many=True)

    class Meta(AnnouncementSerializer.Meta):
        fields = AnnouncementSerializer.Meta.fields + [
            "id",
            "author",
            "video_announcement",
            "to_delete",
            "to_update",
        ]

    def validate_updates(self, data, video_announcements):
        errors = []

        base_ann_data = {
            "title": data["title"],
            "start_date": data["start_date"],
            "end_date": data["end_date"],
        }

        base_ann_inst = Announcements(**base_ann_data)

        for to_update in data["to_update"]:
            inst = VideoAnnouncements.objects.filter(id=to_update["id"])

            if (
                not inst.exists()
                or not video_announcements.filter(id=inst.first().id).exists()
            ):
                errors.append(0)
                continue

            complete_data = {
                **to_update,
                "announcement": base_ann_inst,
            }

            ann = VideoAnnouncements(**complete_data)

            try:
                ann.full_clean(exclude=["announcement", "video", "id"])
                errors.append(0)
            except Exception as e:
                errors.append(e.message_dict)

        return errors

    def update(self, instance, validated_data):
        print(validated_data)
        video_announcements = instance.video_announcement.all()

        if "to_update" in validated_data:
            update_errors = self.validate_updates(validated_data, video_announcements)

            if not all(value == 0 for value in update_errors):
                raise serializers.ValidationError({"to_update": update_errors})

        if "to_delete" in validated_data:
            ids_to_delete = validated_data.pop("to_delete")

            for id in ids_to_delete:
                inst = VideoAnnouncements.objects.filter(id=id)

                if (
                    not inst.exists()
                    or not video_announcements.filter(id=inst.first().id).exists()
                ):
                    continue

                inst.delete()

        if "to_update" in validated_data:
            to_update_list = validated_data.pop("to_update")

            for to_update in to_update_list:
                id, duration = to_update.values()

                inst = VideoAnnouncements.objects.filter(id=id)

                if (
                    not inst.exists()
                    or not video_announcements.filter(id=inst.first().id).exists()
                ):
                    continue

                inst = inst.first()
                inst.duration = duration
                inst.save()

        if "video_announcement" in validated_data:
            video_announcement = validated_data.pop("video_announcement")

            if video_announcement and video_announcement is not None:
                for video_ann_datum in video_announcement:
                    VideoAnnouncements.objects.create(
                        announcement=instance, **video_ann_datum
                    )

        return super().update(instance, validated_data)


class CreateAnnouncementSerializer(
    AnnouncementValidationMixin, serializers.ModelSerializer
):

    text_announcement = TextAnnouncementSerializer(required=False)
    image_announcement = ImageAnnouncementSerializer(required=False, many=True)
    video_announcement = VideoAnnouncementSerializer(required=False, many=True)
    url = serializers.HyperlinkedIdentityField(
        view_name="base-ann-detail", lookup_field="pk"
    )
    author = UserSerializer(read_only=True)

    class Meta:
        model = Announcements
        fields = [
            "id",
            "url",
            "title",
            "author",
            "start_date",
            "end_date",
            "text_announcement",
            "image_announcement",
            "video_announcement",
            "last_modified",
            "created_at",
            "is_active",
        ]

    def to_representation(self, instance):
        user = self.context.get("request").user
        representation = super().to_representation(instance)

        if instance.author != user:
            representation.pop("url", None)

        return representation

    def create(self, validated_data):

        text_ann_data = None
        image_ann_data = None
        video_ann_data = None

        # Remove child data from validated data first
        if "text_announcement" in validated_data:
            text_ann_data = validated_data.pop("text_announcement")

        if "image_announcement" in validated_data:
            image_ann_data = validated_data.pop("image_announcement")

        if "video_announcement" in validated_data:
            video_ann_data = validated_data.pop("video_announcement")

        ann = Announcements.objects.create(**validated_data)
        ann = Announcements.objects.get(id=ann.id)

        if (
            text_ann_data is not None
            and text_ann_data["details"] is not None
            and text_ann_data["details"] != ""
        ):
            TextAnnouncements.objects.create(announcement=ann, **text_ann_data)

        if image_ann_data and image_ann_data is not None:
            for image_ann_datum in image_ann_data:
                ImageAnnouncements.objects.create(announcement=ann, **image_ann_datum)

        if video_ann_data and video_ann_data is not None:
            for video_ann_datum in video_ann_data:
                VideoAnnouncements.objects.create(announcement=ann, **video_ann_datum)

        return ann


# endregion
