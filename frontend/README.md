# Frontend

## Purpose
This folder contains the React and Vite application for KERNO. It renders public pages, authenticated dashboards, catalogs, request screens, and shared UI.

## Analogy
Think of this folder as the customer-facing workspace: it presents the product and coordinates user actions with the backend.

## Contents
- `src/` contains the frontend source code.
- `tests/` contains frontend end-to-end tests.
- `public/` contains static assets served by Vite.
- `package.json` and `package-lock.json` define frontend scripts and dependencies.
- `vite.config.js` configures the Vite build.
- `playwright.config.js` configures frontend end-to-end testing.
- `eslint.config.js` configures frontend linting.
- The environment sample file documents frontend variables.

## How It Fits in KERNO
The frontend communicates with the Express API through the service layer, displays marketplace data, and enforces navigation structure for public, supplier, and store experiences.

## Maintenance Notes
Keep API calls in `src/services/`, route definitions in `src/routes/`, and reusable visual pieces in `src/components/`.
