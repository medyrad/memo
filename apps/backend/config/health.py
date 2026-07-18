from django.db import connection
from django.http import JsonResponse


def live(_request):
    return JsonResponse({"status": "ok"})


def ready(_request):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            cursor.fetchone()
    except Exception:
        return JsonResponse({"status": "unavailable", "database": "down"}, status=503)
    return JsonResponse({"status": "ok", "database": "up"})
