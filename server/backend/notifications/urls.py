from django.urls import path

from .views import NotificationsListAPIView

urlpatterns = [path("v1/", NotificationsListAPIView.as_view())]
