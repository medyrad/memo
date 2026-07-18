# Deployment runbook

## Staging

1. Copy `.env.example` to `.env.staging` outside version control and set `DOMAIN`, PostgreSQL, Django, API, S3, SMS and Sentry secrets.
2. Provision a valid HTTPS certificate under `/etc/letsencrypt/live/$DOMAIN` and mount it into nginx.
3. Run `docker compose -f infra/docker/docker-compose.staging.yml up -d --build`.
4. Run migrations and seed only after backup: `docker compose -f infra/docker/docker-compose.staging.yml exec backend python manage.py migrate`.
5. Verify `/health/live/` and `/health/ready/`, then run Playwright. Deployment smoke and rollback rehearsal are intentionally handled in the next launch step.

## Backups

Schedule `scripts/backup_postgres.sh` before deploy and daily. Set `BACKUP_S3_URI` for off-host copies and test restoration regularly. A backup is not valid until its restore has been verified.

## Process and monitoring

Backend runs Gunicorn with the external `uvicorn-worker` ASGI worker. Readiness checks PostgreSQL. Set `SENTRY_DSN` for exception/performance monitoring and alert on readiness failures, 5xx rate, payment callback failures and SMS delivery failures.
