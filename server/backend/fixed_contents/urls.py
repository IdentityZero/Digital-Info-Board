from django.urls import path

from . import views

urlpatterns = [
    path("v1/org-members/", views.ListCreateOrgMembersApiView.as_view()),
    path("v1/org-members/<int:pk>/", views.DeleteOrganizationMembersApiView.as_view()),
    path("v1/upcoming-events/", views.ListCreateUpcomingEventApiView.as_view()),
    path("v1/upcoming-events/<int:pk>/", views.DeleteUpcomingEventApiView.as_view()),
    path("v1/media-displays/", views.ListCreateMediaDisplaysApiView.as_view()),
    path("v1/media-displays/<int:pk>/", views.DeleteMediaDisplayApiView.as_view()),
]
