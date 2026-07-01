# Utils

## Purpose
This folder contains small reusable frontend helper functions.

## Analogy
Think of this folder as the shared measuring kit: helpers keep repeated formatting and navigation decisions consistent.

## Contents
- `authNavigation.js` determines navigation behavior after authentication.
- `completionPercent.js` calculates profile completion values.
- `jwt.js` reads useful information from JWT values.
- `productImages.js` resolves product image data for UI rendering.
- `productPrice.js` formats product price information for display.
- `responseUtils.js` provides request or response formatting helpers.
- `status.js` maps request status values to frontend labels and display metadata.

## How It Fits in KERNO
These helpers support pages, components, and services without owning full UI or backend communication responsibilities.

## Maintenance Notes
Keep utilities small and framework-light. If a helper grows domain-specific behavior, consider moving that behavior closer to the matching page, component, or service.
