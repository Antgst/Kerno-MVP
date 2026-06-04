# Backend Structure

The Kerno backend follows a modular monolith structure.

Each backend domain is organized in its own module inside `backend/src/modules`.

Current modules:

* `auth`: authentication and session/token-related logic
* `users`: common user account logic
* `suppliers`: supplier profile logic
* `stores`: store profile logic
* `products`: product catalog logic
* `categories`: product category logic
* `requests`: contact and quote request logic

Each module is split into three files:

* `*.routes.js`: declares the HTTP endpoints for the module
* `*.controller.js`: handles HTTP request and response logic
* `*.service.js`: contains business logic and database calls

Shared backend files:

* `src/app.js`: configures the Express application
* `src/server.js`: starts the HTTP server
* `src/routes/index.js`: registers all module routes under `/api`
* `src/lib/prisma.js`: provides Prisma database access
* `src/middlewares/`: contains shared Express middlewares such as error handling

This structure keeps the MVP simple while making future features easier to implement, review, and maintain.
