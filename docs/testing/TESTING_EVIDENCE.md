# KERNO Testing Evidence

## Purpose

This document gathers testing evidence for the KERNO MVP technical review. It separates current automated regression evidence from historical Sprint 2 Postman evidence and records blockers honestly.

## Current Automated Session

| Item | Result | Evidence |
| --- | --- | --- |
| Branch | `test/full-regression-suite` | Created from updated `develop`. |
| Base commit | `162118f171cd55a1b1d2fd3aeee2aed900871c00` | `162118f Merge pull request #185 from Antgst/redim-dashboard`. |
| Date | 2026-06-25 | Local session date. |
| Backend API health | PASS | `http://localhost:5001/api/health` returned `{"success":true,"message":"KERNO API is running"}`. |
| Final report | READY | `docs/testing/FULL_REGRESSION_TEST_REPORT.md`. |

The macOS regression session used backend port `5001`. Frontend source code remains environment-friendly: `frontend/src/config/api.js` reads `VITE_API_BASE_URL` first and only keeps the original local fallback of `http://localhost:5000/api`. Playwright injects `VITE_API_BASE_URL=http://localhost:5001/api` for this regression environment.

## Automated Backend/API Regression

Primary test file:

```text
backend/tests/test_kerno_api_comprehensive.py
```

Result artifact path:

```text
backend/tests/results/kerno_api_test_results.json
```

Command:

```bash
cd backend
source .venv/bin/activate
python -m pytest tests/test_kerno_api_comprehensive.py -v
```

Session result: PASS. The final cleanup run completed with `127 passed, 1 warning in 3.07s`.

Coverage intended by the suite:

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
* catalog-readable supplier/product data;
* request creation;
* sent and received requests;
* invalid access, 404, and invalid UUID cases.

Backend syntax command:

```bash
cd backend
npm test
```

Result: PASS. The command ran `node --check src/server.js && node --check src/app.js && node --check src/routes/index.js`.

## Automated Frontend Lint And Build

Lint command:

```bash
cd frontend
npm run lint
```

Result: PASS.

Build command:

```bash
cd frontend
npm run build
```

Result: PASS. Vite built the frontend successfully.

React Doctor command:

```bash
npx react-doctor@latest --verbose --scope changed
```

Result: PASS. No issues found, score 100/100.

## Automated E2E Tests

Primary test files:

```text
frontend/playwright.config.js
frontend/tests/e2e/mvp-regression.spec.js
```

Command:

```bash
cd frontend
npx playwright test
```

Session result: PASS. After installing Playwright browsers with `npx playwright install`, the final cleanup run completed with `6 passed (12.0s)`.

The E2E suite is prepared to cover:

* landing page loads;
* login page loads;
* supplier login reaches supplier dashboard;
* store login reaches store dashboard;
* protected route redirects unauthenticated users;
* wrong-role route redirects;
* catalog access after login;
* seeded product detail access;
* seeded MVP store-to-supplier request flow.

## npm Audit Checks

| Area | Command | Result |
| --- | --- | --- |
| Root | `npm audit --omit=dev` | PASS: `found 0 vulnerabilities`. |
| Backend | `cd backend && npm audit --omit=dev` | WARNING: 3 moderate advisories through `prisma` -> `@prisma/dev` -> `@hono/node-server`. `npm audit fix --force` proposes a breaking change, so no automatic fix was applied. |
| Frontend | `cd frontend && npm audit --omit=dev` | PASS: `found 0 vulnerabilities`. |

## Historical Evidence

Earlier testing evidence remains relevant for review context. The previous evidence document covered a pragmatic MVP validation strategy: backend syntax checks, backend API tests, Postman/manual API validation, frontend build checks, frontend manual route validation, and the full MVP scenario.

Historical backend/API areas documented before this automated session included health, authentication, role-based access, supplier/store profiles, categories, products, catalog access, supplier/product details, contact requests, sent/received requests, request status updates, unauthorized access, and forbidden access.

Historical frontend/manual areas documented before this automated session included landing, login, register, catalog, product detail, supplier detail, supplier dashboard/profile/products/requests, store dashboard/profile/requests, request creation, navigation shell, not-found route, and responsive behavior.

The historical manual MVP scenario was:

1. Start PostgreSQL.
2. Start the backend API.
3. Start the frontend application.
4. Register a supplier account.
5. Create a supplier profile.
6. Create at least one product.
7. Register a store account.
8. Create a store profile.
9. Open the catalog after authentication.
10. Open a product detail page.
11. Open a supplier detail page.
12. Send a structured contact or quote request.
13. Log back as supplier.
14. Open received requests.
15. Open the request detail page.
16. Update the request status.
17. Log back as store.
18. Check sent requests and request detail.

Historical evidence locations:

| Evidence | Location | Purpose |
| --- | --- | --- |
| Backend pytest runner guide | `backend/tests/RUN_KERNO_PYTESTS.md` | Explains how to run backend API tests. |
| Backend API test file | `backend/tests/test_kerno_api_comprehensive.py` | Comprehensive backend API scenarios. |
| Backend test results JSON | `backend/tests/results/kerno_api_test_results.json` | Latest stored backend pytest result output. |
| Sprint 2 Postman collection | `docs/testing/test_postman_S2/kerno_issue_36_postman_collection.json` | Historical Sprint 2 API validation. |
| Sprint 2 Postman screenshots | `docs/testing/test_postman_S2/` | Historical screenshot evidence for API checks. |

Sprint 2 Postman assets remain available here:

```text
docs/testing/test_postman_S2/
```

Collection:

```text
docs/testing/test_postman_S2/kerno_issue_36_postman_collection.json
```

The Postman collection and screenshots are historical S2 evidence. They were not rewritten during this full regression setup. Current API regression should rely on the pytest suite unless the Postman collection is reviewed and updated against the current API contract.

Optional Newman command:

```bash
newman run docs/testing/test_postman_S2/kerno_issue_36_postman_collection.json
```

Known historical limitations before this branch included no full unit coverage for every service, no browser automation tests, no CI pipeline evidence, no load testing, no penetration testing, and no accessibility audit. This branch adds browser automation coverage, but the other limitations remain future production-readiness topics.

## Final Automated Regression Status

READY. Backend syntax, backend/API pytest regression, frontend lint, frontend build, React Doctor, Playwright E2E, and root/frontend production audits passed. Backend production audit remains a warning because Prisma dev-tooling advisories require review before any forced dependency change.
