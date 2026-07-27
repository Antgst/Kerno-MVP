# KERNO — Stage 4 Sprint Plan

## Objective

This document summarizes the sprint organization used to move KERNO from technical design to a functional MVP ready for manual review.

## Sprint duration

Each sprint is planned as a short iteration of approximately one week.

## Team responsibilities

| Member | Main responsibility |
|---|---|
| Antoine Gousset | Frontend, UI/UX, documentation, visual QA, demo preparation |
| Gwendal Boisard | Backend/API, database, Prisma, API validation |
| Yonas Houriez | Integration, GitHub workflow, testing support, review support |

## Sprint overview

| Sprint | Focus | GitHub reference |
|---|---|---|
| S1 | Project foundation, repository structure, first setup | https://github.com/Antgst/Kerno-MVP/issues/68 |
| S2 | Backend API, Prisma schema, authentication, core models | https://github.com/Antgst/Kerno-MVP/issues/69 |
| S3 | Frontend MVP screens, dashboards, catalog and request flows | https://github.com/Antgst/Kerno-MVP/issues/70 |
| S4 | Integration, UI harmonization, QA, bug fixes, documentation | https://github.com/Antgst/Kerno-MVP/issues/71 |
| S5 | Final review preparation, demo, test evidence, readiness | https://github.com/Antgst/Kerno-MVP/issues/72 |

## Must Have tasks

- Repository and Git workflow ready.
- Backend modules implemented: auth, users, suppliers, stores, products, categories, requests.
- Prisma schema, migrations and seed data available.
- Frontend MVP pages available.
- Supplier and store journeys available.
- Contact or quote request flow available.
- Documentation and test evidence prepared.
- Manual review checklist ready.

## Should Have tasks

- Visual consistency across public and authenticated pages.
- Responsive checks on main screens.
- Screenshots for visual evidence.
- Sprint reviews and retrospectives documented.

## Won't Have for MVP

The MVP intentionally excludes payment, cart, full ordering, delivery, invoicing, advanced messaging, advanced analytics and complex subscription management.
