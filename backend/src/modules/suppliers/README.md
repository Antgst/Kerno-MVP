# Suppliers Module

## Purpose
This module manages supplier profiles, supplier listing, and supplier detail access.

## Analogy
Think of this module as the supplier directory: it stores the professional profile information that stores use during discovery.

## Contents
- `suppliers.routes.js` declares supplier endpoints and applies authentication or role checks where needed.
- `suppliers.controller.js` handles HTTP request and response flow for supplier operations.
- `suppliers.service.js` contains supplier profile business logic and Prisma access.
- `suppliers.swagger.js` documents supplier endpoints for the OpenAPI specification.

## How It Fits in KERNO
Supplier profiles support catalog discovery, supplier detail pages, dashboards, products, and request flows. They are one of the central entities of the marketplace.

## Maintenance Notes
Keep supplier ownership and profile rules in the service layer. Cross-domain behavior involving products or requests should use clear service boundaries.
