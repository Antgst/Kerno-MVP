# Request Pages

## Purpose
This folder contains route-level screens for creating, listing, and reviewing contact or quote requests.

## Analogy
Think of this folder as the request workspace: it tracks the conversation starter between stores and suppliers.

## Contents
- `RequestFormPage.jsx` renders the store-side request creation flow.
- `StoreRequestsPage.jsx` renders the store request list.
- `StoreRequestDetailPage.jsx` renders a store-side request detail view.
- `SupplierRequestsPage.jsx` renders the supplier request inbox.
- `SupplierRequestDetailPage.jsx` renders a supplier-side request detail view.

## How It Fits in KERNO
Request pages support the core business action: a store sends a structured request and a supplier reviews it.

## Maintenance Notes
Keep role-specific page behavior explicit. Shared cards, badges, forms, and detail layouts belong in `components/requests/`.

The required-field rules used by `RequestFormPage.jsx` live in `utils/requestFormValidation.js` so the dynamic form behavior can be unit-tested without a browser or API. Run the focused checks with `npm run test:unit --prefix frontend`.
