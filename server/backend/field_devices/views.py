from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_200_OK


@api_view(["POST"])
@permission_classes([AllowAny])
def scd40_sensor_input(request):

    # data
    co2 = request.data.get("co2")
    temperature = request.data.get("temperature")
    humidity = request.data.get("humidity")

    if not co2 or not temperature or not humidity:
        return Response(
            {
                "error": "Incomplete requirements. It must have co2, temperature and humidity"
            },
            status=HTTP_400_BAD_REQUEST,
        )
    try:
        co2 = int(co2)
        temperature = int(temperature)
        humidity = int(humidity)
    except ValueError:
        return Response(
            {"error": "Sensor values must be numbers."},
            status=HTTP_400_BAD_REQUEST,
        )

    sensor_data = {"co2": co2, "temperature": temperature, "humidity": humidity}

    channel_layer = get_channel_layer()

    async_to_sync(channel_layer.group_send)(
        "realtime_update",
        {
            "type": "send.update",
            "content": "sensor",
            "action": "update",
            "data": sensor_data,
        },
    )

    return Response(status=HTTP_200_OK)
