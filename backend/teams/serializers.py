from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Team

User = get_user_model()


class TeamSerializer(serializers.ModelSerializer):
    created_by = serializers.PrimaryKeyRelatedField(read_only=True)
    created_by_username = serializers.CharField(source="created_by.username", read_only=True)
    member_count = serializers.SerializerMethodField()

    class Meta:
        model = Team
        fields = [
            "id",
            "name",
            "created_by",
            "created_by_username",
            "members",
            "member_count",
        ]
        read_only_fields = ["id", "created_by"]

    def get_member_count(self, obj):
        return obj.members.count()

    def validate_name(self, value):
        value = (value or "").strip()
        if not value:
            raise serializers.ValidationError("Team name is required.")
        return value


class AddMemberSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()

    def validate_user_id(self, value):
        if not User.objects.filter(id=value).exists():
            raise serializers.ValidationError("User not found.")
        return value


class InviteSerializer(serializers.Serializer):
    """Validates the payload for the invite-by-email stub action."""

    email = serializers.EmailField()
