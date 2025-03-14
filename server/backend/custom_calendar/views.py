from django.http import JsonResponse
from django.conf import settings

# from django.contrib

from django.utils.datastructures import MultiValueDictKeyError
from google.auth.exceptions import TransportError
from googleapiclient.errors import HttpError

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from utils.permissions import IsAdmin
from .utils import insert_event, dt_local_input_to_utc_str


@api_view(["POST"])
@permission_classes([IsAuthenticated, IsAdmin])
def add_calendar_events(request):
    """
    Add an event to Google Calendar.
    Supports Form Data only

    Time expects this format
    time_string = "2025-03-14T22:00"
    time_format = "%Y-%m-%dT%H:%M"
    """

    if request.method == "GET":
        return JsonResponse(
            {"message": "Only POST requests are allowed", "success": False}, status=405
        )

    print

    data = request.POST

    try:

        event_name = data["event-name"]
        start_time = dt_local_input_to_utc_str(data["start-time"])
        end_time = dt_local_input_to_utc_str(data["end-time"])

        description = data.get("description", "")
        location = data.get("location", "")
        insert_event(event_name, start_time, end_time, description, location)

    except MultiValueDictKeyError:
        return JsonResponse(
            {
                "message": "Event name, start and end time are required. If you think there is an error, contact administrator.",
                "success": False,
            },
            status=400,
        )
    except TransportError:
        return JsonResponse(
            {
                "message": "Server cannot connect to calendar server. Please try again later.",
                "success": False,
            },
            status=504,
        )
    except (ValueError, HttpError) as e:
        return JsonResponse(
            {
                "message": "This is likely an administrative error. Contact admin for calendar credentials.",
                "success": False,
            },
            status=401,
        )

    return JsonResponse(
        {"success": True, "message": "Calendar event created successfully."}, status=201
    )
