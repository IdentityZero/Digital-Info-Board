import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer


class RelayContentUpdateConsumer(WebsocketConsumer):
    """
    This consumer will be used to relay updates to connected clients.
    Supported Contents:

    """

    def connect(self):
        self.room_group_name = "realtime_update"

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

    def send_announcement_updated(self, event):
        raise NotImplementedError("This function is not implemented yet")

    def disconnect(self, code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )
