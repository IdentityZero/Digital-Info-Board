from django.urls import path

from .views import (
    CreateUserView,
    RetrieveUpdateUserView,
    ListInactiveUserView,
    SetActiveUserView,
)

urlpatterns = [
    path("v1/create/", CreateUserView.as_view()),
    path("v1/account/<int:pk>/", RetrieveUpdateUserView.as_view()),
    path("v1/inactive/", ListInactiveUserView.as_view()),
    path("v1/inactive/<int:pk>/", SetActiveUserView.as_view()),
]
