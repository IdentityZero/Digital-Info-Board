from django.urls import path

from .views import (
    CreateUserView,
    RetrieveUpdateUserView,
    ListInactiveUserView,
    SetActiveUserView,
    ListAllUsersView,
    DeleteUserView,
    ChangePasswordView,
)

urlpatterns = [
    path("v1/", ListAllUsersView.as_view()),
    path("v1/create/", CreateUserView.as_view()),
    path("v1/account/<int:pk>/", RetrieveUpdateUserView.as_view()),
    path("v1/account/<int:pk>/change-password/", ChangePasswordView.as_view()),
    path("v1/account/<int:pk>/delete/", DeleteUserView.as_view()),
    path("v1/inactive/", ListInactiveUserView.as_view()),
    path("v1/inactive/<int:pk>/", SetActiveUserView.as_view()),
]
