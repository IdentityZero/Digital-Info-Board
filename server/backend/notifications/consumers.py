import json
from channels.generic.websocket import AsyncWebsocketConsumer


class NotificationsConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for handling real-time notifications.

    This consumer allows clients to connect to a WebSocket channel
    and receive notifications in real-time based on a specific user ID.
    """

    async def connect(self):
        self.user_id = self.scope["url_route"]["kwargs"]["id"]
        self.room_group_name = f"notification_{self.user_id}"

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.accept()

        await self.send(
            text_data=json.dumps(
                {"type": "connection_established", "message": "You are now connected."}
            )
        )

    async def receive(self, text_data=None, bytes_data=None):
        # No handling for incoming messages; override still required
        return

    async def send_notification(self, event):
        """
        Event content must have this structure:
        {
            "type": "send.notification",  # static event handler trigger
            "data": serializer.data       # actual notification data
        }
        """
        event.pop("type")  # remove type before sending
        await self.send(text_data=json.dumps(event))

    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
