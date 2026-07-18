from pathlib import Path

from .local import *  # noqa: F403

DEBUG = True
ALLOWED_HOSTS = ["localhost", "127.0.0.1", "testserver"]
CORS_ALLOWED_ORIGINS = ["http://localhost:3000", "http://localhost:3001"]
CSRF_TRUSTED_ORIGINS = ["http://localhost:3000", "http://localhost:3001"]
DATABASES = {"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": Path("/tmp/memostyles-e2e.sqlite3")}}
PAYMENT_GATEWAY_TEST_MODE = True
SMS_ENABLED = False
