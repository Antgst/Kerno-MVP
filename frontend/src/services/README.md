# Frontend Services

## Purpose
This folder centralizes frontend communication with the KERNO backend REST API and keeps API calls out of page components.

## Analogy
Think of this folder as the communication desk of the frontend: pages describe what users see, while services handle conversations with the backend.

## Contents
- `apiClient.js` is the central HTTP client. It applies the API base URL, authentication token, JSON handling, and normalized error behavior.
- `apiError.js` defines frontend API error helpers.
- `tokenStorage.js` manages client-side access to the authentication token.
- `frontendCache.js` provides small frontend cache helpers.
- `authService.js` handles login, registration, and authentication-related API calls.
- `userService.js` handles current-user API calls.
- `supplierService.js` handles supplier profile and supplier discovery API calls.
- `storeService.js` handles store profile API calls.
- `productService.js` handles product catalog and supplier product API calls.
- `categoryService.js` handles product category API calls.
- `requestService.js` handles contact or quote request API calls.

## How It Fits in KERNO
Pages and components use this service layer to talk to the Express API configured through `frontend/src/config/api.js`. This keeps backend communication consistent across public, supplier, and store flows.

## Maintenance Notes
Add domain-specific API calls to the matching service file. Keep low-level HTTP behavior in `apiClient.js` so token and error handling stay consistent.
