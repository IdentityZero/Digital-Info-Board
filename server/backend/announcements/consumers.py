import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from django.utils import timezone

from .models import Announcements
from settings.models import Settings


class LiveAnnouncementConsumer(WebsocketConsumer):

    def connect(self):
        self.room_group_name = "LiveAnnouncement"

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
        """
        Text data will receive an array of objects with a structure of:
            {
            "new_position": int,
            "ID": int
            }
        ID - ID of the announcement
        """
        data = json.loads(text_data)
        message = data["message"]

        # Update Positions
        for item in message:
            obj = Announcements.objects.get(id=item["id"])
            obj.position = item["new_position"]
            obj.save()

        # Update announcement_start in settings
        settings = Settings.get_solo()
        settings.announcement_start = timezone.now()
        settings.save()

        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name, {"type": "send.live.update", "message": message}
        )

    def send_live_update(self, event):
        self.send(
            text_data=json.dumps({"type": "new_position", "message": event["message"]})
        )

    def disconnect(self, code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )
