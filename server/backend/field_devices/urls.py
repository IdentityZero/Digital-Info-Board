from django.urls import path

from .views import scd40_sensor_input

urlpatterns = [path("scd40/", scd40_sensor_input)]
