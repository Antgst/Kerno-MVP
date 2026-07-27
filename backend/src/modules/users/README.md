# Users Module

## Purpose
This module exposes account-level user operations, especially access to the current authenticated user's shared data.

## Analogy
Think of this module as the account record: it keeps user identity separate from supplier or store profile details.

## Contents
- `users.routes.js` declares user-related endpoints and applies route protection where needed.
- `users.controller.js` handles HTTP request and response flow for user operations.
- `users.service.js` contains user lookup and account data logic.
- `users.swagger.js` documents user endpoints for the OpenAPI specification.

## How It Fits in KERNO
Supplier and store profiles are role-specific, but they are attached to users. This module provides the shared account layer used across those role-specific flows.

## Maintenance Notes
Keep role-neutral account behavior here. Supplier-specific and store-specific profile behavior should remain in their own modules.
