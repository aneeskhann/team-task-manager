from django.conf import settings
from django.db import models


class Task(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        COMPLETED = "completed", "Completed"

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    team = models.ForeignKey(
        "teams.Team",
        on_delete=models.CASCADE,
        related_name="tasks",
    )
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_tasks",
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.title
