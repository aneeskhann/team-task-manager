from rest_framework import viewsets, permissions
from django.db.models import Q
from .models import Task
from .serializers import TaskSerializer

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        queryset = Task.objects.filter(
            Q(team__members=user) | Q(team__created_by=user)
        ).distinct()
        
        team_id = self.request.query_params.get('team')
        assignee_id = self.request.query_params.get('assignee')
        
        if team_id:
            queryset = queryset.filter(team_id=team_id)
        if assignee_id:
            queryset = queryset.filter(assigned_to_id=assignee_id)
            
        return queryset
