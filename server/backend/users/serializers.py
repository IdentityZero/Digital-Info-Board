from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError


from .models import Profile


class ProfileSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False)

    class Meta:
        model = Profile
        fields = ["id_number", "role", "position", "birthdate", "image"]

    def validate(self, attrs):
        profile = Profile(**attrs)
        profile.clean()
        return attrs


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()

    class Meta:
        model = User
        fields = ["id", "username", "password", "last_name", "first_name", "profile"]
        extra_kwargs = {"password": {"write_only": True}}

    def validate_password(self, value):
        try:
            validate_password(value)
        except ValidationError as e:
            raise serializers.ValidationError(e.messages)
        return value

    def create(self, validated_data):

        user = User.objects.create_user(
            username=validated_data["username"],
            password=validated_data["password"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
        )
        # Account is not activated by default
        user.is_active = False
        user.save()
        profile_data = validated_data.pop("profile")

        Profile.objects.create(user=user, **profile_data)
        return user
