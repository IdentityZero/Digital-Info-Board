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
        """Handle incoming WebSocket messages."""
        data = json.loads(text_data or "{}")
        message_type = data.get("type")

        handlers = {
            "shutdown_rpi": self.handle_shutdown_rpi,
            "ask_rpi_on": self.handle_ask_rpi_on,
            "rpi_reply_on": self.handle_rpi_reply_on,
        }

        handler = handlers.get(message_type)
        if handler:
            handler()
        else:
            self.send(
                text_data=json.dumps({"error": f"Unknown message type: {message_type}"})
            )

    def handle_shutdown_rpi(self):
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {"type": "send_rpi_notif", "message": "Shutdown RPI"},
        )

    def handle_ask_rpi_on(self):
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {"type": "send_ask_rpi_on", "message": "Is Raspberry Pi on?"},
        )

    def handle_rpi_reply_on(self):
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {"type": "send_reply_rpi_is_on", "message": "The Raspberry Pi is on."},
        )

    def send_rpi_notif(self, event):
        self.send(
            text_data=json.dumps({"type": "shutdown_rpi", "message": event["message"]})
        )

    def send_ask_rpi_on(self, event):
        self.send(
            text_data=json.dumps({"type": "ask_rpi_on", "message": event["message"]})
        )

    def send_reply_rpi_is_on(self, event):
        self.send(
            text_data=json.dumps({"type": "rpi_is_on", "message": event["message"]})
        )

    def disconnect(self, code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )
