#!/bin/sh
set -eu

echo "Applying database migrations..."
npx prisma migrate deploy

exec "$@"
