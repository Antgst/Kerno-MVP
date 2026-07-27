# Products Module

## Purpose
This module manages supplier products, including creation, updates, listing, detail access, and deactivation.

## Analogy
Think of this module as the product catalog office: suppliers publish offers here, and stores discover them through the frontend catalog.

## Contents
- `products.routes.js` declares product endpoints and applies authentication or role checks where needed.
- `products.controller.js` handles HTTP request and response flow for product operations.
- `products.service.js` contains product business logic, filtering, ownership checks, and Prisma access.
- `products.swagger.js` documents product endpoints for the OpenAPI specification.

## How It Fits in KERNO
Products connect suppliers, categories, catalog browsing, product detail pages, supplier dashboards, and contact requests.

## Maintenance Notes
Keep product ownership and lifecycle rules in the service layer. Preserve category and supplier relationships when changing product behavior.
