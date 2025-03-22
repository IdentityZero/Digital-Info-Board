from django.urls import path

from .views import (
    RetrieveSettingsAPIView,
    RetrieveUpdateSettingsApiView,
)

urlpatterns = [
    path("", RetrieveSettingsAPIView.as_view()),
    path("v1/", RetrieveUpdateSettingsApiView.as_view()),
]
