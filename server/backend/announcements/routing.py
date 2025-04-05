from django.urls import path

from .consumers import LiveAnnouncementConsumer

websocket_urlpatterns = [
    path("api/ws/live-announcement/", LiveAnnouncementConsumer.as_asgi())
]
