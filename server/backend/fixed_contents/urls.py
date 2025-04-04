from django.urls import path

from . import views

urlpatterns = [
    path("v1/org-members/", views.ListCreateOrgMembersApiView.as_view()),
    path(
        "v1/org-members/<int:pk>/",
        views.DeleteUpdateOrganizationMembersApiView.as_view(),
    ),
    path("v1/org-members/priority-update/", views.update_org_priority),
    path("v1/upcoming-events/", views.ListCreateUpcomingEventApiView.as_view()),
    path(
        "v1/upcoming-events/<int:pk>/", views.DeleteUpdateUpcomingEventApiView.as_view()
    ),
    path("v1/media-displays/", views.ListCreateMediaDisplaysApiView.as_view()),
    path(
        "v1/media-displays/<int:pk>/", views.DeleteUpdateMediaDisplayApiView.as_view()
    ),
    path("v1/media-displays/priority-update/", views.update_media_displays_priority),
    path("v1/weather-data/", views.get_weather_data),
]
