import json
from channels.generic.websocket import AsyncWebsocketConsumer


class FieldDevicesConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_group_name = "FieldDevices"

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.accept()

        await self.send(
            text_data=json.dumps(
                {"type": "connection_established", "message": "You are now connected."}
            )
        )

    async def receive(self, text_data=None, bytes_data=None):
        """Handle incoming WebSocket messages."""
        data = json.loads(text_data or "{}")
        message_type = data.get("type")

        handlers = {
            "shutdown_rpi": self.handle_shutdown_rpi,
            "ask_rpi_on": self.handle_ask_rpi_on,
            "rpi_reply_on": self.handle_rpi_reply_on,
            "restart_rpi": self.handle_restart_rpi,
            "refresh_rpi": self.handle_refresh_rpi,
        }

        handler = handlers.get(message_type)
        if handler:
            await handler()
        else:
            await self.send(
                text_data=json.dumps({"error": f"Unknown message type: {message_type}"})
            )

    async def handle_shutdown_rpi(self):
        await self.channel_layer.group_send(
            self.room_group_name,
            {"type": "send_rpi_notif", "message": "Shutdown RPI"},
        )

    async def handle_ask_rpi_on(self):
        await self.channel_layer.group_send(
            self.room_group_name,
            {"type": "send_ask_rpi_on", "message": "Is Raspberry Pi on?"},
        )

    async def send_rpi_notif(self, event):
        await self.send(
            text_data=json.dumps({"type": "shutdown_rpi", "message": event["message"]})
        )

    async def handle_rpi_reply_on(self):
        await self.channel_layer.group_send(
            self.room_group_name,
            {"type": "send_reply_rpi_is_on", "message": "The Raspberry Pi is on."},
        )

    async def send_ask_rpi_on(self, event):
        await self.send(
            text_data=json.dumps({"type": "ask_rpi_on", "message": event["message"]})
        )

    async def send_reply_rpi_is_on(self, event):
        await self.send(
            text_data=json.dumps({"type": "rpi_is_on", "message": event["message"]})
        )

    async def handle_restart_rpi(self):
        await self.channel_layer.group_send(
            self.room_group_name,
            {"type": "send_restart_rpi", "message": "Restart RPI"},
        )

    async def send_restart_rpi(self, event):
        await self.send(
            text_data=json.dumps({"type": "restart_rpi", "message": event["message"]})
        )

    async def handle_refresh_rpi(self):
        await self.channel_layer.group_send(
            "realtime_update",
            {"type": "refresh_page", "message": "Refresh Kiosk"},
        )

    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
