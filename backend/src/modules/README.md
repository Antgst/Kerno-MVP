# Backend Modules

## Purpose
This folder groups backend code by business domain. Each module owns its routes, controller, service, and Swagger documentation when the domain needs them.

## Analogy
Think of modules as departments in one company: each department owns a clear business responsibility, but all operate inside the same Express application.

## Contents
- `auth/` handles registration, login, password verification, JWT creation, and authentication routes.
- `users/` exposes current-user and shared account data operations.
- `suppliers/` manages supplier profiles and supplier discovery.
- `stores/` manages store profiles.
- `products/` manages supplier products, product listing, product details, and product lifecycle actions.
- `categories/` manages product category listing and creation.
- `requests/` manages contact or quote requests between stores and suppliers.
- `health/` exposes a lightweight API health check.

## How It Fits in KERNO
The module layer is the main backend organization model. `routes/index.js` mounts module routes under `/api`, and each module connects HTTP requests to the appropriate business logic.

## Maintenance Notes
Use the existing `*.routes.js`, `*.controller.js`, `*.service.js`, and `*.swagger.js` pattern for new domains. Simple modules can stay lighter when they do not need a service file.
