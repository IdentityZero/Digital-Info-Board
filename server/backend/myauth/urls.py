from django.urls import path

from .views import (
    TokenObtainPairViewV1,
    delete_cookie_view,
    CookieBasedTokenRefreshViewV1,
)

urlpatterns = [
    path("v1/token/", TokenObtainPairViewV1.as_view()),
    path("v1/token/refresh/", CookieBasedTokenRefreshViewV1.as_view()),
    path("v1/token/refresh/delete", delete_cookie_view),
]
