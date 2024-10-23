from django.contrib import admin

from .models import Profile


class ProfileAdmin(admin.ModelAdmin):
    list_display = [
        "user_id",
        "id_number",
        "user",
        "role",
        "position",
        "age",
        "last_modified",
    ]


admin.site.register(Profile, ProfileAdmin)
