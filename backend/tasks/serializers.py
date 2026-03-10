from rest_framework import serializers
from .models import Task
from teams.models import Team


class TaskSerializer(serializers.ModelSerializer):
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
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def validate_team(self, value):
        user = self.context["request"].user
        if user not in value.members.all() and user != value.created_by:
            raise serializers.ValidationError(
                "You must be a member or the creator of this team to add a task."
            )
        return value

    def validate(self, data):
        team = data.get("team")

        # For partial updates, team might not be in data
        if not team and self.instance:
            team = self.instance.team

        assigned_to = data.get("assigned_to")
        if assigned_to and team:
            if assigned_to not in team.members.all() and assigned_to != team.created_by:
                raise serializers.ValidationError(
                    {"assigned_to": "Assigned user must be a member of the team."}
                )

        return data

