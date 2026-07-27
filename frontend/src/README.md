# Frontend Source

## Purpose
This folder contains the main React source code for the KERNO frontend.

## Analogy
Think of this folder as the application floor plan: routes decide where users go, pages define screens, components build the interface, and services handle API communication.

## Contents
- `main.jsx` mounts the React app.
- `App.jsx` delegates rendering to the routing system.
- `App.css` imports and orders application styles.
- `index.css` contains global CSS entry styles.
- `routes/` defines public, authenticated, supplier, and store routes.
- `layouts/` provides public and authenticated page shells.
- `pages/` contains route-level screens.
- `components/` contains reusable UI and feature components.
- `services/` contains frontend API communication and token handling.
- `utils/` contains small reusable frontend helpers.
- `config/` contains runtime configuration such as the API base URL.
- `data/` contains static frontend data used by UI sections.
- `assets/` contains source assets used by the application.

## How It Fits in KERNO
This source layer turns backend data into user-facing workflows for supplier discovery, product browsing, dashboards, profiles, and requests.

## Maintenance Notes
Keep route-level orchestration in pages and reusable rendering logic in components. Avoid placing backend communication directly inside deeply nested UI components.
