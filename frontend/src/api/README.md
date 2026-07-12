# API Layer

This directory is reserved for a future low-level API layer if the frontend needs one.

## Current Project Decision

In the current architecture, frontend API communication is handled by the `services` directory:

```text
frontend/src/services/
├── apiClient.js
├── apiError.js
├── frontendCache.js
├── authService.js
├── categoryService.js
├── productService.js
├── requestService.js
├── storeService.js
├── supplierService.js
└── tokenStorage.js
```

This service-based structure already centralizes:

* HTTP requests to the backend API;
* cookie-based authentication handling;
* API error formatting;
* domain-specific API calls;
* reusable frontend/backend communication logic.

Because of this, adding files to `src/api/` would duplicate the role of `src/services/`.

## Future Use

This directory may be used later if the project needs a more explicit API layer separated from business-oriented services.

A possible future structure could be:

```text
api/
├── endpoints.js
├── client.js
├── authApi.js
├── productApi.js
└── requestApi.js
```

In that future structure:

* `client.js` would contain the low-level HTTP client;
* `endpoints.js` would centralize API route constants;
* `authApi.js`, `productApi.js`, and `requestApi.js` would expose raw API calls;
* `services/` could then focus on higher-level frontend logic.

## Maintenance Notes

Do not add API logic here unless the team decides to refactor the current `services` architecture.

For the current application scope, keep API calls inside `frontend/src/services/`.
