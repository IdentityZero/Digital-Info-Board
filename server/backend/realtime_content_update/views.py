from asgiref.sync import async_to_sync

from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND
from rest_framework.permissions import IsAuthenticated

from channels.layers import get_channel_layer


from utils.permissions import IsAdmin
from utils.utils import get_mock_request

from announcements.models import Announcements
from announcements.serializers import RetrieveFullAnnouncementSerializer


@api_view(["POST"])
@permission_classes([IsAuthenticated, IsAdmin])
def preview_display(request):
    """
    Accepts an ID then relays preview to the Display Screen.
    """

    id = request.data.get("id")

    if not id:
        return Response({"error": "ID is required."}, status=HTTP_400_BAD_REQUEST)

    try:
        inst = Announcements.objects.get(id=id)
    except Announcements.DoesNotExist:
        return Response(
            {"error": "The content you are trying to preview cannot be found."},
            status=HTTP_404_NOT_FOUND,
        )

    request = get_mock_request()
    serializer = RetrieveFullAnnouncementSerializer(inst, context={"request": request})

    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        "realtime_update",
        {
            "type": "send.update",
            "content": "announcement",
            "action": "preview",
            "content_id": inst.pk,
            "data": serializer.data,
        },
    )

    return Response(status=HTTP_200_OK)
