from rest_framework.permissions import SAFE_METHODS, BasePermission


class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view) -> bool:
        if request.method in SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_staff)


class IsOwnerOrAdmin(BasePermission):
    """Allow staff or the user related to an object through common ownership paths."""

    def has_object_permission(self, request, view, obj) -> bool:
        if request.user.is_staff:
            return True
        owner = getattr(obj, "user", None)
        if owner is None and hasattr(obj, "cart"):
            owner = obj.cart.user
        if owner is None and hasattr(obj, "order"):
            owner = obj.order.user
        if owner is None and hasattr(obj, "wishlist"):
            owner = obj.wishlist.user
        return owner == request.user
