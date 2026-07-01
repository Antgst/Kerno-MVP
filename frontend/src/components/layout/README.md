# Layout Helpers

## Purpose
This folder contains route protection helpers used by the routing layer.

## Analogy
Think of this folder as the access gate for frontend routes: it decides whether a user can enter a protected area.

## Contents
- `ProtectedRoute.jsx` protects routes that require an authenticated user.
- `RoleRoute.jsx` protects routes that require a specific user role.

## How It Fits in KERNO
The route tree uses these helpers to separate public pages from authenticated supplier and store workflows.

## Maintenance Notes
Keep route access behavior aligned with backend authorization. Frontend protection improves navigation, while the backend remains responsible for enforcing API access.
