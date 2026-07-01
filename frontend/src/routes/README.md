# Routes

## Purpose
This folder defines the frontend routing map for public pages, authenticated shared pages, supplier pages, store pages, and fallbacks.

## Analogy
Think of this folder as the navigation map: it decides which screen appears for each URL.

## Contents
- `AppRoutes.jsx` renders the React Router route tree and connects routes to layouts and pages.
- `routeConfig.js` centralizes route path constants and navigation metadata.

## How It Fits in KERNO
Routes connect the public landing flow, authentication pages, dashboards, catalog, detail pages, request creation, and role-specific request screens.

## Maintenance Notes
Add new routes through the route configuration and keep role protection aligned with `ProtectedRoute` and `RoleRoute`.
