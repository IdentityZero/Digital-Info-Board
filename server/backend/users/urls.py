from django.urls import path, include

from .views import CreateUserView

urlpatterns = [path("v1/create/", CreateUserView.as_view())]
