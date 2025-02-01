from rest_framework import permissions


class IsAdmin(permissions.BasePermission):
    """
    This permission is based on User Profiles is_admin value
    """

    def has_permission(self, request, view):
        user = request.user
        try:
            is_admin = user.profile.is_admin == True
        except:
            return False

        return user and user.is_authenticated and is_admin
