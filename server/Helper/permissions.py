from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
        Service Provider Only Create
        Service Provider If It Is Owner It Can Update Or Delete
        Service Acquire Only See Also Admin Can Watch Only
    """

    def has_permission(self, request, view):
        if request.user and request.user.is_authenticated and request.user.roll == "SP":
            return True
        return request.method in permissions.SAFE_METHODS

    def has_object_permission(self, request, view, obj):
        if request.method == permissions.SAFE_METHODS:
            return True
        return (
            request.user
            and request.user.is_authenticated
            and request.user.roll == "SP"
            and obj.user == request.user
        )
