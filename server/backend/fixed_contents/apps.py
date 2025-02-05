from django.apps import AppConfig


class FixedContentsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "fixed_contents"

    def ready(self):
        import fixed_contents.signals
