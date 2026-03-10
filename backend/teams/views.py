from django.contrib.auth import get_user_model
from django.db.models import Q
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Team
from .serializers import AddMemberSerializer, TeamSerializer

User = get_user_model()


class IsTeamCreatorOrReadOnly(permissions.BasePermission):
    """Only the team creator can update or delete the team."""

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.created_by == request.user


class TeamViewSet(viewsets.ModelViewSet):
    serializer_class = TeamSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeamCreatorOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        return Team.objects.filter(
            Q(members=user) | Q(created_by=user)
        ).distinct()

    def perform_create(self, serializer):
        team = serializer.save(created_by=self.request.user)
        team.members.add(self.request.user)

    @action(detail=True, methods=["post"], url_path="add-member")
    def add_member(self, request, pk=None):
        team = self.get_object()
        ser = AddMemberSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        user = User.objects.get(id=ser.validated_data["user_id"])
        team.members.add(user)
        return Response(
            TeamSerializer(team, context={"request": request}).data,
            status=status.HTTP_200_OK,
        )

    @action(detail=True, methods=["post"], url_path="remove-member")
    def remove_member(self, request, pk=None):
        team = self.get_object()
        ser = AddMemberSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        user_id = ser.validated_data["user_id"]
        if user_id == team.created_by_id:
            return Response(
                {"detail": "Cannot remove the team creator."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        team.members.remove(user_id)
        return Response(
            TeamSerializer(team, context={"request": request}).data,
            status=status.HTTP_200_OK,
        )
