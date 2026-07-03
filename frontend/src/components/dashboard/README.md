# Dashboard Components

## Purpose
This folder contains reusable dashboard sections for supplier and store views.

## Analogy
Think of this folder as the control board: it summarizes profile progress, activity, and next actions.

## Contents
- `DashboardIntro.jsx` renders dashboard introduction content.
- `DashboardStats.jsx` renders dashboard statistics.
- `DashboardProfileCard.jsx` renders profile summary content.
- `DashboardRequestsPanel.jsx` renders request-related dashboard content.
- `ProfileCompletionGauge.jsx` renders profile completion progress.
- `StoreRecommendedSuppliers.jsx` renders recommended supplier content for stores.
- `SupplierProductsPreview.jsx` renders supplier product preview content.
- `DashboardIcon.jsx` renders dashboard-specific icons.

## How It Fits in KERNO
Dashboard components help store and supplier pages present important account, product, and request information without duplicating UI structures.

## Maintenance Notes
Keep role-specific data decisions in pages or services. Components here should stay focused on dashboard presentation.
