import string
import random
from datetime import date, datetime

from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.db import models
from django.utils.timezone import now
from datetime import timedelta

from . import validators
from utils.models import TimestampedModel

ROLE_CHOICES = [
    ("student", "Student"),
    ("faculty", "Faculty"),
]

# Position pattern rules (value1, value2). This is in case of parsing
# value1: all lower case and use underscore (_)
# value2: capitalize and use spaces
STUDENT_POSITIONS = [
    ("president", "President"),
    ("vice_president", "Vice President"),
    ("secretary", "Secretary"),
    ("treasurer", "Treasurer"),
]

FACULTY_POSITIONS = [
    ("department_head", "Department Head"),
    ("organizational_adviser", "Organizational Adviser"),
    ("faculty_staff", "Faculty Staff"),
    ("professor", "Professor"),
]

POSITIONS = STUDENT_POSITIONS + FACULTY_POSITIONS


class Profile(TimestampedModel):

    class Meta:
        verbose_name = "User Profile"
        verbose_name_plural = "User Profiles"

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    id_number = models.CharField(
        max_length=16,
        unique=True,
        validators=[validators.id_number_validator],
        verbose_name="ID Number",
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, verbose_name="Role")
    position = models.CharField(
        max_length=32, choices=POSITIONS, verbose_name="Position"
    )
    birthdate = models.DateField(
        verbose_name="Birthdate", validators=[validators.birthdate_validator]
    )
    image = models.ImageField(
        upload_to="profile_pics", default="profile_pics/profile.png"
    )
    is_admin = models.BooleanField(default=False)

    def clean(self) -> None:
        errors = {}

        positions = STUDENT_POSITIONS if self.role == "student" else FACULTY_POSITIONS
        possible_positions = [position[0] for position in positions]

        if self.position not in possible_positions:
            errors["position"] = (
                f"{self.get_position_display()} is not possible for a {self.get_role_display()} role."
            )

        if errors:
            raise ValidationError(errors)
        else:
            return super().clean()

    @property
    def age(self):
        """Calculate age based on birthdate."""
        today = date.today()
        age = today.year - self.birthdate.year
        # Check if the birthday has occurred this year
        if (today.month, today.day) < (self.birthdate.month, self.birthdate.day):
            age -= 1
        return age


def generate_unique_code(size: int = 6) -> str:
    return "".join(random.choices(string.ascii_letters + string.digits, k=size))


def date_after_7days() -> datetime:
    return now() + timedelta(days=7)


class NewUserInvitation(TimestampedModel):
    class Meta:
        verbose_name = "New User Invitation"
        verbose_name_plural = "New User Invitations"

    code = models.CharField(max_length=6, default=generate_unique_code)
    inviter = models.ForeignKey(User, on_delete=models.CASCADE, related_name="invites")
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, verbose_name="Role")
    position = models.CharField(
        max_length=32, choices=POSITIONS, verbose_name="Position"
    )
    is_used = models.BooleanField(default=False)
    is_email_sent = models.BooleanField(default=False)  # Checks if the email was sent
    expiration_date = models.DateTimeField(default=date_after_7days)

    def clean(self):
        errors = {}

        positions = STUDENT_POSITIONS if self.role == "student" else FACULTY_POSITIONS
        possible_positions = [position[0] for position in positions]

        if self.position not in possible_positions:
            errors["position"] = (
                f"{self.get_position_display()} is not possible for a {self.get_role_display()} role."
            )

        if errors:
            raise ValidationError(errors)
        else:
            return super().clean()

    def save(self, *args, **kwargs):
        while NewUserInvitation.objects.filter(code=self.code).exists():
            self.code = generate_unique_code()
        super().save(*args, **kwargs)
