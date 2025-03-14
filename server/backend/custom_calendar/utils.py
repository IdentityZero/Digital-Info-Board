from datetime import datetime, timedelta, timezone
from django.conf import settings

from googleapiclient.discovery import build
from google.oauth2 import service_account

SCOPES = ["https://www.googleapis.com/auth/calendar"]


def dt_local_input_to_utc_str(date: str) -> str:
    """
    :param date from datetime-local inputs ex.
        time_string = "2025-03-14T22:00"
        time_format = "%Y-%m-%dT%H:%M"
    :return: A UTC datetime object.
    """
    time_format = "%Y-%m-%dT%H:%M"
    output_format = "%Y-%m-%dT%H:%M:%SZ"

    local_time = datetime.strptime(date, time_format)

    # Manually set UTC+8 offset (e.g., Manila)
    local_time = local_time.replace(tzinfo=timezone(timedelta(hours=8)))

    # Convert to UTC
    utc_time = local_time.astimezone(timezone.utc)

    return utc_time.strftime(output_format)


def insert_event(
    summary: str,
    start_time: str,
    end_time: str,
    description: str = "",
    location: str = "",
) -> None:
    """Insert an event into Google Calendar."""
    SERVICE_ACCOUNT_FILE = settings.GOOGLE_CALENDAR_CREDENTIALS_LOC
    CALENDAR_ID = settings.GOOGLE_CALENDAR_ID
    TIMEZONE = settings.TIME_ZONE

    creds = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES
    )

    service = build("calendar", "v3", credentials=creds)

    event = {
        "summary": summary,
        "location": location,
        "description": description,
        "start": {
            "dateTime": start_time,
            "timeZone": TIMEZONE,
        },
        "end": {
            "dateTime": end_time,
            "timeZone": TIMEZONE,
        },
    }

    event_result = service.events().insert(calendarId=CALENDAR_ID, body=event).execute()
