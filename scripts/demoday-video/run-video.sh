#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
VIDEO_DIR="$PROJECT_ROOT/scripts/demoday-video"
OUTPUT_DIR="$VIDEO_DIR/output"
RUNTIME_DIR="$VIDEO_DIR/.runtime"
EXPORT_DIR="${KERNO_VIDEO_EXPORT_DIR:-}"
FRONTEND_URL="${KERNO_FRONTEND_URL:-http://127.0.0.1:5173}"
API_BASE_URL="${KERNO_API_BASE_URL:-http://127.0.0.1:5001/api}"
HEALTH_URL="$API_BASE_URL/health"
DEV_PID=""

log() {
  printf '\n[KERNO VIDEO] %s\n' "$1"
}

cleanup() {
  if [[ -n "$DEV_PID" ]] && kill -0 "$DEV_PID" 2>/dev/null; then
    log "Stopping the local KERNO processes started by this script."
    kill -TERM -- "-$DEV_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT INT TERM

wait_for_url() {
  local url="$1"
  local label="$2"
  local attempts="${3:-60}"

  for ((index = 1; index <= attempts; index += 1)); do
    if curl --silent --fail --max-time 2 "$url" >/dev/null 2>&1; then
      printf '[KERNO VIDEO] %s is ready.\n' "$label"
      return 0
    fi
    sleep 1
  done

  printf '[KERNO VIDEO] %s did not become ready: %s\n' "$label" "$url" >&2
  return 1
}

cd "$PROJECT_ROOT"
mkdir -p "$OUTPUT_DIR" "$RUNTIME_DIR"

log "Checking the local repository."
if [[ ! -f package.json || ! -f frontend/package.json || ! -f backend/package.json ]]; then
  echo "Run this script from the Kerno-MVP repository." >&2
  exit 1
fi

log "Starting PostgreSQL with Docker Compose."
if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is not available in WSL. Start Docker Desktop and enable WSL integration for Ubuntu-20.04." >&2
  exit 1
fi

if ! docker info >/dev/null 2>&1; then
  echo "Docker Desktop is not running or WSL integration is unavailable." >&2
  exit 1
fi

docker compose up -d postgres

for ((index = 1; index <= 45; index += 1)); do
  if docker compose exec -T postgres pg_isready -U kerno_user -d kerno_db >/dev/null 2>&1; then
    printf '[KERNO VIDEO] PostgreSQL is ready.\n'
    break
  fi

  if [[ "$index" -eq 45 ]]; then
    echo "PostgreSQL did not become ready. Run: docker compose logs postgres" >&2
    exit 1
  fi

  sleep 1
done

log "Installing missing dependencies."
[[ -d node_modules ]] || npm ci
[[ -d backend/node_modules ]] || npm --prefix backend ci
[[ -d frontend/node_modules ]] || npm --prefix frontend ci

log "Preparing the database with the deterministic Demo Day seed."
(
  cd backend
  npx prisma generate
  npx prisma migrate deploy
  npm run db:seed
)

FRONTEND_READY=0
API_READY=0
curl --silent --fail --max-time 2 "$FRONTEND_URL" >/dev/null 2>&1 && FRONTEND_READY=1 || true
curl --silent --fail --max-time 2 "$HEALTH_URL" >/dev/null 2>&1 && API_READY=1 || true

if [[ "$FRONTEND_READY" -ne "$API_READY" ]]; then
  cat >&2 <<EOF
Only one KERNO service is currently running.
Stop the partial frontend/backend process, then launch this script again.
Frontend ready: $FRONTEND_READY
API ready: $API_READY
EOF
  exit 1
fi

if [[ "$FRONTEND_READY" -eq 0 ]]; then
  log "Starting KERNO locally without opening VS Code."
  setsid npm run dev >"$RUNTIME_DIR/kerno-dev.log" 2>&1 &
  DEV_PID=$!
  wait_for_url "$HEALTH_URL" "Backend API" 90
  wait_for_url "$FRONTEND_URL" "Frontend" 90
else
  log "Existing local frontend and backend detected; reusing them."
fi

log "Checking the capture scripts."
node --check scripts/demoday-video/capture/helpers.cjs
node --check scripts/demoday-video/capture/kerno-product-demo.spec.cjs
node --check scripts/demoday-video/playwright.config.cjs

log "Installing Chromium for Playwright when required."
(
  cd frontend
  npx playwright install chromium
)

log "Removing only previous V3 scene files."
find "$OUTPUT_DIR" -maxdepth 1 -type f -name '[0-9][0-9]-*.webm' -delete
rm -rf "$VIDEO_DIR/.tmp" "$VIDEO_DIR/.test-results"

log "Recording the ten independent KERNO scenes."
KERNO_FRONTEND_URL="$FRONTEND_URL" \
KERNO_API_BASE_URL="$API_BASE_URL" \
KERNO_LANDING_URL="${KERNO_LANDING_URL:-https://kerno-landing.netlify.app/}" \
node frontend/node_modules/@playwright/test/cli.js test \
  --config scripts/demoday-video/playwright.config.cjs

log "Capture completed."
find "$OUTPUT_DIR" -maxdepth 1 -type f -name '[0-9][0-9]-*.webm' -printf '  %f\n' | sort

if [[ -n "$EXPORT_DIR" ]]; then
  log "Copying the Clipchamp kit to the Windows video folder."
  mkdir -p "$EXPORT_DIR/clips" "$EXPORT_DIR/branding"
  find "$OUTPUT_DIR" -maxdepth 1 -type f -name '[0-9][0-9]-*.webm' -exec cp -f {} "$EXPORT_DIR/clips/" \;
  cp -f "$VIDEO_DIR/CLIPCHAMP-TIMELINE.md" "$EXPORT_DIR/"

  if [[ -f "$VIDEO_DIR/assets/kerno-logo.png" ]]; then
    cp -f "$VIDEO_DIR/assets/kerno-logo.png" "$EXPORT_DIR/branding/"
  else
    cp -f "$PROJECT_ROOT/frontend/src/assets/brand/kerno-logo.webp" "$EXPORT_DIR/branding/kerno-logo-fallback.webp"
    printf '%s\n' \
      "The validated PNG was not found in scripts/demoday-video/assets/." \
      "The current repository logo was copied as a fallback." \
      >"$EXPORT_DIR/branding/README.txt"
  fi

  printf '[KERNO VIDEO] Exported to: %s\n' "$EXPORT_DIR"
fi
