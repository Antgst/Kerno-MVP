# KERNO — Stage 4 Test Evidence

## Objective

This document records the validation checks used before the Stage 4 manual review.

## Latest validation

Date: 2026-07-01
Branch validated: develop after PR #201 merge

| Check | Command | Result |
|---|---|---|
| Git working tree | git status --short | OK — clean |
| Diff formatting | git diff --check | OK |
| Frontend lint | npm --prefix frontend run lint | OK |
| Frontend production build | npm --prefix frontend run build | OK |
| Backend syntax check | npm --prefix backend run test | OK |

## Important note

The root package does not expose lint or build scripts.

Correct commands:

- npm --prefix frontend run lint
- npm --prefix frontend run build
- npm --prefix backend run test

## Manual MVP test checklist

| Flow | Expected result | Status |
|---|---|---|
| Landing page | Public value proposition visible | OK |
| Register page | Account creation accessible | OK |
| Login page | Authentication accessible | OK |
| Supplier dashboard | Supplier overview visible | OK |
| Supplier profile | Supplier information visible/editable | OK |
| Supplier products | Products visible/manageable | OK |
| Store dashboard | Store sourcing overview visible | OK |
| Store profile | Store information visible/editable | OK |
| Catalog | Products and suppliers searchable | OK |
| Product detail | Product information and request CTA visible | OK |
| Supplier detail | Supplier information and contact CTA visible | OK |
| Request form | Store can prepare a contact or quote request | OK |
| Store requests | Store can review sent requests | OK |
| Supplier requests | Supplier can review received requests | OK |
| Responsive check | Main pages usable on desktop/mobile widths | OK |

## Known MVP exclusions

The MVP excludes payment, basket/cart, full ordering, delivery, invoicing, advanced messaging, advanced analytics and complex subscription management.


## Screenshot evidence

Screenshot run generated on 2026-07-01:

- Folder: `kerno-2026-07-01_21h57m28s`
- Total screenshots: 19
- Public routes captured: landing, login, register
- Supplier routes captured: dashboard, requests, request detail, products, product detail, edit product, new product, profile
- Store routes captured: dashboard, supplier detail, catalog, product detail, requests, request form, request detail, profile
- Redirects to login: 0
- Result: OK for desktop/full-page screenshot validation


## Responsive validation evidence

Responsive validation completed on 2026-07-01.

Validated widths:

- 1440px desktop
- 1280px laptop
- 768px tablet
- 390px mobile
- 360px small mobile

Validated scope:

- public landing page
- login page
- register page
- supplier dashboard
- supplier profile
- supplier products
- supplier requests
- store dashboard
- store profile
- catalog
- request form
- store requests

Result:

- no blocking horizontal overflow detected
- main navigation remains usable
- key cards, forms, buttons, and content remain readable
- responsive validation accepted for Stage 4 review
