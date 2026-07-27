# Request Components

## Purpose
This folder contains reusable components for request creation, request lists, status display, and detail views.

## Analogy
Think of this folder as the request file system: it keeps each inquiry readable, structured, and easy to review.

## Contents
- `RequestFormFields.jsx` renders form fields for creating a request.
- `RequestSummary.jsx` renders request summary information.
- `RequestStatusBadge.jsx` renders request status display.
- `RequestToolbar.jsx` renders request list controls.
- `RequestsPagination.jsx` renders pagination controls for request lists.
- `RequestContextCard.jsx` renders contextual request information.
- `RequestDetailBackLink.jsx` renders request detail navigation.
- `RequestDetailField.jsx` renders labeled request detail values.
- `StoreRequestCard.jsx` renders store-side request cards.
- `SupplierRequestCard.jsx` renders supplier-side request cards.
- `StoreRequestsHeader.jsx` and `SupplierRequestsHeader.jsx` render role-specific request headers.
- `StoreRequestDetailLayout.jsx` and `SupplierRequestDetailLayout.jsx` render role-specific detail layouts.
- `RequestIcon.jsx` renders request-specific icons.

## How It Fits in KERNO
Request pages use these components to support the main contact workflow between stores and suppliers.

## Maintenance Notes
Keep role-specific rendering clear and avoid hiding access rules inside display components. API updates should stay in `services/requestService.js`.
