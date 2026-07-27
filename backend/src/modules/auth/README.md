# Auth Module

## Purpose
This module handles account registration, login, password verification, JWT session creation, secure auth cookie handling, and authentication API documentation.

## Analogy
Think of this module as the access desk: it checks identity and issues the credentials used by protected parts of the product.

## Contents
- `auth.routes.js` declares authentication endpoints and connects them to controller actions.
- `auth.controller.js` handles HTTP request and response flow for registration and login.
- `auth.service.js` contains authentication business logic, including user lookup, password handling, and token creation.
- `auth.swagger.js` documents authentication endpoints for the OpenAPI specification.

## How It Fits in KERNO
The frontend login and registration pages call this module through the service layer. Successful authentication returns the user context while the backend stores the session JWT in an HttpOnly cookie.

## Maintenance Notes
Keep credential validation, password hashing, and cookie and token rules centralized here. Do not duplicate authentication logic in other modules.
