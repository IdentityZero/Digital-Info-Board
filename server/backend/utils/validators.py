from django.core.exceptions import ValidationError


def validate_file_name_length(value, max_length=95):
    file_name = value.name  # This includes the relative path
    if len(file_name) > max_length:
        raise ValidationError(
            f"File name (including path) must not exceed {max_length} characters. Current length: {len(file_name)}."
        )
