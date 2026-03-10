from django.conf import settings
from django.db import models


class Team(models.Model):
    name = models.CharField(max_length=255)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="created_teams",
    )
    members = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name="teams",
        blank=True,
    )

    def __str__(self) -> str:
        return self.name
