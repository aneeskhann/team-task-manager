"""
Teams app views.

TeamViewSet  — full CRUD for Team resources.
  • get_queryset    — only returns teams the requesting user is a member/creator of.
  • perform_create — sets created_by and auto-adds the creator as a member.
  • destroy        — restricted to the team creator via IsTeamCreatorOrReadOnly.
  • add_member     — POST /teams/{id}/add-member  (creator only)
  • remove_member  — POST /teams/{id}/remove-member (creator only)
  • invite         — POST /teams/{id}/invite  (stubbed — no SMTP required)
"""
from django.contrib.auth import get_user_model
from django.db.models import Q
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Team
from .permissions import IsTeamCreatorOrReadOnly
from .serializers import AddMemberSerializer, InviteSerializer, TeamSerializer

User = get_user_model()


class TeamViewSet(viewsets.ModelViewSet):
    """CRUD endpoint for teams.  Members can read; only creators may mutate."""

    serializer_class = TeamSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeamCreatorOrReadOnly]

    # ------------------------------------------------------------------ #
    # Queryset — visible only to members / creator                        #
    # ------------------------------------------------------------------ #

    def get_queryset(self):
        user = self.request.user
        return Team.objects.filter(
            Q(members=user) | Q(created_by=user)
        ).distinct().order_by("name")

    # ------------------------------------------------------------------ #
    # Create — inject creator and auto-add them as a member               #
    # ------------------------------------------------------------------ #

    def perform_create(self, serializer):
        team = serializer.save(created_by=self.request.user)
        team.members.add(self.request.user)

    # ------------------------------------------------------------------ #
    # Custom actions                                                      #
    # ------------------------------------------------------------------ #

    @action(detail=True, methods=["post"], url_path="add-member",
            permission_classes=[permissions.IsAuthenticated])
    def add_member(self, request, pk=None):
        """Add a user to this team.  Requires authenticated access."""
        team = self.get_object()
        serializer = AddMemberSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = User.objects.get(id=serializer.validated_data["user_id"])
        team.members.add(user)
        return Response(
            TeamSerializer(team, context={"request": request}).data,
            status=status.HTTP_200_OK,
        )

    @action(detail=True, methods=["post"], url_path="remove-member",
            permission_classes=[permissions.IsAuthenticated])
    def remove_member(self, request, pk=None):
        """Remove a user from this team.  The creator cannot be removed."""
        team = self.get_object()
        serializer = AddMemberSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user_id = serializer.validated_data["user_id"]
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

    @action(detail=True, methods=["post"], url_path="invite",
            permission_classes=[permissions.IsAuthenticated])
    def invite(self, request, pk=None):
        """Stub: send an email invite to join this team.

        No SMTP is configured — in production this would enqueue a task
        to send an invitation email with a sign-up link.
        """
        team = self.get_object()
        serializer = InviteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]

        # Stubbed: log the invite intent instead of sending real email.
        # In production, call an async task: send_invite_email.delay(team.id, email)
        invite_data = {
            "team": team.name,
            "invited_email": email,
            "invited_by": request.user.username,
            "detail": "Invite recorded. Email delivery is stubbed (no SMTP configured).",
        }
        return Response(invite_data, status=status.HTTP_200_OK)
