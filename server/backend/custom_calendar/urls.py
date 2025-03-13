from django.urls import path

from .views import add_calendar_events

urlpatterns = [path("v1/add/", add_calendar_events)]
