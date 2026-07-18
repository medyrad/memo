#!/usr/bin/env sh
set -eu
: "${POSTGRES_DB:?POSTGRES_DB is required}" "${POSTGRES_USER:?POSTGRES_USER is required}" "${POSTGRES_HOST:?POSTGRES_HOST is required}"
BACKUP_DIR="${BACKUP_DIR:-./backups}"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
mkdir -p "$BACKUP_DIR"
FILE="$BACKUP_DIR/${POSTGRES_DB}_${STAMP}.dump.gz"
PGPASSWORD="${POSTGRES_PASSWORD:-}" pg_dump -h "$POSTGRES_HOST" -p "${POSTGRES_PORT:-5432}" -U "$POSTGRES_USER" -d "$POSTGRES_DB" --format=custom | gzip > "$FILE"
if [ -n "${BACKUP_S3_URI:-}" ]; then aws s3 cp "$FILE" "$BACKUP_S3_URI/$(basename "$FILE")"; fi
find "$BACKUP_DIR" -type f -name '*.dump.gz' -mtime "+${BACKUP_RETENTION_DAYS:-14}" -delete
echo "$FILE"
