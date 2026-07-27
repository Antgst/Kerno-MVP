# Code Audit Report — KERNO MVP

## Context

This audit was performed on branch `test-audit-antoine`, based on `test-knip-antoine`.

The objective was to inspect the codebase without automatically deleting or rewriting code. The audit focused on unused code, duplicate code, unused dependencies, circular dependencies, build health, lint health, backend syntax checks, and npm security alerts.

## Tools Used

- ESLint
- Vite build
- Backend syntax checks
- Knip
- Madge
- Depcheck
- npm audit
- jscpd

## Validation Results

| Check | Result |
|---|---|
| Frontend lint | Passed |
| Frontend build | Passed |
| Backend syntax test | Passed |
| Circular dependency check | Passed — no circular dependency found |
| Root npm audit | Passed — 0 vulnerabilities |
| Frontend npm audit | Passed — 0 vulnerabilities |
| Backend npm audit | Moderate vulnerabilities reported through Prisma development tooling |
| Duplicate code detection | Duplicate areas detected after excluding generated Prisma files and Swagger documentation |

## Dependency Audit Notes

Depcheck reported some unused dependencies, but several are false positives:

- `tailwindcss` is kept because it is part of the Tailwind / Vite frontend setup.
- `@prisma/client` is kept because it is part of the Prisma backend runtime.
- `pg` is kept because it is used with the PostgreSQL Prisma adapter.
- Generated Prisma files are excluded from manual cleanup.

The frontend type packages `@types/react` and `@types/react-dom` were reported as unused. Since the project currently uses JavaScript rather than TypeScript, they may be removable later, but no removal was performed during this audit.

## Security Audit Notes

The backend audit reported moderate vulnerabilities through the Prisma development dependency chain:

- `prisma`
- `@prisma/dev`
- `@hono/node-server`

No forced audit fix was applied because it could introduce breaking dependency changes. This should be handled separately and carefully, not during a broad cleanup pass.

## Duplicate Code Findings

After excluding generated Prisma files and Swagger documentation, duplicate code was mainly detected in these areas:

- Store and supplier profile pages
- Store and supplier requests pages
- Catalog and supplier product listing logic
- Pagination logic
- Shared UI patterns such as Input and Select
- Backend service patterns across modules

## Interpretation

Not all duplication is harmful in this MVP.

Some duplication is acceptable because store and supplier flows are intentionally parallel and must remain easy to understand for manual review.

The most useful future cleanup candidates are:

1. Reuse the existing request pagination component in the catalog page.
2. Extract shared request-list logic between store and supplier request pages.
3. Review common profile-page patterns only after visual validation is complete.
4. Avoid refactoring generated Prisma files, Swagger documentation, or stable backend service patterns unless there is a clear maintainability gain.

## Decision

No automatic cleanup was performed.

The codebase is currently stable enough for MVP review:

- frontend lint passes;
- frontend build passes;
- backend syntax checks pass;
- no circular dependency was found;
- duplicate code exists but is mostly explainable by parallel MVP flows;
- dependency findings require manual review before any removal.

## Recommended Next Step

Perform one small, low-risk refactor only if needed:

- reuse `RequestsPagination.jsx` inside the catalog page;

or keep this audit as documentation evidence and avoid further code changes before manual review.
