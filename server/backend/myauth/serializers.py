from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.utils.timezone import now
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed

from users.models import Profile


class TokenObtainPairWithRoleSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        try:
            token["role"] = user.profile.role
            token["position"] = user.profile.position
            token["username"] = user.username
        except Profile.DoesNotExist:
            token["role"] = "unknown"

        return token

    def validate(self, attrs):
        username = attrs.get("username")
        password = attrs.get("password")
        user = User.objects.none()  # Initialize

        # Check if username exists
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise AuthenticationFailed(
                "Incorrect credentials. Please try again.", code="account_not_found"
            )

        # Check if passwords match
        if not user.check_password(password):
            raise AuthenticationFailed(
                "Incorrect credentials. Please try again.", code="account_not_found"
            )

        if not user.is_active:
            raise AuthenticationFailed(
                "Your account is not yet activated. Please contact the administrator to expedite the process",
                code="account_not_active",
            )

        validated = super().validate(attrs)

        return validated
