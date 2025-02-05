from django.contrib import admin

from .models import FixedContent

# Register your models here.


class FixedContentAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "title",
        "description",
        "is_displayed",
        "last_modified",
        "created_at",
    ]

    # def has_add_permission(self, request):
    #     return False

    # def has_delete_permission(self, request, obj=None):
    #     return False


admin.site.register(FixedContent, FixedContentAdmin)
