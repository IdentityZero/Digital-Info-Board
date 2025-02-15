import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer


class FieldDevicesConsumer(WebsocketConsumer):
    def connect(self):
        self.room_group_name = "FieldDevices"

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
        data = json.loads(text_data)

        if data["type"] == "shutdown_rpi":

            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {"type": "send.rpi.notif", "message": "shutdown_rpi"},
            )

    def send_rpi_notif(self, event):
        self.send(
            text_data=json.dumps({"type": "shutdown_rpi", "message": "Shutdown RPI"})
        )

    def disconnect(self, code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )
