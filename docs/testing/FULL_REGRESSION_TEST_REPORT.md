# KERNO Full Regression Test Report

## Summary

| Field | Value |
| --- | --- |
| Date | 2026-06-25 |
| Branch | `test/full-regression-suite` |
| Latest commit | `162118f171cd55a1b1d2fd3aeee2aed900871c00` |
| Commit summary | `162118f Merge pull request #185 from Antgst/redim-dashboard` |
| Environment | macOS, local repository at `/Users/antoinegousset/Kerno-MVP-1`, backend regression API at `http://localhost:5001/api`, frontend on Vite port `5173` |
| Final status | READY |

## Commands Executed

| Command | Result |
| --- | --- |
| `git branch --show-current` | PASS: `test/full-regression-suite`. |
| `git status --short` | PASS: showed local changes from this regression setup. |
| `git pull origin develop` | PASS: `Already up to date.` |
| `git checkout -b test/full-regression-suite` | PASS: branch created. |
| `npm install --save-dev @playwright/test` from `frontend` | PASS after network approval; added Playwright test dependency. |
| `node -e "fetch('http://localhost:5001/api/health')..."` | BLOCKED: `fetch failed`. |
| `cd backend && npm test` | PASS. |
| `cd frontend && npm run lint` | PASS after fixing Playwright lint globals. |
| `cd frontend && npm run build` | PASS after fixing a missing CSS closing brace in `frontend/src/styles/16-final-ux-polish.css`. |
| `npx react-doctor@latest --verbose --scope changed` | PASS: no issues found, score 100/100. |
| `npm audit --omit=dev` | PASS: `found 0 vulnerabilities`. |
| `cd backend && npm audit --omit=dev` | WARNING: 3 moderate advisories through Prisma dev tooling. |
| `cd frontend && npm audit --omit=dev` | PASS: `found 0 vulnerabilities`. |
| `cd backend && source .venv/bin/activate && python -m pytest tests/test_kerno_api_comprehensive.py -v` | PASS: final cleanup run `127 passed, 1 warning in 3.07s`. |
| `cd frontend && npx playwright test` | Initial run BLOCKED by missing browser binaries; final cleanup run PASS: `6 passed (12.0s)`. |
| `cd frontend && npx playwright install` | PASS: installed Playwright browser binaries. |
| Cleanup | PASS: ignored and removed generated Playwright report directories; restored frontend source/example API defaults to environment-friendly `localhost:5000` fallbacks. |

## Result Summary

| Area | Result |
| --- | --- |
| Backend syntax checks | PASS |
| Backend/API pytest regression | PASS |
| Frontend lint | PASS |
| Frontend build | PASS |
| React Doctor changed-scope scan | PASS |
| Playwright E2E MVP regression | PASS |
| Root production audit | PASS |
| Backend production audit | WARNING |
| Frontend production audit | PASS |

## Generated Files And Artifacts

Created:

```text
docs/testing/FULL_REGRESSION_TEST_PLAN.md
docs/testing/FULL_REGRESSION_TEST_REPORT.md
frontend/playwright.config.js
frontend/tests/e2e/mvp-regression.spec.js
```

Updated:

```text
backend/tests/RUN_KERNO_PYTESTS.md
backend/tests/conftest.py
backend/tests/results/kerno_api_test_results.json
backend/tests/test_kerno_api_comprehensive.py
docs/testing/TESTING_EVIDENCE.md
frontend/package.json
frontend/package-lock.json
frontend/src/components/catalog/CatalogProductCard.jsx
frontend/src/components/requests/RequestFormFields.jsx
frontend/src/components/requests/StoreRequestCard.jsx
frontend/src/components/requests/SupplierRequestCard.jsx
frontend/src/pages/LoginPage.jsx
frontend/src/pages/catalog/CatalogPage.jsx
frontend/src/pages/details/ProductDetailPage.jsx
frontend/src/pages/requests/RequestFormPage.jsx
frontend/src/pages/requests/StoreRequestsPage.jsx
frontend/src/pages/requests/SupplierRequestsPage.jsx
frontend/src/pages/store/StoreDashboardPage.jsx
frontend/src/pages/supplier/SupplierDashboardPage.jsx
frontend/src/styles/16-final-ux-polish.css
.gitignore
```

Generated local Playwright artifacts are ignored and should not be committed:

```text
frontend/playwright-report/
frontend/test-results/
```

No commit was created. No push was performed.

## Remaining Warnings

* Backend `npm audit --omit=dev` reports 3 moderate advisories via `prisma` -> `@prisma/dev` -> `@hono/node-server`. The suggested `npm audit fix --force` would install `prisma@6.19.3`, a breaking change, so it was not applied.
* Pytest emits `NotOpenSSLWarning` because Python 3.9.6 on this macOS environment is compiled with LibreSSL 2.8.3 while urllib3 v2 prefers OpenSSL 1.1.1+.
* The frontend API URL config remains environment-friendly: `frontend/src/config/api.js` uses `import.meta.env.VITE_API_BASE_URL` first and keeps the original `http://localhost:5000/api` local fallback. `frontend/.env.example` also keeps `http://localhost:5000/api`. The macOS regression session used `http://localhost:5001/api` through Playwright/local environment configuration.

## Final Status

READY
