# Backend Structure

The Kerno backend follows a modular monolith structure.

The objective is to keep the backend simple, readable, and easy to review while still separating responsibilities by business domain.

Each backend domain is organized in its own module inside:

```text
backend/src/modules
```

---

## Current Backend Modules

Current backend modules:

| Module       | Responsibility                                                               |
| ------------ | ---------------------------------------------------------------------------- |
| `health`     | API health check                                                             |
| `auth`       | Registration, login, JWT generation, authentication logic                    |
| `users`      | Current user access and shared account data                                  |
| `suppliers`  | Supplier profile creation, update, listing and detail access                 |
| `stores`     | Store profile creation and update                                            |
| `categories` | Product category listing and creation                                        |
| `products`   | Product creation, update, listing, detail access and deactivation            |
| `requests`   | Contact or quote request creation, listing, detail access and status updates |

---

## Module File Pattern

A backend module can contain several file types depending on its responsibility.

Common module files:

```text
*.routes.js
*.controller.js
*.service.js
*.swagger.js
```

### `*.routes.js`

Declares the HTTP endpoints for the module.

It connects Express routes to controller functions and applies authentication or role-based middleware when needed.

### `*.controller.js`

Handles HTTP request and response logic.

The controller reads request data, calls the appropriate service, and returns the HTTP response.

### `*.service.js`

Contains business logic and database calls.

The service layer is used when a module needs to interact with Prisma, enforce business rules, or keep controller logic simple.

### `*.swagger.js`

Documents the module API routes for OpenAPI / Swagger.

Swagger files are split by backend module and assembled in:

```text
backend/src/config/swagger.js
```

Not every module needs every file. For example, a simple health module can stay lighter than a business module such as `products` or `requests`.

---

## Shared Backend Files

| File or directory       | Purpose                                                                                  |
| ----------------------- | ---------------------------------------------------------------------------------------- |
| `src/app.js`            | Configures the Express application, middlewares, API routes, Swagger UI and OpenAPI JSON |
| `src/server.js`         | Starts the HTTP server                                                                   |
| `src/routes/index.js`   | Registers all module routes under `/api`                                                 |
| `src/config/swagger.js` | Builds the OpenAPI specification from module-specific Swagger files                      |
| `src/lib/prisma.js`     | Provides shared Prisma database access                                                   |
| `src/generated/prisma/` | Contains the generated Prisma client                                                     |
| `src/middlewares/`      | Contains shared Express middlewares such as authentication and role checks               |
| `src/modules/`          | Contains backend business modules                                                        |

---

## API Mounting

All backend module routes are mounted under:

```text
/api
```

Example:

```text
/products
```

is exposed as:

```text
/api/products
```

The OpenAPI configuration uses:

```text
server: /api
```

This means documented OpenAPI paths should not repeat the `/api` prefix.

---

## Main API Documentation

The current API summary is documented in:

```text
docs/api/API_SUMMARY.md
```

A historical Sprint 2 API reference remains available in:

```text
docs/api/BACKEND_API_S2.md
```

Swagger UI is available locally when the backend server is running:

```text
http://localhost:5000/api/docs
```

The raw OpenAPI JSON specification is available at:

```text
http://localhost:5000/api/openapi.json
```

Current validated OpenAPI status:

```text
server: /api
paths: 21
bad paths: []
```

---

## Prisma Client

The Prisma schema generates the client into:

```text
backend/src/generated/prisma
```

The shared Prisma client is imported from:

```text
backend/src/lib/prisma.js
```

This keeps database access centralized and avoids creating multiple Prisma clients across the backend.

---

## Current Simplified Structure

```text
backend/
├── prisma/
│   ├── migrations/
│   ├── INSTALL_POSTGRES_PRISMA.md
│   └── schema.prisma
│
├── src/
│   ├── config/
│   │   └── swagger.js
│   │
│   ├── generated/
│   │   └── prisma/
│   │
│   ├── lib/
│   │   └── prisma.js
│   │
│   ├── middlewares/
│   │
│   ├── modules/
│   │   ├── auth/
│   │   ├── categories/
│   │   ├── health/
│   │   ├── products/
│   │   ├── requests/
│   │   ├── stores/
│   │   ├── suppliers/
│   │   └── users/
│   │
│   ├── routes/
│   │   └── index.js
│   │
│   ├── app.js
│   └── server.js
│
├── tests/
│   ├── results/
│   ├── RUN_KERNO_PYTESTS.md
│   └── test_kerno_api_comprehensive.py
│
├── package.json
└── .env.example
```

---

## Architecture Rules

The backend should follow these rules:

* keep the MVP backend as a modular monolith;
* avoid microservices during the MVP;
* keep route declarations inside route files;
* keep HTTP request and response handling inside controllers;
* keep business rules and database calls inside services when needed;
* keep authentication and role checks in shared middlewares;
* keep Prisma access centralized;
* keep Swagger documentation close to the module it documents;
* keep API behavior aligned with the current API summary and OpenAPI output.

---

## Review Notes

This structure supports the current MVP backend scope:

* authentication;
* role-based access;
* supplier profiles;
* store profiles;
* categories;
* products;
* contact requests;
* health check;
* Swagger / OpenAPI documentation.

The backend structure should be updated when a new module, shared layer, or architectural rule is added.
