from rest_framework.permissions import BasePermission


class IsOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        # Only authenticated users can interact
        if not request.user or not request.user.is_authenticated:
            return False

        # Customer who made the booking
        if request.user == obj.user:
            return True

        # Provider who owns the helper service
        try:
            if request.user == obj.helper_service.user:
                return True
        except Exception:
            pass

        # Staff / Admin users
        if getattr(request.user, 'is_staff', False) or getattr(request.user, 'roll', None) == 'A':
            return True

        return False

