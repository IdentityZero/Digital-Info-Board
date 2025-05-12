from django.urls import path
from .views import (
    CreateContactUsMessageAPIView,
    RetrieveContactUsMessageApiView,
    UpdateRespondedApiView,
)

urlpatterns = [
    path("v1/", CreateContactUsMessageAPIView.as_view()),
    path("v1/<int:pk>/", RetrieveContactUsMessageApiView.as_view()),
    path("v1/<int:pk>/responded", UpdateRespondedApiView.as_view()),
]
