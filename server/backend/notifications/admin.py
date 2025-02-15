from django.contrib import admin

from .models import Notifications


class NotificationsAdmin(admin.ModelAdmin):
    list_display = ["user", "message", "is_read"]


admin.site.register(Notifications, NotificationsAdmin)
