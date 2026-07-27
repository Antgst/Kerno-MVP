# UI Components

## Purpose
This folder contains low-level reusable interface components.

## Analogy
Think of this folder as the design toolkit: these pieces provide consistent controls and states across the frontend.

## Contents
- `Button.jsx` defines the shared button component.
- `Card.jsx` defines the shared card container.
- `Input.jsx` defines the shared text input component.
- `Select.jsx` defines the shared select component.
- `StatusBadge.jsx` renders status labels with consistent styling.
- `LoadingState.jsx` renders loading feedback.
- `ErrorState.jsx` renders error feedback.
- `EmptyState.jsx` renders empty-content feedback.
- `ProductImage.jsx` renders product imagery consistently.

## How It Fits in KERNO
Pages and feature components use these primitives to keep the interface consistent across dashboards, catalogs, requests, and public pages.

## Maintenance Notes
Keep these components generic. Feature-specific labels, data fetching, or domain rules should stay outside this folder.
