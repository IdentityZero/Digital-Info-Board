from django.core.exceptions import ValidationError
import os


def validate_image_or_video_file(value):
    allowed_extensions = ["jpg", "jpeg", "png", "gif", "mp4", "avi", "mov"]
    extension = os.path.splitext(value.name)[1][1:].lower()
    if extension not in allowed_extensions:
        raise ValidationError(
            f'File type not supported. Allowed types are: {", ".join(allowed_extensions)}.'
        )


def validate_image_file_with_gif(value):
    allowed_extensions = ["jpg", "jpeg", "png", "jfif", "gif"]
    extension = os.path.splitext(value.name)[1][1:].lower()
    if extension not in allowed_extensions:
        raise ValidationError(
            f'File type not supported. Allowed types are: {", ".join(allowed_extensions)}.'
        )


def validate_video_file(value):
    allowed_extensions = ["mp4", "avi", "mov"]
    extension = os.path.splitext(value.name)[1][1:].lower()
    if extension not in allowed_extensions:
        raise ValidationError(
            f'File type not supported. Allowed types are: {", ".join(allowed_extensions)}.'
        )


def validate_file_name_length(value, max_length=95):
    file_name = value.name  # This includes the relative path
    if len(file_name) > max_length:
        raise ValidationError(
            f"File name (including path) must not exceed {max_length} characters. Current length: {len(file_name)}."
        )
