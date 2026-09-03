# RNCP5 — Runtime evidence capture

Date: 2026-09-03  
Working branch: `test/rncp5-unit-tests`  
Status: preparation only; not merged into `develop-V2`.

## Purpose

This runbook turns the remaining RNCP frontend proof work into a repeatable Playwright pass. It targets the two interfaces selected for the dossier and oral:

1. Catalogue;
2. Store → supplier request form.

The suite does **not** claim full RGAA compliance. It creates dated runtime evidence for responsive behavior, basic keyboard reachability, field-error semantics and horizontal-overflow checks.

## Prerequisites

The existing KERNO test setup already expects:

- PostgreSQL running locally;
- backend `.env` configured with `PORT=5001`;
- demo or massive seed loaded (`npm run db:seed:demo --prefix backend` or the equivalent backend command);
- backend API reachable at `http://localhost:5001/api/health`;
- demo account `store.001@kerno-demo.local` with password `Password123!`;
- Playwright Chromium installed locally.

The Playwright configuration starts/reuses the Vite frontend automatically on `http://127.0.0.1:5173`.

## Command

From the repository root, with the backend already running:

```bash
npm run test:rncp5-evidence --prefix frontend
```

Optional custom output directory:

```bash
RNCP5_EVIDENCE_DIR="$PWD/rncp5-evidence-$(date +%F)" \
  npm run test:rncp5-evidence --prefix frontend
```

Test source:

```text
frontend/tests/e2e/rncp5-evidence.spec.js
```

## Evidence produced

By default the screenshots are written to:

```text
frontend/test-results/rncp5-evidence/
```

Expected files:

```text
catalog-desktop-1440.png
catalog-mobile-390.png
catalog-mobile-320.png
request-form-desktop-1440.png
request-form-mobile-390.png
request-form-mobile-320.png
request-form-mobile-390-focus-cancel.png
request-form-mobile-390-errors.png
```

## Automated checks

### Catalogue

At 1440 px, 390 px and 320 px:

- protected store login works;
- catalogue loads with seeded products;
- no document-level horizontal overflow is detected;
- a full-page screenshot is captured.

### Request form

At 1440 px, 390 px and 320 px:

- a seeded product/supplier is resolved;
- the request form loads with its context;
- representative quantity and message data are filled;
- no document-level horizontal overflow is detected;
- a full-page screenshot is captured.

### Keyboard reachability

Starting from the subject field, the expected Tab order is checked:

```text
Subject
→ Quantity
→ Message
→ Cancel
→ Submit
```

A 390 px screenshot is taken while the Cancel link is keyboard-focused so the visible focus treatment can be archived.

### Error semantics

For a deterministic error-state capture, the test temporarily disables native HTML validation **inside the Playwright page only** so the React validation can expose all errors at once.

It verifies:

- missing supplier message is visible;
- missing subject message is visible;
- missing message error is visible;
- subject has `aria-invalid="true"`;
- message has `aria-invalid="true"`;
- message points to `message-error` through `aria-describedby`;
- `message-error` has `role="alert"`;
- no horizontal overflow is detected at 390 px.

This does not modify production code.

## Manual checks that still remain required

The automated pass deliberately does **not** replace these manual checks:

1. browser zoom / reflow at 200%;
2. visual inspection of text clipping and component collisions;
3. complete Tab/Shift+Tab journey across the whole page and shell, not only the representative form fields;
4. screen-reader quality / spoken-label review;
5. contrast audit;
6. confirmation that the final screenshots used in the dossier match the exact commit/state presented to the jury.

## Safe wording for the dossier

> Les interfaces Catalogue et Demande ont été vérifiées sur des largeurs desktop, 390 px et 320 px. Une passe Playwright dédiée contrôle notamment l’absence de débordement horizontal au niveau du document, l’accès clavier aux champs/actions représentatifs du formulaire et la sémantique d’erreur. Ces contrôles constituent des preuves ciblées d’accessibilité et de responsive ; ils ne valent pas certification de conformité RGAA complète.

## Before final submission

Re-run the evidence suite on the exact repository state that will be presented, then archive:

- the Playwright result;
- the eight screenshots;
- the commit SHA;
- the date;
- the backend/API seed state used;
- the manual 200% reflow result.

Only after that run should the dossier change the runtime proof status from **prepared** to **verified**.
