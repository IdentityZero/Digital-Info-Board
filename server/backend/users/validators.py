from django.core.exceptions import ValidationError
from datetime import datetime, date

import re


def id_number_validator(value: str) -> None:
    """
    Checks if ID number has the pattern of xx-xxxxxx
    """
    id = re.sub(r"\s+", "", value)
    id_pattern = r"^\d{2}-\d{6}$"  # Pattern for xx-xxxxxx

    if not re.match(id_pattern, id):
        raise ValidationError(
            f"{value} is an invalid ID number pattern. Must be xx-xxxxxx (Number values only). (e.g. 12-123456)"
        )


def birthdate_validator(value: date) -> None:
    today = datetime.today()
    age = today.year - value.year + 1

    if age <= 16:
        raise ValidationError("Age must be greater than 16.")

    if value.year < 1900:
        raise ValidationError("Birthyear must be greater than 1900")
