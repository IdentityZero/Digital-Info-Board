from django.urls import re_path

from .consumers import NotificationsConsumer

websocket_urlpatterns = [
    re_path(r"api/ws/notifications/(?P<id>\w+)/$", NotificationsConsumer.as_asgi()),
]
