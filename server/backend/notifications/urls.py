from django.urls import path

from .views import NotificationsListAPIView, MarkNotificationReadAPIView

urlpatterns = [
    path("v1/", NotificationsListAPIView.as_view()),
    path("v1/status/<int:pk>", MarkNotificationReadAPIView.as_view()),
]
