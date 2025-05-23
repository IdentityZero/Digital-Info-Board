from django.shortcuts import get_object_or_404
from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError


from .models import Profile, NewUserInvitation


class ProfileSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False)

    class Meta:
        model = Profile
        fields = [
            "id",
            "id_number",
            "role",
            "position",
            "birthdate",
            "image",
            "is_admin",
        ]

    def validate(self, attrs):
        profile = Profile(**attrs)
        profile.clean()
        return attrs


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "password",
            "email",
            "last_name",
            "first_name",
            "profile",
            "is_active",
        ]
        extra_kwargs = {"password": {"write_only": True}}

    def validate_password(self, value):
        try:
            validate_password(value)
        except ValidationError as e:
            raise serializers.ValidationError(e.messages)
        return value

    def create(self, validated_data):
        has_no_user = Profile.objects.count() == 0

        user = User.objects.create_user(
            username=validated_data["username"],
            password=validated_data["password"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            email=validated_data.get("email", None),
        )
        # Sets first user as staff and super user and also an admin
        user.is_staff = has_no_user
        user.is_superuser = has_no_user
        user.save()

        profile_data = validated_data.pop("profile")

        profile = Profile.objects.create(user=user, **profile_data)
        profile.is_admin = has_no_user
        profile.save()

        return user

    def update(self, instance, validated_data):

        profile_data = None
        if "profile" in validated_data:
            profile_data = validated_data.pop("profile")

        for attr, value in validated_data.items():
            if attr == "email":
                continue

            setattr(instance, attr, value)

        if profile_data is not None:
            profile_inst = instance.profile
            for attr, value in profile_data.items():
                old_value = getattr(profile_inst, attr)
                if old_value == value:
                    continue
                setattr(profile_inst, attr, value)

            profile_inst.save()

        instance.save()
        return instance


class AddEmailSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already in use.")
        return value


class VerifyEmailCodeSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(max_length=6)


class SetActiveUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["is_active"]


class ChangePasswordSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)
    old_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ("old_password", "password", "password2")

    def validate(self, attrs):
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."}
            )

        return attrs

    def validate_old_password(self, value):
        pk = self.context["view"].kwargs.get("pk")
        user = get_object_or_404(User, pk=pk)
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is not correct")
        return value

    def update(self, instance, validated_data):

        instance.set_password(validated_data["password"])
        instance.save()

        return instance


class InviteNewUserSerializer(serializers.ModelSerializer):
    inviter = UserSerializer(read_only=True)

    class Meta:
        model = NewUserInvitation
        fields = [
            "id",
            "email",
            "inviter",
            "role",
            "position",
            "is_used",
            "is_email_sent",
        ]
        extra_kwargs = {
            "id": {"read_only": True},
            "is_used": {"read_only": True},
            "is_email_sent": {"read_only": True},
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.context.get("use_minimal"):
            for field in ["inviter", "email"]:
                self.fields.pop(field, None)

    def validate(self, attrs):
        inst = NewUserInvitation(**attrs)
        inst.clean()

        return attrs

    def to_representation(self, instance):
        return super().to_representation(instance)
