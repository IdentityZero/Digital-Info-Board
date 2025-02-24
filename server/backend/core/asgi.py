"""
ASGI config for backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import announcements.routing
import field_devices.routing
import notifications.routing

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")


application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": URLRouter(
            announcements.routing.websocket_urlpatterns
            + field_devices.routing.websocket_urlpatterns
            + notifications.routing.websocket_urlpatterns
        ),
    }
)
