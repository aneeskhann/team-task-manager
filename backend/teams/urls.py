from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import TeamViewSet

router = DefaultRouter(trailing_slash=False)
router.register(r"teams", TeamViewSet, basename="team")

urlpatterns = [
    path("", include(router.urls)),
]
