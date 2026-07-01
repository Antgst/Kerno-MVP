# Supplier Product Components

## Purpose
This folder contains components for supplier product management screens.

## Analogy
Think of this folder as the supplier product shelf: it helps suppliers review, present, and manage their offers.

## Contents
- `SupplierProductsCollection.jsx` renders the supplier product list.
- `SupplierProductCard.jsx` renders an individual supplier product card.
- `SupplierProductVisual.jsx` renders supplier product imagery.
- `SupplierProductMeta.jsx` renders product metadata.
- `SupplierProductActions.jsx` renders product management actions.
- `SupplierProductsToolbar.jsx` renders list controls.
- `SupplierProductsHeader.jsx` renders the product management header.
- `SupplierProductsSummary.jsx` renders product summary information.
- `SupplierProductsIcon.jsx` renders product management icons.

## How It Fits in KERNO
Supplier product components support the supplier pages where products are created, reviewed, edited, and presented in the marketplace.

## Maintenance Notes
Keep product management presentation here. API calls should stay in `productService.js`, and route-level coordination should stay in supplier pages.
