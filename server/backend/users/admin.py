from django.contrib import admin

from .models import Profile, NewUserInvitation


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


class NewUserInvitationAdmin(admin.ModelAdmin):
    list_display = [
        "code",
        "inviter",
        "role",
        "position",
        "is_used",
        "expiration_date",
    ]


admin.site.register(Profile, ProfileAdmin)
admin.site.register(NewUserInvitation, NewUserInvitationAdmin)
