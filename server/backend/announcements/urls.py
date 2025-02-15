from django.urls import path

from .views import (
    ListCreateAllAnnouncementAPIView,
    RetrieveUpdateDestroyAnnouncementAPIView,
    ListTextAnnouncementAPIView,
    ListImageAnnouncementAPIView,
    RetrieveUpdateImageAnnouncementAPIView,
    UpdateAnnouncementActiveStatusAPIView,
    ListVideoAnnouncementAPIView,
    RetrieveUpdateVideoAnnouncementAPIView,
    ListAnnouncementAPIViewStatusBased,
)

urlpatterns = [
    path("v1/", ListCreateAllAnnouncementAPIView.as_view()),
    path("v1/status/<str:status>/", ListAnnouncementAPIViewStatusBased.as_view()),
    path(
        "v1/<int:pk>/",
        RetrieveUpdateDestroyAnnouncementAPIView.as_view(),
        name="base-ann-detail",
    ),
    path(
        "v1/<int:pk>/active-status/",
        UpdateAnnouncementActiveStatusAPIView.as_view(),
    ),
    path("v1/text/", ListTextAnnouncementAPIView.as_view()),
    path("v1/image/", ListImageAnnouncementAPIView.as_view()),
    path(
        "v1/<int:pk>/image/",
        RetrieveUpdateImageAnnouncementAPIView.as_view(),
    ),
    path("v1/video/", ListVideoAnnouncementAPIView.as_view()),
    path("v1/<int:pk>/video/", RetrieveUpdateVideoAnnouncementAPIView.as_view()),
]
