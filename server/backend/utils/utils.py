import json
from typing import Optional


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
