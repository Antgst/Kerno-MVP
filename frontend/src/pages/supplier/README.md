# Supplier Pages

## Purpose
This folder contains route-level screens for the supplier role.

## Analogy
Think of this folder as the supplier workspace: it helps suppliers manage their profile, products, and incoming interest.

## Contents
- `SupplierDashboardPage.jsx` renders the supplier dashboard.
- `SupplierProfilePage.jsx` renders the supplier profile page.
- `SupplierProductsPage.jsx` renders the supplier product management list.
- `SupplierProductFormPage.jsx` renders product creation and editing.

## How It Fits in KERNO
Supplier pages support the supply side of the marketplace by letting suppliers present their business and product offers to stores.

## Maintenance Notes
Keep supplier-only behavior here. Shared product cards, toolbar pieces, and summaries belong in `components/supplier-products/`.
