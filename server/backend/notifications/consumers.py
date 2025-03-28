import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer

from .models import Notifications
from .serializers import NotificationsSerializer


class NotificationsConsumer(WebsocketConsumer):
    """
    WebSocket consumer for handling real-time notifications.

    This consumer allows clients to connect to a WebSocket channel
    and receive notifications in real-time based on a specific user ID.
    """

    def connect(self):

        self.user_id = self.scope["url_route"]["kwargs"]["id"]
        self.room_group_name = f"notification_{self.user_id}"
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )

        self.accept()
        self.send(
            text_data=json.dumps(
                {"type": "connection_established", "message": "You are now connected."}
            )
        )

    def receive(self, text_data=None, bytes_data=None):
        return

    def send_notification(self, event):
        """
        Event content must have this structure
        data is mandatory

            "type": "send.notification", # STATIC
            "data": serializer.data  # notification data

        """
        event.pop("type")
        self.send(text_data=json.dumps(event))

    def disconnect(self, code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )
