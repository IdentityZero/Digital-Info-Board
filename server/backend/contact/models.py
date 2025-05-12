from django.db import models
from django.contrib.auth.models import User

from utils.models import TimestampedModel


# Create your models here.
class ContactUsMessage(TimestampedModel):
    class Meta:
        verbose_name = "Contact Message"
        verbose_name_plural = "Contact Messages"
        ordering = ["-created_at"]

    name = models.CharField(max_length=128, verbose_name="Full Name")
    email = models.EmailField()
    message = models.TextField()
    is_responded = models.BooleanField(default=False)
    responded_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True
    )
    responded_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="Responded At",
    )

    def save(self, *args, **kwargs):
        if self.is_responded and self.responded_at is None:
            from django.utils import timezone

            self.responded_at = timezone.now()
        super().save(*args, **kwargs)
