from django.urls import path

from .views import (
    CreateUserView,
    RetrieveUpdateUserView,
    add_email,
    verify_email_code,
    reset_password,
    confirm_reset_password,
    ListInactiveUserView,
    SetActiveUserView,
    ListAllUsersView,
    DeleteUserView,
    ChangePasswordView,
    ListCreateUserInvitationView,
    DeleteUserInvitationView,
    resend_invitation_email,
    RetrieveInvitationCodeDetailsView,
)

urlpatterns = [
    path("v1/", ListAllUsersView.as_view()),
    path("v1/create/", CreateUserView.as_view()),
    path("v1/account/email/add/", add_email),
    path("v1/account/email/verify/", verify_email_code),
    path("v1/account/password-reset/", reset_password),
    path("v1/account/password-reset-confirm/<uidb64>/<token>/", confirm_reset_password),
    path("v1/account/<int:pk>/", RetrieveUpdateUserView.as_view()),
    path("v1/account/<int:pk>/change-password/", ChangePasswordView.as_view()),
    path("v1/account/<int:pk>/delete/", DeleteUserView.as_view()),
    path("v1/inactive/", ListInactiveUserView.as_view()),
    path("v1/inactive/<int:pk>/", SetActiveUserView.as_view()),
    path("v1/invite/", ListCreateUserInvitationView.as_view()),
    path("v1/invite/<int:pk>/", DeleteUserInvitationView.as_view()),
    path("v1/invite/resend/<int:pk>/", resend_invitation_email),
    path("v1/invite/code/<str:code>/", RetrieveInvitationCodeDetailsView.as_view()),
]
