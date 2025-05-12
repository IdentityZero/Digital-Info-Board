from rest_framework import serializers

from users.serializers import UserSerializer
from .models import ContactUsMessage


class PrimaryContactUsMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactUsMessage
        fields = "__all__"


class ContactUsMessageWithUserNamesSerializer(PrimaryContactUsMessageSerializer):
    responded_by = UserSerializer(read_only=True)

    class Meta(PrimaryContactUsMessageSerializer.Meta):
        fields = PrimaryContactUsMessageSerializer.Meta.fields
