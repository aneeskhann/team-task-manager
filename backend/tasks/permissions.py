"""
Custom DRF permission classes for the tasks app.
"""
from rest_framework import permissions


class IsTaskTeamMember(permissions.BasePermission):
    """Allow access only if the requesting user belongs to the task's team."""

    def has_object_permission(self, request, view, obj):
        user = request.user
        team = obj.team
        return user == team.created_by or team.members.filter(pk=user.pk).exists()
