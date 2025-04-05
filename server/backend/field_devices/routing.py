from django.urls import path

from .consumers import FieldDevicesConsumer

websocket_urlpatterns = [path("api/ws/field-devices/", FieldDevicesConsumer.as_asgi())]
