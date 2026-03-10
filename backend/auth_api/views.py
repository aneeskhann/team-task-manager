from django.conf import settings
from django.contrib.auth import login as django_login
from django.contrib.auth import logout as django_logout
from django.middleware.csrf import get_token
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import LoginSerializer, RegisterSerializer, UserSerializer


@method_decorator(ensure_csrf_cookie, name="dispatch")
class CsrfView(APIView):
    """Public endpoint that simply sets the csrftoken cookie.

    The frontend MUST call GET /auth/csrf on every app mount before
    performing any unsafe requests (POST/PUT/DELETE) so Django's CSRF
    middleware always has a valid token to compare against the
    X-CSRFToken header sent by axios.
    """
    permission_classes = [permissions.AllowAny]
    authentication_classes = []  # No auth needed — keep it lightweight

    def get(self, request):
        return Response({"detail": "CSRF cookie set."})


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        # Ensure CSRF cookie is set so the client can immediately POST (e.g. auto-login).
        get_token(request)
        return Response(
            {
                "id": user.id,
                "username": user.get_username(),
                "email": getattr(user, "email", ""),
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]

        django_login(request, user)

        # Ensure CSRF cookie exists for subsequent session-authenticated unsafe requests (e.g. logout).
        get_token(request)

        return Response(
            {
                "id": user.id,
                "username": user.get_username(),
                "email": getattr(user, "email", ""),
            },
            status=status.HTTP_200_OK,
        )


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        django_logout(request)
        response = Response({"detail": "Logged out."}, status=status.HTTP_200_OK)
        response.delete_cookie(settings.SESSION_COOKIE_NAME)
        return response


@method_decorator(ensure_csrf_cookie, name="get")
class MeView(APIView):
    """Returns the current user and always re-issues the CSRF cookie.

    The frontend calls this on mount to check auth status. The
    ensure_csrf_cookie decorator guarantees Django sets the csrftoken
    cookie on every GET, so subsequent unsafe requests (POST/PUT/DELETE)
    always have a valid token even after a hard page refresh.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data, status=status.HTTP_200_OK)
