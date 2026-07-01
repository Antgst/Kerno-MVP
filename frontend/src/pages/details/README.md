# Detail Pages

## Purpose
This folder contains route-level detail pages for products and suppliers.

## Analogy
Think of these pages as profile sheets: they give users the focused information needed before taking the next action.

## Contents
- `ProductDetailPage.jsx` renders a detailed view of a product offer.
- `SupplierDetailPage.jsx` renders a detailed view of a supplier profile.

## How It Fits in KERNO
Detail pages bridge catalog discovery and request creation by showing enough context for stores to decide whether to contact a supplier.

## Maintenance Notes
Keep detail-specific loading and route parameter handling here. Reusable detail fields or cards should move into components when they are shared.
