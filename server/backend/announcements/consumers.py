import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer
from django.utils import timezone

from notifications.utils import create_notification_for_admins
from settings.models import Settings

from .models import Announcements


class LiveAnnouncementConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.room_group_name = "LiveAnnouncement"

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

        await self.send(
            text_data=json.dumps(
                {"type": "connection_established", "message": "You are now connected."}
            )
        )

    async def receive(self, text_data=None, bytes_data=None):
        """
        Text data will receive an array of objects with a structure of:
            {
            "new_position": int,
            "ID": int
            }
        ID - ID of the announcement
        """
        from asgiref.sync import sync_to_async

        data = json.loads(text_data)
        message = data["message"]

        # Update positions (in sync context, wrapped)
        for item in message:
            await sync_to_async(self.update_position)(item)

        # Update announcement_start in settings
        await sync_to_async(self.update_announcement_start)()

        # Send update to group
        await self.channel_layer.group_send(
            self.room_group_name, {"type": "send.live.update", "message": message}
        )

        # Real-time update
        await self.channel_layer.group_send(
            "realtime_update",
            {
                "type": "send.update",
                "content": "announcement",
                "action": "sequence_update",
                "data": message,
            },
        )

        # Notification creation (sync context)
        await sync_to_async(create_notification_for_admins)(
            created_by=None,
            message="Sequence of the contents was updated. Check it out.",
            action="announcement_sequence_update",
            target_id=None,
        )

    async def send_live_update(self, event):
        await self.send(
            text_data=json.dumps({"type": "new_position", "message": event["message"]})
        )

    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    def update_position(self, item):
        obj = Announcements.objects.get(id=item["id"])
        obj.position = item["new_position"]
        obj.save()

    def update_announcement_start(self):
        settings = Settings.get_solo()
        settings.announcement_start = timezone.now()
        settings.save()
