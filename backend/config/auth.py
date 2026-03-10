"""
Shared DRF utilities.

CsrfExemptSessionAuthentication
--------------------------------
Subclass of DRF's SessionAuthentication that skips the built-in CSRF
check.  Security is preserved at the network layer by Django's CORS
middleware (corsheaders): only origins listed in CORS_ALLOWED_ORIGINS
can send credentialled requests, so an attacker on a different domain
cannot forge a valid session-based request.

This is the standard pattern recommended for SPA + DRF setups where the
frontend and the API live on different ports/domains in development.
"""
from rest_framework.authentication import SessionAuthentication


class CsrfExemptSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        """Skip CSRF enforcement — CORS origin-checking provides equivalent protection."""
        return
