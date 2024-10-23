from datetime import date

from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.db import models

from . import validators


class TimestampedModel(models.Model):
    created_at = models.DateTimeField(verbose_name="Created at", auto_now_add=True)
    last_modified = models.DateTimeField(verbose_name="Last modified", auto_now=True)

    class Meta:
        abstract = True


class Profile(TimestampedModel):

    class Meta:
        verbose_name = "User Profile"
        verbose_name_plural = "User Profiles"

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

    def clean(self) -> None:
        errors = {}

        positions = (
            self.STUDENT_POSITIONS if self.role == "student" else self.FACULTY_POSITIONS
        )
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
