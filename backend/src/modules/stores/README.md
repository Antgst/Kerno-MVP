# Stores Module

## Purpose
This module manages store profiles and the store-side account information needed for sourcing workflows.

## Analogy
Think of this module as the buyer profile desk: it keeps the store identity available for requests and dashboard views.

## Contents
- `stores.routes.js` declares store endpoints and applies route protection where needed.
- `stores.controller.js` handles HTTP request and response flow for store operations.
- `stores.service.js` contains store profile business logic and Prisma access.
- `stores.swagger.js` documents store endpoints for the OpenAPI specification.

## How It Fits in KERNO
Stores browse products and suppliers, then send structured requests. This module provides the store profile data connected to those actions.

## Maintenance Notes
Keep store-specific behavior here. Request creation and request status handling belong in the `requests` module.
