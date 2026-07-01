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
| Landing page | Public value proposition visible | To verify |
| Register page | Account creation accessible | To verify |
| Login page | Authentication accessible | To verify |
| Supplier dashboard | Supplier overview visible | To verify |
| Supplier profile | Supplier information visible/editable | To verify |
| Supplier products | Products visible/manageable | To verify |
| Store dashboard | Store sourcing overview visible | To verify |
| Store profile | Store information visible/editable | To verify |
| Catalog | Products and suppliers searchable | To verify |
| Product detail | Product information and request CTA visible | To verify |
| Supplier detail | Supplier information and contact CTA visible | To verify |
| Request form | Store can prepare a contact or quote request | To verify |
| Store requests | Store can review sent requests | To verify |
| Supplier requests | Supplier can review received requests | To verify |
| Responsive check | Main pages usable on desktop/mobile widths | To verify |

## Known MVP exclusions

The MVP excludes payment, basket/cart, full ordering, delivery, invoicing, advanced messaging, advanced analytics and complex subscription management.
