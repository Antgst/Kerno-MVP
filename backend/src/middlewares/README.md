# Middlewares

## Purpose
This folder contains shared Express middleware used across backend routes.

## Analogy
Think of middleware as the checkpoint lane before and after route handlers: it can verify access, format failures, or catch missing routes.

## Contents
- `auth.middleware.js` verifies JWT authentication and provides role-based access helpers.
- `error.middleware.js` centralizes API error responses.
- `notFound.middleware.js` handles requests that do not match a backend route.

## How It Fits in KERNO
Backend modules use these middlewares to keep route protection and error behavior consistent across auth, profiles, products, categories, and requests.

## Maintenance Notes
Keep shared request behavior here when it applies across multiple modules. Module-specific validation or business rules should stay inside the relevant module.
