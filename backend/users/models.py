from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Custom user model (kept minimal for now)."""

    # Add future fields here (e.g. avatar, phone, etc.)
    pass
