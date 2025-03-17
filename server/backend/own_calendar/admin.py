from django.contrib import admin

from .models import Calendar


class CalendarAdmin(admin.ModelAdmin):
    list_display = ["id", "title", "start", "end"]


admin.site.register(Calendar, CalendarAdmin)
