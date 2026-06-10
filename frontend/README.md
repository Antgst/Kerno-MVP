# KERNO Frontend

React + JavaScript + Vite frontend for the KERNO MVP.

## Purpose

This frontend provides the user interface for the KERNO B2B SaaS marketplace MVP.

It supports the main MVP journeys:

* public access;
* authentication entry points;
* supplier workspace;
* store workspace;
* catalog and detail pages;
* contact / quote request flow.

## Tech Stack

* React
* JavaScript
* Vite
* Tailwind CSS
* React Router

## Environment Variables

```env
VITE_API_BASE_URL="http://localhost:5000/api"
```

## Local Development

```bash
npm install
npm run dev
```

The frontend runs by default on:

```text
http://localhost:5173
```

The backend API should run on:

```text
http://localhost:5000/api
```

## Validation

```bash
npm run build
npm run lint
```

## MVP frontend routing map

The Sprint 3 frontend routing map defines the initial navigation structure for the KERNO MVP.

### Public routes

* `/` — Home / route map
* `/login` — Login
* `/register` — Register

### Authenticated shared routes

* `/catalog` — Catalog
* `/suppliers/:id` — Supplier details
* `/products/:id` — Product details

### Supplier routes

* `/supplier/dashboard` — Supplier dashboard
* `/supplier/profile` — Supplier profile
* `/supplier/products` — Supplier products
* `/supplier/products/new` — Add product
* `/supplier/requests` — Received requests
* `/supplier/requests/:id` — Received request details

### Store routes

* `/store/dashboard` — Store dashboard
* `/store/profile` — Store profile
* `/store/requests` — Sent requests
* `/store/requests/:id` — Sent request details
* `/requests/new` — New request

### Fallback route

* `*` — Not found page

### Access model

* `public`: accessible without authentication
* `auth`: requires an authenticated user
* `supplier`: requires an authenticated supplier user
* `store`: requires an authenticated store user
