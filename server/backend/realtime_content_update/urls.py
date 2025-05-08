from django.urls import path

from .views import preview_display


urlpatterns = [path("preview/", preview_display)]
