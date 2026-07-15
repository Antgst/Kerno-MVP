# KERNO Demo Video V3

This kit records ten independent product-demo scenes from the local KERNO application and prepares them for editing in Microsoft Clipchamp.

It does not modify the frontend, backend, routes, Prisma schema or UI. The capture uses the existing Demo Day seed and accessible Playwright selectors.

## Validated setup

- Capture computer: Windows with WSL
- Local repository: `/home/antgo/projects/Kerno-MVP`
- Frontend: `http://127.0.0.1:5173`
- Backend API: `http://127.0.0.1:5000/api`
- Public landing page: `https://kerno-landing.netlify.app/`
- Supplier account: `supplier1@kerno-demo.local`
- Store account: `store1@kerno-demo.local`
- Password: `Password123!`
- Editing software: Microsoft Clipchamp
- Target duration: 75–90 seconds

## Recorded scenes

1. Landing page
2. Supplier login
3. Supplier dashboard
4. Product creation
5. Product published
6. Store login
7. Catalogue search
8. Product detail
9. Contact request
10. Request received by the supplier

Each scene is saved separately as a 1920 × 1080 WebM file.

## Before the first run

Place the validated transparent PNG logo here:

```text
scripts/demoday-video/assets/kerno-logo.png
```

The capture itself can run without this file. The logo is used for the Clipchamp introduction, supplier/store transition and final screen. When the PNG is absent, the runner copies the current repository logo as a fallback and adds a warning in the exported branding folder.

## Run from Windows PowerShell

Open PowerShell. VS Code does not need to be open.

```powershell
wsl -d Ubuntu bash -lc "cd /home/antgo/projects/Kerno-MVP && git fetch origin && git switch video-demo-v3-antoine && git pull --ff-only origin video-demo-v3-antoine"

wsl -d Ubuntu bash -lc "cd /home/antgo/projects/Kerno-MVP && chmod +x scripts/demoday-video/run-video.sh"

powershell -ExecutionPolicy Bypass -File "\\wsl.localhost\Ubuntu\home\antgo\projects\Kerno-MVP\scripts\demoday-video\run-video.ps1"
```

If the WSL distribution is not named `Ubuntu`, replace it in the commands.

The first run can:

- request the WSL sudo password to start PostgreSQL;
- install missing npm dependencies;
- install the Playwright Chromium browser;
- take longer than subsequent captures.

## Visible browser mode

The default capture runs Chromium headlessly for greater stability. To display Chromium through WSLg while recording:

```powershell
powershell -ExecutionPolicy Bypass -File "\\wsl.localhost\Ubuntu\home\antgo\projects\Kerno-MVP\scripts\demoday-video\run-video.ps1" -Headed
```

The generated video contains only the website viewport and the custom KERNO cursor. PowerShell, WSL and VS Code are not recorded.

## Output

The raw scene files remain in WSL:

```text
scripts/demoday-video/output/
```

They are also copied to Windows:

```text
C:\Users\antgo\Videos\KERNO\Kerno-Demo-V3\
├── clips\
├── branding\
└── CLIPCHAMP-TIMELINE.md
```

The older tracked file `output/kerno-demoday-demo.webm` is not deleted or overwritten. The runner removes only files matching the new `00-scene-name.webm` convention.

## Deterministic local data

Before recording, the runner:

1. starts PostgreSQL;
2. generates the Prisma client;
3. applies existing migrations;
4. executes `backend/prisma/seed-demo.js`;
5. starts the existing frontend and backend when they are not already running.

The V3 product created during the scenario is:

```text
Jus pétillant de pomme
```

The store then searches for this product and sends a request that appears in the supplier space.

## Capture behaviour

The helper adds:

- a visible orange cursor;
- curved mouse movements;
- short pauses before clicks;
- a click pulse;
- character-by-character typing;
- smooth scrolling;
- stable 1920 × 1080 recordings;
- independent scene files for easier retakes.

## Clipchamp

Follow [`CLIPCHAMP-TIMELINE.md`](./CLIPCHAMP-TIMELINE.md) for:

- clip order;
- target timestamps;
- English editorial text;
- zoom and crop values;
- speed changes;
- music volume;
- final review checks.

## Troubleshooting

### Only one service is already running

Stop the partial frontend or backend process and launch the PowerShell script again. The runner deliberately refuses to start a second conflicting process.

### Backend or frontend does not start

Read:

```text
scripts/demoday-video/.runtime/kerno-dev.log
```

### PostgreSQL error

From WSL:

```bash
sudo service postgresql start
```

Then rerun the PowerShell command.

### Repeat only one scene during development

From WSL, after the application and database are ready:

```bash
KERNO_FRONTEND_URL=http://127.0.0.1:5173 \
KERNO_API_BASE_URL=http://127.0.0.1:5000/api \
node frontend/node_modules/@playwright/test/cli.js test \
  --config scripts/demoday-video/playwright.config.cjs \
  --grep "07 - catalog search"
```

For the complete commercial story, run all scenes in order because product creation and request creation are intentionally sequential.
