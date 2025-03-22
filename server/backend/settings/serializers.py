from rest_framework import serializers

from .models import Settings


class SettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Settings
        fields = ["announcement_start"]


# V2


class ListSettingsSerializer(serializers.ModelSerializer):
    announcement_start = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Settings
        fields = "__all__"

    def to_internal_value(self, data):
        """
        Prevents overwriting fields with null unless explicitly allowed.
        """
        for field, value in data.items():
            if value is None:
                raise serializers.ValidationError(
                    {field: "This field cannot be set to null."}
                )
        return super().to_internal_value(data)
