from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.utils.timezone import now
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
    TokenRefreshSerializer,
)
from rest_framework_simplejwt.tokens import RefreshToken
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
            token["is_admin"] = user.profile.is_admin
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


class TokenRefreshWithRoleSerializer(TokenRefreshSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        # Decode the refresh token to get the user
        refresh = RefreshToken(attrs["refresh"])
        user_id = refresh["user_id"]

        try:
            user = User.objects.get(id=user_id)
            # Add custom fields to the new access token
            token = RefreshToken.for_user(user)
            token["role"] = user.profile.role
            token["position"] = user.profile.position
            token["username"] = user.username
            token["is_admin"] = user.profile.is_admin
        except User.DoesNotExist:
            raise AuthenticationFailed("User does not exist.", code="user_not_found")
        except Profile.DoesNotExist:
            token["role"] = "unknown"

        # Replace the access token in the response
        data["access"] = str(token.access_token)
        return data
