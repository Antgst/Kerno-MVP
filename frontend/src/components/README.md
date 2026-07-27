# Components

## Purpose
This folder contains reusable React components used by pages and layouts.

## Analogy
Think of components as building blocks: pages assemble them into complete workflows without redefining the same UI each time.

## Contents
- `Header.jsx`, `NavigationLink.jsx`, and `Sidebar.jsx` provide shared navigation primitives.
- `ui/` contains low-level reusable UI elements such as buttons, cards, inputs, selects, states, and badges.
- `header/` contains the public and authenticated header system.
- `home/` contains landing page sections and landing-specific visuals.
- `dashboard/` contains dashboard cards, stats, gauges, and preview panels.
- `catalog/` contains catalog product listing components.
- `requests/` contains request forms, cards, headers, badges, and detail layouts.
- `shared/` contains cross-feature components.
- `supplier-products/` contains supplier product management components.
- `layout/` contains route protection helpers used by the routing layer.

## How It Fits in KERNO
Components keep UI patterns reusable across public pages, dashboards, catalog pages, request pages, and profile workflows.

## Maintenance Notes
Place highly reusable primitives in `ui/`. Keep feature-specific components in their feature folder so pages remain easy to scan.
