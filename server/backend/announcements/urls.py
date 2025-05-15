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
    ListDeletedAnnouncementAPIView,
    PermanentlyDeleteAnnouncementAPIView,
    RestoreDeletedAnnouncementAPIView,
    ListCreateUrgentAnnouncementAPIView,
    RetrieveDeleteUpdateUrgentAnnouncementAPIView,
    run_urgent,
)

urlpatterns = [
    path("v1/", ListCreateAllAnnouncementAPIView.as_view()),
    path("v1/deleted/<str:type>/", ListDeletedAnnouncementAPIView.as_view()),
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
    # image
    path("v1/image/", ListImageAnnouncementAPIView.as_view()),
    path(
        "v1/<int:pk>/image/",
        RetrieveUpdateImageAnnouncementAPIView.as_view(),
    ),
    # video
    path("v1/video/", ListVideoAnnouncementAPIView.as_view()),
    path("v1/<int:pk>/video/", RetrieveUpdateVideoAnnouncementAPIView.as_view()),
    path(
        "v1/permanently-delete/<int:pk>/",
        PermanentlyDeleteAnnouncementAPIView.as_view(),
    ),
    path("v1/restore/<int:pk>/", RestoreDeletedAnnouncementAPIView.as_view()),
    # urgent
    path("v1/urgent/", ListCreateUrgentAnnouncementAPIView.as_view()),
    path(
        "v1/urgent/<int:pk>/", RetrieveDeleteUpdateUrgentAnnouncementAPIView.as_view()
    ),
    path("v1/urgent/<int:id>/run/", run_urgent),
]
