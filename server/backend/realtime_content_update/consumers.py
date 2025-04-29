import json
from channels.generic.websocket import AsyncWebsocketConsumer


class RelayContentUpdateConsumer(AsyncWebsocketConsumer):
    """
    This consumer will be used to relay updates to connected clients.
    Supported Contents:

    """

    async def connect(self):
        self.room_group_name = "realtime_update"

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

        await self.send(
            text_data=json.dumps(
                {"type": "connection_established", "message": "You are now connected."}
            )
        )

    async def receive(self, text_data=None, bytes_data=None):
        return

    async def send_update(self, event):
        """
        Event content must have this structure
        content and action are mandatory
        content_id and data are optional

            "type": "send.update", # STATIC
            "content": "announcement",
            "action": "update",
            "content_id": instance.pk,
            "data": serializer.data,
        """
        event.pop("type")
        await self.send(text_data=json.dumps(event))

    async def refresh_page(self, event):
        await self.send(
            text_data=json.dumps({"content": "refresh_page", "action": "refresh"})
        )

    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
