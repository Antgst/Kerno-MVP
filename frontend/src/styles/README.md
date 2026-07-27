# Styles

## Purpose
This folder contains the CSS files that define the visual system, layouts, responsive behavior, and page-specific styling for the frontend.

## Analogy
Think of this folder as the visual rulebook: it keeps spacing, typography, layout, and page polish consistent.

## Contents
- `01-base.css` defines baseline styles and design tokens.
- `02-landing.css`, `10-landing-responsive.css`, `18-landing-buttons.css`, and `19-landing-final-system.css` style and refine the public landing page.
- `03-layout.css` styles the application shell and layout structure.
- `05-ui-components.css` styles shared UI components.
- `06-marketing-auth.css` styles public auth and marketing-related screens.
- `07-profiles.css` styles profile pages.
- `08-responsive-fixes.css` contains responsive adjustments.
- `09-store-dashboard.css` styles store dashboard views.
- `12-product-detail.css` styles product and supplier detail pages.
- `13-supplier-products.css` styles supplier product management.
- `14-catalog.css` styles catalog views.
- `15-supplier-requests.css` styles supplier request views.
- `16-final-ux-polish.css` and `17-targeted-pages.css` contain focused UI refinements.
- `20-global-background.css`, `21-circular-progressbar.css`, and `22-typography-system.css` contain global visual refinements.

## How It Fits in KERNO
`App.css` imports these files to build the frontend visual layer used by public pages, dashboards, catalog, profiles, and requests.

## Maintenance Notes
Respect the existing CSS ordering because later files may intentionally refine earlier styles. Keep new styles scoped to their owning page or component area.
