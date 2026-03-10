from django.contrib import admin

from .models import Team


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "created_by")
    search_fields = ("name",)
    filter_horizontal = ("members",)
