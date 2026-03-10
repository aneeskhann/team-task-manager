"""
Custom DRF permission classes for the teams app.
"""
from rest_framework import permissions


class IsTeamCreator(permissions.BasePermission):
    """Allow write access only to the team's creator."""

    def has_object_permission(self, request, view, obj):
        return obj.created_by == request.user


class IsTeamCreatorOrReadOnly(permissions.BasePermission):
    """Read-only for team members; write access only for team creator."""

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.created_by == request.user


class IsTeamMember(permissions.BasePermission):
    """Allow access only if the user is a member or creator of the team."""

    def has_object_permission(self, request, view, obj):
        user = request.user
        return user == obj.created_by or obj.members.filter(pk=user.pk).exists()
