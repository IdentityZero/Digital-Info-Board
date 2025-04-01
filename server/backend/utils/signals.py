import os

from typing import Optional, Type
from django.db import models


def delete_old_file(
    sender: Type[models.Model],
    instance: models.Model,
    attr: str,
    default: Optional[str] = None,
) -> None:
    """
    Delete old files of updated objects
    Use on presave signals
    """
    if not instance.pk:
        return

    try:
        old_instance = sender.objects.get(pk=instance.pk)
    except sender.DoesNotExist:
        return

    if not getattr(instance, attr) or (
        getattr(old_instance, attr) == default and default is not None
    ):
        return

    new_file = getattr(instance, attr, None)
    old_file = getattr(old_instance, attr, None)

    if new_file is None or new_file == old_file:
        return

    if old_file and hasattr(old_file, "path") and os.path.isfile(old_file.path):
        os.remove(old_file.path)


def delete_files_of_deleted_objects(
    instance: models.Model,
    attr: str,
    default: Optional[str] = None,
):
    """
    Delete files of deleted objects
    Use of post delete
    """
    if not getattr(instance, attr) or (
        getattr(instance, attr) == default and default is not None
    ):
        return

    file_of_deleted_object = getattr(instance, attr, None)

    if (
        file_of_deleted_object
        and hasattr(file_of_deleted_object, "path")
        and os.path.isfile(file_of_deleted_object.path)
    ):
        os.remove(file_of_deleted_object.path)
