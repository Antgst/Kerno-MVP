# Frontend API Services

This folder centralizes frontend calls to the KERNO backend REST API.

## Base URL

The API base URL is configured through:

```env
VITE_API_BASE_URL="http://localhost:5000/api"
```

The runtime configuration is implemented in:

```text
frontend/src/config/api.js
```

## Current service files

```text
apiClient.js
apiError.js
frontendCache.js
authService.js
categoryService.js
productService.js
requestService.js
storeService.js
supplierService.js
tokenStorage.js
userService.js
```

## Responsibility

The services layer keeps API calls out of page components.

It centralizes:

* backend request configuration;
* JWT token handling;
* frontend cache helpers;
* domain-specific calls for auth, users, suppliers, stores, products, categories and requests;
* API error normalization.
