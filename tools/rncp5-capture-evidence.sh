#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
API_HEALTH_URL="${RNCP5_API_HEALTH_URL:-http://localhost:5001/api/health}"
EVIDENCE_DIR="${RNCP5_EVIDENCE_DIR:-$ROOT_DIR/rncp5-evidence-$(date +%F)}"

printf 'RNCP5 evidence capture\n'
printf 'Repository: %s\n' "$ROOT_DIR"
printf 'API health: %s\n' "$API_HEALTH_URL"
printf 'Output: %s\n\n' "$EVIDENCE_DIR"

if ! command -v curl >/dev/null 2>&1; then
  printf 'ERROR: curl is required to verify the backend API.\n' >&2
  exit 1
fi

if ! curl --fail --silent --show-error "$API_HEALTH_URL" >/dev/null; then
  cat >&2 <<EOF
ERROR: KERNO backend API is not reachable at:
  $API_HEALTH_URL

Start PostgreSQL and the backend on port 5001, then make sure a demo seed is loaded.
Useful backend commands from the repository root include:
  npm run db:seed:demo --prefix backend
  npm run dev --prefix backend

The capture suite will start/reuse the Vite frontend automatically.
EOF
  exit 1
fi

mkdir -p "$EVIDENCE_DIR"

cd "$ROOT_DIR"
RNCP5_EVIDENCE_DIR="$EVIDENCE_DIR" \
  npm run test:rncp5-evidence --prefix frontend

cat <<EOF

RNCP5 runtime evidence completed.
Screenshots: $EVIDENCE_DIR

Still perform manually before final submission:
  - browser zoom/reflow at 200%
  - visual clipping/collision review
  - full-page Tab/Shift+Tab review
  - final commit SHA/date archival
EOF
