from django.http import HttpResponse
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework.permissions import AllowAny


from .serializers import (
    TokenObtainPairWithRoleSerializer,
    TokenRefreshWithRoleSerializer,
)


class TokenObtainPairViewV1(TokenObtainPairView):

    serializer_class = TokenObtainPairWithRoleSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        refresh = serializer.validated_data.pop("refresh")
        response = Response(serializer.validated_data, status=status.HTTP_200_OK)

        # raise NotImplementedError("Read more about this topic")
        response.set_cookie(
            key="token",  # Name of the cookie
            value=refresh,  # Value of the cookie
            max_age=3600,  # Optional: cookie expiry in seconds (1 hour here)
            httponly=True,  # Optional, prevents JS access
            secure=True,  # For HTTPS environments
            samesite=(
                "Lax" if not settings.DEBUG else "None"
            ),  # Adjust as needed, often for cross-site setups
        )

        return response


class CookieBasedTokenRefreshViewV1(TokenRefreshView):
    permission_classes = [AllowAny]
    serializer_class = TokenRefreshWithRoleSerializer

    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get("token")

        if not refresh_token:
            return Response({"detail": "Refresh token not found"}, status=400)

        serializer = self.get_serializer(data={"refresh": refresh_token})
        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            response = Response(
                {"detail": "Invalid refresh token or has expired."},
                status=status.HTTP_401_UNAUTHORIZED,
            )
            response.set_cookie(
                key="token",
                value="",
                max_age=5,
                httponly=True,
                secure=True,
                samesite="Lax" if not settings.DEBUG else "None",
            )
            return response

            # raise InvalidToken(e.args[0])

        return self.create_response(serializer)

    def create_response(self, serializer):
        data = {
            "access": serializer.validated_data["access"],
        }
        return Response(data)


# TODO. DO THIS BETTER
@csrf_exempt
def delete_cookie_view(request):
    # if not settings.DEBUG:
    #     raise NotImplementedError(
    #         "Delete cookie is not good. I dont know why I cant delete the cookie"
    #     )
    response = HttpResponse("Cookie has been deleted!")
    response.set_cookie(
        key="token",
        value="",
        max_age=5,
        httponly=True,
        secure=True,
        samesite="Lax" if not settings.DEBUG else "None",
    )

    return response


def test_view(request):
    response = HttpResponse("This is a test")
    token = request.COOKIES.get("token")

    # Deleting the cookie by name

    return response
