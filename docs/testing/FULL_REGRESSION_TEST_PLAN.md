# KERNO Full Regression Test Plan

## Goal

Provide a repeatable automated regression session for the KERNO MVP technical review. The session verifies backend syntax, backend API behavior, frontend quality gates, frontend build output, Playwright E2E MVP flows, and production dependency audit status.

## Scope

The full regression scope covers:

* backend JavaScript syntax checks;
* backend/API pytest regression against a running Express API;
* frontend ESLint checks;
* frontend Vite production build;
* Playwright browser smoke/regression checks;
* root, backend, and frontend production npm audits;
* documentation of current evidence, blockers, warnings, and artifacts.

## Test Types

| Test type | Command | Purpose |
| --- | --- | --- |
| Backend syntax | `cd backend && npm test` | Checks key backend entry files with `node --check`. |
| Backend/API regression | `cd backend && python -m pytest tests/test_kerno_api_comprehensive.py -v` | Exercises health, auth, roles, profiles, categories, products, catalog data, requests, and error handling through HTTP. |
| Frontend lint | `cd frontend && npm run lint` | Runs ESLint across React, config, and E2E files. |
| Frontend build | `cd frontend && npm run build` | Verifies the Vite application compiles. |
| Playwright E2E | `cd frontend && npx playwright test` | Covers public pages, auth guards, role guards, catalog/product detail, and the seeded store-to-supplier MVP request flow. |
| npm audits | `npm audit --omit=dev`, `cd backend && npm audit --omit=dev`, `cd frontend && npm audit --omit=dev` | Checks production dependency advisories. |

## Environment Requirements

* macOS development machine.
* Node.js and npm installed.
* Python with `pytest` and `requests` available for backend API tests.
* PostgreSQL running locally for Prisma.
* Backend `.env` configured with `PORT=5001`.
* Seeded local database from `node prisma/seed.js`.
* Backend API reachable at `http://localhost:5001/api/health`.
* Frontend API base URL set to `http://localhost:5001/api`.
* Playwright browsers installed locally if `npx playwright test` reports a missing browser executable.

## Commands

From the repository root:

```bash
git status --short
```

```bash
cd backend
npm test
python -m pytest tests/test_kerno_api_comprehensive.py -v
```

```bash
cd ../frontend
npm run lint
npm run build
npx playwright test
```

```bash
cd ..
npm audit --omit=dev
cd backend && npm audit --omit=dev
cd ../frontend && npm audit --omit=dev
```

## Tested MVP Flows

The backend/API regression suite covers:

* health check;
* auth register/login;
* validation errors;
* duplicate email;
* missing and invalid JWT;
* supplier and store roles;
* protected routes;
* supplier profile;
* store profile;
* categories;
* products;
* catalog-readable product and supplier data;
* request creation;
* sent and received requests;
* invalid access, 404, and invalid UUID cases.

The Playwright E2E suite covers:

* landing page loads;
* login page loads;
* supplier login reaches supplier dashboard;
* store login reaches store dashboard;
* protected route redirects unauthenticated users;
* wrong-role route redirects to the correct dashboard;
* catalog is accessible after login;
* a seeded product detail page opens;
* MVP flow as automated browser regression: supplier products visible, store checks catalog, store initiates a request, and supplier received requests include that request through the API verification step.

## Postman/Newman

The Sprint 2 Postman collection remains historical evidence at:

```text
docs/testing/test_postman_S2/kerno_issue_36_postman_collection.json
```

If Newman is installed, it can be checked against the current backend with:

```bash
newman run docs/testing/test_postman_S2/kerno_issue_36_postman_collection.json
```

The collection should be treated as historical S2 evidence unless it is reviewed and confirmed against the current API contract. Current API regression coverage should rely on pytest.

## Out Of Scope

* Manual exploratory testing.
* Browser screenshot evidence.
* Load, stress, or soak testing.
* Cross-browser certification beyond the configured Chromium Playwright project.
* Production deployment validation.
* Automatic dependency upgrades from `npm audit fix --force`.

## Known Limitations

* Backend/API and E2E checks require the backend to be running on port 5001.
* The Playwright MVP flow depends on seeded supplier/store accounts and at least one seeded product linked to a supplier.
* The current E2E suite is an MVP smoke/regression layer, not exhaustive browser coverage.
* Backend audit currently reports Prisma dev-tooling advisories; these should be reviewed separately before forcing dependency changes.
