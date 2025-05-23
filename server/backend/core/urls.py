"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("api/admin/", admin.site.urls),
    path("api/auth/", include("myauth.urls")),
    path("api/users/", include("users.urls")),
    path("api/announcements/", include("announcements.urls")),
    path("api/fixed-contents/", include("fixed_contents.urls")),
    path("api/settings/", include("settings.urls")),
    path("api/notifications/", include("notifications.urls")),
    path("api/calendar/", include("own_calendar.urls")),
    path("api/realtime-update/", include("realtime_content_update.urls")),
    path("api/field-devices/", include("field_devices.urls")),
    path("api/contact-us/", include("contact.urls")),
]

if settings.DEBUG:
    # urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
