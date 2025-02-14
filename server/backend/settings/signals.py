from django.dispatch import receiver
from django.db.models.signals import post_migrate
from django.db.utils import IntegrityError

from .models import Settings


@receiver(post_migrate)
def populate_settings(sender, **kwargs):
    if not sender.name == "fixed_contents":
        return

    if Settings.objects.exists():
        return

    initial_values = {}  # Set initial values if it does not contain a default

    Settings.objects.create(**initial_values)
