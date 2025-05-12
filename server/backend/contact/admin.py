from django.contrib import admin

from .models import ContactUsMessage


class ContactUsMessageAdmin(admin.ModelAdmin):
    list_display = ["name", "email", "is_responded", "responded_by"]


admin.site.register(ContactUsMessage, ContactUsMessageAdmin)
