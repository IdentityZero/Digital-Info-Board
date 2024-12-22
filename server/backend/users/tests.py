from datetime import date

from django.test import TestCase
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

from rest_framework import status
from rest_framework.test import APIClient

from .models import Profile


class ProfileModelTest(TestCase):
    """
    Test Profile Creation
    Test Valid Format ID Number
    Test Role and Position Validation
    Test Birthdate
    Test Image
    """

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        print("########## STARTING PROFILE MODEL TEST ##########")

    @classmethod
    def tearDownClass(cls):
        # Code to clean up your test environment
        super().tearDownClass()
        print("########## END OF PROFILE MODEL TEST ##########")

    def setUp(self):

        self.student_user = User.objects.create_user(
            username="student1", password="Thisisatest123"
        )

        student_profile = Profile.objects.create(
            user=self.student_user,
            id_number="12-121212",
            role="student",
            position="department_head",
            birthdate=date(1995, 5, 15),
        )

        self.faculty_user = User.objects.create_user(
            username="faculty1", password="Thisisatest123"
        )

        self.faculty_profile = Profile.objects.create(
            user=self.faculty_user,
            id_number="12-121213",
            role="faculty",
            position="department_head",
            birthdate=date(1995, 5, 15),
        )

    def test_profile_creation(self):
        """Basic profile creation test"""

        student_profile = Profile.objects.get(user=self.student_user)
        self.assertEqual(student_profile.role, "student")
        self.assertEqual(student_profile.position, "department_head")
        self.assertEqual(student_profile.id_number, "12-121212")
        self.assertEqual(student_profile.birthdate, date(1995, 5, 15))

        faculty_profile = Profile.objects.get(user=self.faculty_user)
        self.assertEqual(faculty_profile.role, "faculty")
        self.assertEqual(faculty_profile.position, "department_head")
        self.assertEqual(faculty_profile.id_number, "12-121213")
        self.assertEqual(faculty_profile.birthdate, date(1995, 5, 15))

        print("Profile Creation Test Successful")

    def test_invalid_id_number(self):

        case1 = Profile(
            user=self.student_user,
            id_number="1232143",
            role="student",
            position="president",
            birthdate=date(1995, 5, 15),
        )

        case2 = Profile(
            user=self.student_user,
            id_number="12-12321123",
            role="student",
            position="president",
            birthdate=date(1995, 5, 15),
        )

        case3 = Profile(
            user=self.student_user,
            id_number="ab-1321ab",
            role="student",
            position="president",
            birthdate=date(1995, 5, 15),
        )

        case4 = Profile(
            user=self.student_user,
            id_number="12-12121a",
            role="student",
            position="president",
            birthdate=date(1995, 5, 15),
        )

        profiles = [case1, case2, case3, case4]

        for profile in profiles:

            with self.assertRaises(ValidationError) as err:
                profile.full_clean()

            self.assertIn(
                f"{profile.id_number} is an invalid ID number pattern. Must be xx-xxxxxx (Numerical values only). (e.g. 12-123456)",
                err.exception.message_dict["id_number"],
            )

        print("Id Number Pattern Test Successful")

    def test_role_compatability(self):

        case1 = Profile(
            user=self.student_user,
            id_number="12-121212",
            role="student",
            position="department_head",
            birthdate=date(1995, 5, 15),
        )
        case2 = Profile(
            user=self.student_user,
            id_number="12-121212",
            role="faculty",
            position="president",
            birthdate=date(1995, 5, 15),
        )

        profiles = [case1, case2]

        for profile in profiles:

            with self.assertRaises(ValidationError) as err:
                profile.full_clean()

            self.assertIn(
                f"{profile.get_position_display()} is not possible for a {profile.get_role_display()} role.",
                err.exception.message_dict["position"],
            )

        print("Role Compatability Test Successful")

    def test_invalid_birthdate(self):
        case1 = Profile(
            user=self.student_user,
            id_number="12-121212",
            role="student",
            position="president",
            birthdate=date(1889, 5, 15),
        )

        with self.assertRaises(ValidationError) as err:
            case1.full_clean()

        self.assertIn(
            "Birthyear must be greater than 1900",
            err.exception.message_dict["birthdate"],
        )

        case2 = Profile(
            user=self.student_user,
            id_number="12-121212",
            role="student",
            position="president",
            birthdate=date(2020, 5, 15),
        )

        with self.assertRaises(ValidationError) as err:
            case2.full_clean()

        self.assertIn(
            "Age must be greater than 16.",
            err.exception.message_dict["birthdate"],
        )

        print("Birthdate Validation Test Successful")

    def test_default_image(self):

        case1 = Profile(
            user=self.student_user,
            id_number="12-121212",
            role="student",
            position="president",
            birthdate=date(2002, 5, 15),
        )

        self.assertEqual(case1.image, "profile_pics/profile.png")

        print("Default Image Test Successful")


class UserCreationViewTest(TestCase):
    """
    Test User with Profile Creation View
    """

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        print("########## STARTING USER CREATION VIEW TEST ##########")

    @classmethod
    def tearDownClass(cls):
        # Code to clean up your test environment
        super().tearDownClass()
        print("########## END OF USER CREATION VIEW TEST ##########")

    def setUp(self):
        self.client = APIClient()
        self.url = "http://127.0.0.1:8000/users/v1/create/"

    def test_user_without_profile(self):
        data = {"username": "test1", "password": "Thisisatest123"}

        res = self.client.post(self.url, data, format="json")
        data = res.json()
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 0)
        self.assertEqual(data["profile"][0], "This field is required.")

        print("User without Profile Test Successful")

    def test_password_validation_runs(self):
        """
        Check the password validators
        """
        case1 = {
            "username": "test1",
            "password": "123123123",
            "profile": {
                "id_number": "12-121213",
                "role": "student",
                "position": "president",
                "birthdate": "2002-12-12",
            },
        }

        case2 = {
            "username": "test1",
            "password": "123abc",
            "profile": {
                "id_number": "12-121213",
                "role": "student",
                "position": "president",
                "birthdate": "2002-12-12",
            },
        }

        case_error_map = [
            {"error": "This password is entirely numeric.", "data": case1},
            {
                "error": "This password is too short. It must contain at least 8 characters.",
                "data": case2,
            },
        ]

        # print(case_error_map)
        for case in case_error_map:

            res = self.client.post(self.url, case["data"], format="json")
            res_data = res.json()
            self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
            self.assertEqual(User.objects.count(), 0)
            self.assertIn(case["error"], res_data["password"])

        print("Password Validation Runs Successful")

    def test_custom_profile_clean_runs(self):
        data = {
            "username": "test1",
            "password": "Thisisatest123",
            "profile": {
                "id_number": "12-121213",
                "role": "faculty",
                "position": "president",
                "birthdate": "2002-12-12",
            },
        }

        res = self.client.post(self.url, data, format="json")
        res_data = res.json()
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 0)
        self.assertEqual(
            res_data["profile"]["position"][0],
            "President is not possible for a Faculty role.",
        )

        print("Custom Profile Cleaning Test Successful")
