# KERNO — Stage 4 Manual Review Checklist

## Objective

This document prepares the technical manual review for the KERNO MVP.

## MVP completion checklist

| Item | Status |
|---|---|
| Functional MVP available | To verify |
| Public landing page available | To verify |
| Registration and login available | To verify |
| Supplier journey available | To verify |
| Store journey available | To verify |
| Product catalog available | To verify |
| Contact or quote request flow available | To verify |
| Supplier received requests available | To verify |
| Store sent requests available | To verify |

## Demo scenario

1. Present KERNO and its MVP scope.
2. Show the landing page.
3. Log in as a supplier.
4. Show supplier dashboard, profile and products.
5. Log in as a store.
6. Show store dashboard.
7. Search the catalog.
8. Open product and supplier detail pages.
9. Send a contact or quote request.
10. Show request tracking on store side.
11. Show received request on supplier side.

## Technical topics to explain

| Topic | What to explain |
|---|---|
| Product goal | KERNO connects local/direct suppliers with retail stores. |
| MVP scope | The MVP validates discovery, supplier visibility and first business contact. |
| Frontend | React, Vite, routing, layouts, reusable components, visual system. |
| Backend | Node.js, Express, modular monolith, controllers, services, routes. |
| Database | PostgreSQL, Prisma, relational schema, migrations and seed data. |
| API | REST API used by the frontend, documented with Swagger/OpenAPI notes. |
| Authentication | Register/login, password hashing, token/session, protected routes. |
| RBAC | Supplier and store roles have different access rights. |
| Security | Password hashing, JWT secret, role checks, no secrets committed. |
| Testing | Frontend lint/build, backend syntax checks, manual MVP flow tests. |
| Git/GitHub | Feature branches, PRs, issues, project board, sprint tracking. |

## Documents to show

| Document | Path |
|---|---|
| Application architecture | docs/architecture/APPLICATION_ARCHITECTURE.md |
| Backend structure | docs/architecture/BACKEND_STRUCTURE.md |
| Frontend structure | docs/architecture/FRONTEND_STRUCTURE.md |
| Database schema | docs/database/DATABASE_SCHEMA.md |
| API summary | docs/api/API_SUMMARY.md |
| Demo scenario | docs/demo/DEMO_SCENARIO.md |
| Test evidence | docs/testing/STAGE4_TEST_EVIDENCE.md |
| Technical review notes | docs/review/TECHNICAL_REVIEW_NOTES.md |

## Final validation command

- git status --short
- git diff --check
- npm --prefix frontend run lint
- npm --prefix frontend run build
- npm --prefix backend run test
