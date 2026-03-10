"""
Tasks app serializers.

TaskSerializer  — full read/write serializer for Task model.
  • team_name / assigned_to_username  — read-only display fields for the frontend.
  • validate_team     — user must be a member or creator of the target team.
  • validate          — the assignee (if set) must belong to the same team.
"""
from rest_framework import serializers

from .models import Task


class TaskSerializer(serializers.ModelSerializer):
    # Read-only display helpers for the frontend (avoids extra round-trips)
    team_name = serializers.CharField(source="team.name", read_only=True)
    assigned_to_username = serializers.CharField(
        source="assigned_to.username", read_only=True, default=None
    )

    class Meta:
        model = Task
        fields = [
            "id",
            "title",
            "description",
            "team",
            "team_name",
            "assigned_to",
            "assigned_to_username",
            "status",
            "due_date",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    # ------------------------------------------------------------------ #
    # Field-level validation                                              #
    # ------------------------------------------------------------------ #

    def validate_team(self, value):
        """Enforce that the requesting user belongs to the target team."""
        user = self.context["request"].user
        if user != value.created_by and not value.members.filter(pk=user.pk).exists():
            raise serializers.ValidationError(
                "You must be a member or the creator of this team."
            )
        return value

    # ------------------------------------------------------------------ #
    # Object-level validation                                             #
    # ------------------------------------------------------------------ #

    def validate(self, data):
        """Ensure the assignee (if provided) is a member of the task's team."""
        team = data.get("team") or (self.instance.team if self.instance else None)
        assigned_to = data.get("assigned_to")

        if assigned_to and team:
            is_creator = assigned_to == team.created_by
            is_member = team.members.filter(pk=assigned_to.pk).exists()
            if not (is_creator or is_member):
                raise serializers.ValidationError(
                    {"assigned_to": "Assigned user must be a member of the team."}
                )

        return data
