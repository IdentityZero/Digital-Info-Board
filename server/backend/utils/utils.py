import json
import socket
from typing import Optional

from django.http import HttpRequest
from django.conf import settings


def extract_react_quill_text(title: str) -> Optional[str]:
    """
    Extracts plain text from a JSON string formatted by React Quill.

    Parameters:
        title (str): A JSON string containing the formatted text from React Quill.

    Returns:
        str: The extracted plain text without formatting.
        None: If the input is not a valid JSON string.

    Example:
        Input:
        '{"ops": [{"insert": "Hello "}, {"insert": "World!\n"}]}'

        Output:
        'Hello World!'
    """
    if not isinstance(title, str):
        return None

    try:
        json_title = json.loads(title)["ops"]
    except json.JSONDecodeError:
        return None

    extracted_title = "".join(attr["insert"] for attr in json_title)

    return extracted_title.strip()


def get_server_ip():
    try:
        # This connects to an external host and gets the IP used for that connection.
        # Doesn't actually connect, just used to get the correct outbound IP.
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"


def get_mock_request():
    """
    Creates a request instance to give host
    """
    request = HttpRequest()

    request.META["HTTP_HOST"] = "localhost:8000" if settings.DEBUG else get_server_ip()
    return request
