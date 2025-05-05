"""
Script to set current time of raspberry pi since NTP is failing.
"""

import os
import requests
from datetime import datetime

URL = "https://www.timeapi.io/api/time/current/zone?timeZone=Asia%2FManila"


def get_pst_time() -> str:
    response = requests.get(URL)
    response.raise_for_status()
    data = response.json()

    timestamp = data["dateTime"]

    timestamp_fixed = timestamp[:26]
    dt = datetime.fromisoformat(timestamp_fixed)

    formatted_time = dt.strftime("%Y-%m-%d %H:%M:%S")

    return formatted_time


def set_date_time(date_time: str) -> None:
    if os.name == "nt":
        pass
        # os.system("shutdown /s /t 1")
    elif os.name == "posix":
        os.system(f"sudo date -s {date_time}")


if __name__ == "__main__":
    current_date_time = get_pst_time()
    set_date_time(current_date_time)
