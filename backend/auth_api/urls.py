from django.urls import re_path

from .views import LoginView, LogoutView, MeView, RegisterView

urlpatterns = [
    re_path(r"^auth/register/?$", RegisterView.as_view(), name="auth-register"),
    re_path(r"^auth/login/?$", LoginView.as_view(), name="auth-login"),
    re_path(r"^auth/logout/?$", LogoutView.as_view(), name="auth-logout"),
    re_path(r"^auth/me/?$", MeView.as_view(), name="auth-me"),
]
