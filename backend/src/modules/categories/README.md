# Categories Module

## Purpose
This module manages product categories used to organize and filter the catalog.

## Analogy
Think of this module as the shelf labeling system: it gives products a consistent structure for browsing and filtering.

## Contents
- `categories.routes.js` declares category endpoints.
- `categories.controller.js` handles HTTP request and response flow for category operations.
- `categories.service.js` contains category business logic and Prisma access.
- `categories.swagger.js` documents category endpoints for the OpenAPI specification.

## How It Fits in KERNO
Categories help stores navigate product offers and help suppliers classify their products consistently.

## Maintenance Notes
Keep category naming and creation behavior centralized here. Avoid hardcoding category logic in frontend pages or product services.
