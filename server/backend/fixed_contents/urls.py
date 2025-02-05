from django.urls import path

from .views import (
    ListActiveFixedContentAPIView,
    RetrieveUpdateFixedContentStatusAPIView,
)

urlpatterns = [
    path("v1/active/", ListActiveFixedContentAPIView.as_view()),
    path("v1/<int:pk>/", RetrieveUpdateFixedContentStatusAPIView.as_view()),
]
