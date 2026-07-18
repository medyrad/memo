FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app/apps/backend

COPY apps/backend/requirements.txt /app/apps/backend/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY apps/backend /app/apps/backend

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/health/live/', timeout=3)"
CMD ["gunicorn", "config.asgi:application", "-c", "gunicorn.conf.py"]
