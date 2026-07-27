# Pages

## Purpose
This folder contains route-level React screens. Pages compose layouts, services, utilities, and components into user-facing workflows.

## Analogy
Think of pages as rooms in the application: each room assembles the right controls and information for one user task.

## Contents
- `HomePage.jsx` renders the public landing page.
- `LoginPage.jsx` renders the login flow.
- `RegisterPage.jsx` renders account creation.
- `NotFoundPage.jsx` renders the fallback screen for unknown routes.
- `catalog/` contains the product catalog page.
- `details/` contains product and supplier detail pages.
- `requests/` contains request creation and request tracking pages.
- `store/` contains store dashboard and profile pages.
- `supplier/` contains supplier dashboard, profile, and product management pages.

## How It Fits in KERNO
Routes point to these pages. Pages coordinate data loading and user actions, while reusable display pieces remain in `components/`.

## Maintenance Notes
Keep pages focused on workflow composition. Shared UI should move to `components/`, and API calls should go through `services/`.
