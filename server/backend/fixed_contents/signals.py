from django.dispatch import receiver
from django.db.models.signals import post_migrate
from django.db.utils import IntegrityError

from .models import FixedContent


@receiver(post_migrate)
def populate_fixed_content(sender, **kwargs):
    """
    Automatically populate fixed contents on migrations
    """

    if not sender.name == "fixed_contents":
        return

    if FixedContent.objects.exists():
        return

    initial_contents = [
        {
            "title": "CpE Department",
            "description": "Display CpE Department Faculty Members",
        },
        {
            "title": "Student Organization",
            "description": "Display CpE Department Student Organization Members",
        },
        {"title": "Calendar", "description": "Display Calendar"},
        {"title": "Weather Forecast", "description": "Display Weather Forecast"},
        {"title": "Facts", "description": "Display MMSU and CpE Facts"},
    ]

    for contents in initial_contents:
        try:
            FixedContent.objects.create(**contents)
        except IntegrityError:
            pass
