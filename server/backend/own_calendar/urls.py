from django.urls import path

from .views import ListCreateCalendarEventApiView, UpdateDeleteCalendarEventApiView

urlpatterns = [
    path("v1/", ListCreateCalendarEventApiView.as_view()),
    path("v1/<int:pk>/", UpdateDeleteCalendarEventApiView.as_view()),
]
