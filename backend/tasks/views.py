"""
Tasks app views.

TaskViewSet — ModelViewSet for Task resources.
  • get_queryset — restricts tasks to teams the requesting user belongs to.
  • Supports query-param filtering: `?team=<id>` and `?assignee=<user_id>`.
  • All endpoints require authentication (enforced globally in settings).
"""
from django.db.models import Q
from rest_framework import permissions, viewsets

from .models import Task
from .permissions import IsTaskTeamMember
from .serializers import TaskSerializer


class TaskViewSet(viewsets.ModelViewSet):
    """CRUD endpoint for tasks.

    Filtering
    ---------
    GET /tasks?team=<team_id>
    GET /tasks?assignee=<user_id>

    Both filters can be combined.
    """

    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsTaskTeamMember]

    # ------------------------------------------------------------------ #
    # Queryset — visible only to team members / creators                  #
    # ------------------------------------------------------------------ #

    def get_queryset(self):
        user = self.request.user
        qs = Task.objects.filter(
            Q(team__members=user) | Q(team__created_by=user)
        ).distinct().select_related("team", "assigned_to")

        team_id = self.request.query_params.get("team")
        assignee_id = self.request.query_params.get("assignee")

        if team_id:
            qs = qs.filter(team_id=team_id)
        if assignee_id:
            qs = qs.filter(assigned_to_id=assignee_id)

        return qs
