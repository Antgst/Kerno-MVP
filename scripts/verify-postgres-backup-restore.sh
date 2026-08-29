#!/usr/bin/env bash
set -euo pipefail

# Safety guard: this verification creates a temporary probe table in the source
# database and must only run against a disposable/local/CI database.
if [[ "${ALLOW_BACKUP_RESTORE_PROBE:-}" != "true" ]]; then
  echo "Refusing to run: set ALLOW_BACKUP_RESTORE_PROBE=true on a disposable database." >&2
  exit 2
fi

: "${PG_SOURCE_URL:?PG_SOURCE_URL is required}"
: "${PG_ADMIN_URL:?PG_ADMIN_URL is required}"
: "${PG_RESTORE_URL:?PG_RESTORE_URL is required}"

PG_RESTORE_DB="${PG_RESTORE_DB:-kerno_restore_verify}"
BACKUP_FILE="${BACKUP_FILE:-/tmp/kerno-backup-restore-check.dump}"

if [[ ! "$PG_RESTORE_DB" =~ ^[A-Za-z0-9_]+$ ]]; then
  echo "Invalid PG_RESTORE_DB: only letters, digits and underscores are allowed." >&2
  exit 2
fi

for command_name in psql pg_dump pg_restore; do
  command -v "$command_name" >/dev/null 2>&1 || {
    echo "Missing required command: $command_name" >&2
    exit 2
  }
done

cleanup() {
  psql "$PG_SOURCE_URL" -v ON_ERROR_STOP=1 \
    -c 'DROP TABLE IF EXISTS public.rncp_backup_probe;' >/dev/null 2>&1 || true
  psql "$PG_ADMIN_URL" -v ON_ERROR_STOP=1 \
    -c "DROP DATABASE IF EXISTS \"$PG_RESTORE_DB\" WITH (FORCE);" >/dev/null 2>&1 || true
  rm -f "$BACKUP_FILE"
}
trap cleanup EXIT

printf '%s\n' '[backup-restore] Creating a disposable proof row in the source database...'
psql "$PG_SOURCE_URL" -v ON_ERROR_STOP=1 <<'SQL'
DROP TABLE IF EXISTS public.rncp_backup_probe;
CREATE TABLE public.rncp_backup_probe (
  id integer PRIMARY KEY,
  value text NOT NULL
);
INSERT INTO public.rncp_backup_probe (id, value) VALUES (1, 'backup-ok');
SQL

printf '%s\n' '[backup-restore] Creating a custom-format PostgreSQL dump...'
pg_dump "$PG_SOURCE_URL" \
  --format=custom \
  --no-owner \
  --no-privileges \
  --file="$BACKUP_FILE"

test -s "$BACKUP_FILE"

# Return the source database to its initial state immediately after the dump.
psql "$PG_SOURCE_URL" -v ON_ERROR_STOP=1 \
  -c 'DROP TABLE public.rncp_backup_probe;'

printf '%s\n' '[backup-restore] Recreating an isolated restore database...'
psql "$PG_ADMIN_URL" -v ON_ERROR_STOP=1 \
  -c "DROP DATABASE IF EXISTS \"$PG_RESTORE_DB\" WITH (FORCE);"
psql "$PG_ADMIN_URL" -v ON_ERROR_STOP=1 \
  -c "CREATE DATABASE \"$PG_RESTORE_DB\";"

printf '%s\n' '[backup-restore] Restoring the dump...'
pg_restore \
  --dbname="$PG_RESTORE_URL" \
  --no-owner \
  --no-privileges \
  --exit-on-error \
  "$BACKUP_FILE"

printf '%s\n' '[backup-restore] Verifying restored schema and proof row...'
probe_count="$(psql "$PG_RESTORE_URL" -v ON_ERROR_STOP=1 -Atc \
  "SELECT count(*) FROM public.rncp_backup_probe WHERE id = 1 AND value = 'backup-ok';")"
users_table="$(psql "$PG_RESTORE_URL" -v ON_ERROR_STOP=1 -Atc \
  "SELECT COALESCE(to_regclass('public.users')::text, '');")"

if [[ "$probe_count" != "1" ]]; then
  echo "Restore verification failed: expected proof row was not restored." >&2
  exit 1
fi

if [[ "$users_table" != "users" ]]; then
  echo "Restore verification failed: KERNO users table is missing." >&2
  exit 1
fi

printf '%s\n' '[backup-restore] SUCCESS: dump restored, KERNO schema present, proof row preserved.'
