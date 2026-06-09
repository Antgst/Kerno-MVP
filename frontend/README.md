# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## MVP frontend routing map

The Sprint 3 frontend routing map defines the initial navigation structure for the KERNO MVP.

### Public routes

- `/` — Home / route map
- `/login` — Login
- `/register` — Register

### Authenticated shared routes

- `/catalog` — Catalog
- `/suppliers/:id` — Supplier details
- `/products/:id` — Product details

### Supplier routes

- `/supplier/dashboard` — Supplier dashboard
- `/supplier/profile` — Supplier profile
- `/supplier/products` — Supplier products
- `/supplier/products/new` — Add product
- `/supplier/requests` — Received requests
- `/supplier/requests/:id` — Received request details

### Store routes

- `/store/dashboard` — Store dashboard
- `/store/profile` — Store profile
- `/store/requests` — Sent requests
- `/store/requests/:id` — Sent request details
- `/requests/new` — New request

### Fallback route

- `*` — Not found page

### Access model

- `public`: accessible without authentication
- `auth`: requires an authenticated user
- `supplier`: requires an authenticated supplier user
- `store`: requires an authenticated store user
