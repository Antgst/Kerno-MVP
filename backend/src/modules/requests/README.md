# Requests Module

## Purpose
This module manages contact or quote requests sent by stores to suppliers.

## Analogy
Think of this module as the structured inquiry desk: it turns buyer interest into trackable supplier-facing requests.

## Contents
- `requests.routes.js` declares request endpoints and applies authentication or role checks where needed.
- `requests.controller.js` handles HTTP request and response flow for request operations.
- `requests.service.js` contains request creation, listing, detail, status, and Prisma access logic.
- `requests.swagger.js` documents request endpoints for the OpenAPI specification.

## How It Fits in KERNO
Requests are the core business action of the product. They connect stores, suppliers, and optionally products into a clear first-contact workflow.

## Maintenance Notes
Keep role-sensitive access rules strict: stores create requests, suppliers review incoming requests, and shared request data should stay consistent for both sides.
