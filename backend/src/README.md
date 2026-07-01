# Backend Source

## Purpose
This folder contains the runtime source code for the KERNO API. It wires Express, shared middleware, module routes, Swagger, and database access.

## Analogy
Think of this folder as the API workshop: modules provide specialized tools, while `app.js` and `server.js` assemble them into one running service.

## Contents
- `app.js` configures the Express app, shared middleware, API routes, Swagger UI, and OpenAPI JSON endpoint.
- `server.js` starts the HTTP server.
- `routes/` mounts all backend module routes under the API prefix.
- `modules/` contains the domain modules for auth, users, suppliers, stores, products, categories, requests, and health checks.
- `middlewares/` contains shared Express middleware for authentication, errors, and 404 handling.
- `lib/` contains shared backend infrastructure such as the Prisma client.
- `config/` contains application configuration such as Swagger setup.
- `utils/` contains small reusable backend helpers.
- `test-prisma.js` is a small Prisma connectivity helper.

## How It Fits in KERNO
The frontend communicates with this source layer through HTTP JSON endpoints. The source layer validates requests, delegates work to modules, and persists data through Prisma.

## Maintenance Notes
Keep controllers thin, place domain decisions in services, and expose new endpoints through the module route files before registering them in `routes/index.js`.
