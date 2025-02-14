from django.urls import path

from .views import RetrieveSettingsAPIView

urlpatterns = [path("", RetrieveSettingsAPIView.as_view())]
