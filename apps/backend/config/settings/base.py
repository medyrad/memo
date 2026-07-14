import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[3]

SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "dev-only-change-me")
DEBUG = False
ALLOWED_HOSTS: list[str] = []

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "django_filters",
    "drf_spectacular",
    "corsheaders",
    "apps.accounts",
    "apps.catalog",
    "apps.inventory",
    "apps.cart",
    "apps.orders",
    "apps.payments",
    "apps.shipping",
    "apps.discounts",
    "apps.content",
    "apps.reviews",
    "apps.notifications",
    "apps.audit",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv("POSTGRES_DB", "memostyles"),
        "USER": os.getenv("POSTGRES_USER", "memostyles"),
        "PASSWORD": os.getenv("POSTGRES_PASSWORD", "memostyles"),
        "HOST": os.getenv("POSTGRES_HOST", "localhost"),
        "PORT": os.getenv("POSTGRES_PORT", "5432"),
    }
}

LANGUAGE_CODE = "fa-ir"
TIME_ZONE = "Asia/Tehran"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
MEDIA_URL = "media/"
MEDIA_ROOT = BASE_DIR / "media"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
AUTH_USER_MODEL = "accounts.User"

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.SessionAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.AnonRateThrottle",
        "rest_framework.throttling.UserRateThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "anon": os.getenv("DRF_ANON_THROTTLE_RATE", "60/min"),
        "user": os.getenv("DRF_USER_THROTTLE_RATE", "300/min"),
        "auth": os.getenv("DRF_AUTH_THROTTLE_RATE", "10/min"),
        "payment": os.getenv("DRF_PAYMENT_THROTTLE_RATE", "30/min"),
    },
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 20,
}

CORS_ALLOW_CREDENTIALS = True

STOREFRONT_URL = os.getenv("STOREFRONT_URL", "http://localhost:3000")
ZARINPAL_MERCHANT_ID = os.getenv("ZARINPAL_MERCHANT_ID", "")
ZARINPAL_REQUEST_URL = os.getenv("ZARINPAL_REQUEST_URL", "https://api.zarinpal.com/pg/v4/payment/request.json")
ZARINPAL_VERIFY_URL = os.getenv("ZARINPAL_VERIFY_URL", "https://api.zarinpal.com/pg/v4/payment/verify.json")
ZARINPAL_GATEWAY_URL = os.getenv("ZARINPAL_GATEWAY_URL", "https://www.zarinpal.com/pg/StartPay/{authority}")
PAYMENT_CALLBACK_URL = os.getenv("PAYMENT_CALLBACK_URL", "http://localhost:8000/api/payments/callback/")
PAYMENT_AMOUNT_MULTIPLIER = int(os.getenv("PAYMENT_AMOUNT_MULTIPLIER", "10"))
ORDER_PAYMENT_TIMEOUT_MINUTES = int(os.getenv("ORDER_PAYMENT_TIMEOUT_MINUTES", "15"))
STANDARD_SHIPPING_COST = int(os.getenv("STANDARD_SHIPPING_COST", "0"))
EXPRESS_SHIPPING_COST = int(os.getenv("EXPRESS_SHIPPING_COST", "39000"))

SPECTACULAR_SETTINGS = {
    "TITLE": "memostyles API",
    "DESCRIPTION": "Storefront and admin API for memostyles.",
    "VERSION": "0.1.0",
}
