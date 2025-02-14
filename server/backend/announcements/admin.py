from django.contrib import admin

from .models import (
    Announcements,
    TextAnnouncements,
    ImageAnnouncements,
    VideoAnnouncements,
)


class AnnouncementAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "position",
        "author",
        "title",
        "start_date",
        "end_date",
        "is_active",
        "created_at",
        "last_modified",
    ]


admin.site.register(Announcements, AnnouncementAdmin)


class TextAnnouncementAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "announcement",
        "details",
        "duration",
        "created_at",
        "last_modified",
    ]


admin.site.register(TextAnnouncements, TextAnnouncementAdmin)


class ImageAnnouncementAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "announcement",
        "image",
        "duration",
        "created_at",
        "last_modified",
    ]


admin.site.register(ImageAnnouncements, ImageAnnouncementAdmin)


class VideoAnnouncementAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "announcement",
        "video",
        "duration",
        "created_at",
        "last_modified",
    ]


admin.site.register(VideoAnnouncements, VideoAnnouncementAdmin)
