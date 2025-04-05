from django.urls import path

from .consumers import RelayContentUpdateConsumer

websocket_urlpatterns = [
    path("api/ws/live-content-updates/", RelayContentUpdateConsumer.as_asgi())
]
