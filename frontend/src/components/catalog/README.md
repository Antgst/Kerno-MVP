# Catalog Components

## Purpose
This folder contains reusable components for the product catalog experience.

## Analogy
Think of this folder as the catalog display system: it organizes products so stores can scan, compare, and open details.

## Contents
- `CatalogProducts.jsx` renders the catalog product collection.
- `CatalogProductCard.jsx` renders an individual product card.
- `CatalogProductVisual.jsx` renders product imagery within catalog cards.
- `CatalogProductInformation.jsx` renders product text and metadata.
- `CatalogToolbar.jsx` renders catalog search or filter controls.
- `CatalogSummary.jsx` renders catalog summary information.
- `CatalogIcon.jsx` renders catalog-specific icons.

## How It Fits in KERNO
Catalog components are assembled by the catalog page and support store-side product discovery.

## Maintenance Notes
Keep catalog filtering and route state in the page when possible. Card-level rendering should stay in this folder.
