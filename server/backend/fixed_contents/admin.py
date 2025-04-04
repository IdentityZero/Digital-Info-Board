from django.contrib import admin

from .models import OrganizationMembers, UpcomingEvents, MediaDisplays


class OrganizationMembersAdmin(admin.ModelAdmin):
    list_display = ["id", "name", "position", "priority", "last_modified"]


admin.site.register(OrganizationMembers, OrganizationMembersAdmin)


class UpcomingEventsAdmin(admin.ModelAdmin):
    list_display = ["id", "name", "date"]


admin.site.register(UpcomingEvents, UpcomingEventsAdmin)


class MediaDisplaysAdmin(admin.ModelAdmin):
    list_display = ["id", "name", "priority", "file"]


admin.site.register(MediaDisplays, MediaDisplaysAdmin)
