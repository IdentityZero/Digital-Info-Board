from rest_framework import serializers

from .models import FixedContent


class FixedContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = FixedContent
        fields = ["id", "title", "description", "is_displayed"]


class IsDisplayedStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = FixedContent
        fields = ["id", "title", "description", "is_displayed"]
        read_only_fields = ["id", "title", "description"]
