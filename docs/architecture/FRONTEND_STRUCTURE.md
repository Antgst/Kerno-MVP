# KERNO Frontend Structure

## 1. Purpose

This document describes the frontend structure of the KERNO MVP.

The frontend is responsible for displaying the user interface, managing navigation, rendering public and authenticated pages, and communicating with the backend REST API.

The frontend does not contain the main business logic. Business rules, authentication checks, data persistence and role-based access are handled by the backend.

---

## 2. Frontend Location

The frontend application is located in:

```text
frontend/
```

Main source code is located in:

```text
frontend/src/
```

---

## 3. Main Technologies

The frontend uses:

* React
* JavaScript
* Vite
* React Router
* Tailwind CSS
* CSS

The goal is to keep the frontend simple, readable and realistic for a portfolio MVP.

---

## 4. Source Structure

Current frontend source structure:

```text
frontend/src/
├── api/
├── assets/
├── components/
├── config/
├── hooks/
├── layouts/
├── pages/
├── routes/
├── services/
├── utils/
├── App.css
├── App.jsx
├── index.css
└── main.jsx
```

---

## 5. Application Entry Point

### `main.jsx`

The `main.jsx` file is the React entry point.

It mounts the application in the DOM and loads the root React component.

### `App.jsx`

The `App.jsx` file acts as the main frontend application wrapper.

It delegates route rendering to the routing system.

---

## 6. Routing

Routing is handled inside:

```text
frontend/src/routes/
```

Main files:

```text
frontend/src/routes/AppRoutes.jsx
frontend/src/routes/routeConfig.js
```

### Responsibilities

The routing layer is responsible for:

* defining public routes;
* defining authenticated shared routes;
* defining authenticated supplier routes;
* defining authenticated store routes;
* linking each route to the correct page component;
* wrapping routes with the correct layout;
* keeping navigation aligned with the MVP scope.

### Main MVP Routes

Public routes:

```text
/
/login
/register
```

Authenticated shared routes:

```text
/catalog
/suppliers/:id
/products/:id
```

Supplier routes:

```text
/supplier/dashboard
/supplier/profile
/supplier/products
/supplier/products/new
/supplier/products/:id/edit
/supplier/requests
/supplier/requests/:id
```

Store routes:

```text
/store/dashboard
/store/profile
/store/requests
/store/requests/:id
```

Store request route:

```text
/requests/new
```

Fallback route:

```text
*
```

The routing map intentionally stays aligned with the MVP and does not add non-required features.

---

## 7. Layouts

Layouts are stored in:

```text
frontend/src/layouts/
```

Current layout files:

```text
AppLayout.jsx
PublicLayout.jsx
```

### `PublicLayout.jsx`

The public layout is used for non-authenticated or public-facing pages.

Examples:

* landing page;
* login page;
* register page;
* not found fallback page.

Its purpose is to provide a consistent public navigation and page structure.

### `AppLayout.jsx`

The application layout is used for authenticated dashboard-style pages.

Examples:

* supplier dashboard;
* supplier profile;
* supplier product management;
* supplier requests;
* store dashboard;
* store profile;
* store requests;
* catalog;
* product detail page;
* supplier detail page;
* request creation page.

Its purpose is to provide a consistent app shell with sidebar navigation and page content area.

---

## 8. Shared Components

Reusable components are stored in:

```text
frontend/src/components/
```

Main component groups:

```text
components/
├── shared/
├── ui/
├── Header.jsx
├── NavigationLink.jsx
└── Sidebar.jsx
```

---

## 9. UI Components

Generic UI components are stored in:

```text
frontend/src/components/ui/
```

Current UI components:

```text
Button.jsx
Card.jsx
EmptyState.jsx
ErrorState.jsx
Input.jsx
LoadingState.jsx
Select.jsx
StatusBadge.jsx
```

### Responsibilities

These components provide reusable UI primitives for the MVP screens.

They help keep the pages consistent and avoid duplicating markup and styling.

Examples:

* `Button` for common actions;
* `Card` for dashboard, product or supplier sections;
* `Input` and `Select` for forms;
* `StatusBadge` for request or publication status;
* `LoadingState`, `ErrorState` and `EmptyState` for data fetching states.

---

## 10. Shared Business Components

Shared higher-level components are stored in:

```text
frontend/src/components/shared/
```

Current shared components:

```text
DashboardStatCard.jsx
PageHeader.jsx
```

### `DashboardStatCard.jsx`

Used to display simple dashboard indicators.

Examples:

* number of published products;
* number of received requests;
* number of sent requests;
* profile completion indicators.

### `PageHeader.jsx`

Used to provide consistent page titles, subtitles and optional page actions across the MVP screens.

---

## 11. Navigation Components

Main navigation components:

```text
Header.jsx
Sidebar.jsx
NavigationLink.jsx
```

### `Header.jsx`

Used in the public layout to provide top-level navigation.

### `Sidebar.jsx`

Used in the authenticated application layout.

It provides role-oriented navigation links for supplier and store screens.

### `NavigationLink.jsx`

Reusable navigation link component used to keep active states and navigation styling consistent.

---

## 12. Pages

Pages are stored in:

```text
frontend/src/pages/
```

Current page groups:

```text
pages/
├── catalog/
├── details/
├── requests/
├── store/
├── supplier/
├── HomePage.jsx
├── LoginPage.jsx
├── NotFoundPage.jsx
├── PlaceholderPage.jsx
└── RegisterPage.jsx
```

---

## 13. Public Pages

Public pages include:

```text
HomePage.jsx
LoginPage.jsx
RegisterPage.jsx
NotFoundPage.jsx
```

### `HomePage.jsx`

Landing page for KERNO.

Its role is to present the value proposition and guide visitors toward the supplier or store path.

### `LoginPage.jsx`

User login screen.

### `RegisterPage.jsx`

User registration screen, including role-oriented onboarding logic.

### `NotFoundPage.jsx`

Fallback page for unmatched routes.

---

## 14. Catalog and Detail Pages

Catalog page:

```text
pages/catalog/CatalogPage.jsx
```

Detail pages:

```text
pages/details/ProductDetailPage.jsx
pages/details/SupplierDetailPage.jsx
```

### Responsibilities

These pages support the store discovery flow:

* search products or suppliers;
* display marketplace results;
* open product detail pages;
* open supplier detail pages;
* guide the store toward a structured request.

These routes are authenticated shared frontend routes. They require an authenticated user in the frontend routing model, while the related backend read endpoints can remain publicly readable API endpoints.

---

## 15. Supplier Pages

Supplier pages are stored in:

```text
frontend/src/pages/supplier/
```

Current files:

```text
SupplierDashboardPage.jsx
SupplierProductFormPage.jsx
SupplierProductsPage.jsx
SupplierProfilePage.jsx
```

### Responsibilities

Supplier pages allow a supplier to:

* access a dashboard;
* create or update a supplier profile;
* publish a product;
* manage published products;
* access received requests through request pages.

---

## 16. Store Pages

Store pages are stored in:

```text
frontend/src/pages/store/
```

Current files:

```text
StoreDashboardPage.jsx
StoreProfilePage.jsx
```

### Responsibilities

Store pages allow a store user to:

* access a dashboard;
* create or update a store profile;
* access the catalog;
* follow sent requests through request pages.

---

## 17. Request Pages

Request pages are stored in:

```text
frontend/src/pages/requests/
```

Current files:

```text
RequestFormPage.jsx
StoreRequestDetailPage.jsx
StoreRequestsPage.jsx
SupplierRequestDetailPage.jsx
SupplierRequestsPage.jsx
```

### Responsibilities

Request pages support the main MVP conversion flow:

* a store sends a structured contact or quote request;
* a store can review sent requests;
* a supplier can review received requests;
* both roles can open request detail pages.

The request flow remains intentionally simple and does not include advanced messaging.

---

## 18. Services Layer

Frontend services are stored in:

```text
frontend/src/services/
```

Current service files:

```text
apiClient.js
apiError.js
authService.js
categoryService.js
index.js
productService.js
requestService.js
storeService.js
supplierService.js
tokenStorage.js
userService.js
```

### Responsibilities

The services layer centralizes communication with the backend API.

This avoids calling `fetch` directly from every page and keeps API-related logic easier to maintain.

Main responsibilities:

* configure API requests;
* send authentication requests;
* store and retrieve JWT tokens;
* fetch products, suppliers, stores, categories and requests;
* normalize API errors;
* expose reusable service functions to pages and components.

---

## 19. API Configuration

API configuration is stored in:

```text
frontend/src/config/api.js
```

This file centralizes the backend base URL and keeps API configuration separate from page components.

Environment variables are defined in:

```text
frontend/.env.example
```

---

## 20. Styles and CSS Architecture

Frontend styles are stored in:

```text
frontend/src/styles/
```

The global CSS cascade is imported from:

```text
frontend/src/App.css
```

The background harmonization file is imported separately from:

```text
frontend/src/App.jsx
```

Detailed CSS architecture and maintenance rules are documented in:

```text
docs/architecture/FRONTEND_CSS_ARCHITECTURE.md
```

---

## 21. Utilities

Utility functions are stored in:

```text
frontend/src/utils/
```

Current utility files:

```text
authNavigation.js
completionPercent.js
jwt.js
productImages.js
productPrice.js
responseUtils.js
status.js
```

These utilities support authentication navigation, profile completion calculations, JWT handling, product images, product price formatting, API response helpers and status labels.

---

## 22. Assets

Frontend assets are stored in:

```text
frontend/src/assets/
```

Current source assets include:

```text
brand/kerno-logo.webp
catalog-cards/rillettes-de-legumes.webp
landing/*.webp
register/register-local-sourcing-banner.webp
store-dashboard/*.webp
supplier-dashboard/*.webp
```

Public assets are stored in:

```text
frontend/public/
```

Current public assets include:

```text
assets/products/*.webp
data/franceCities.txt
favicon.webp
icons.svg
```

---

## 23. Frontend MVP Scope

The frontend covers the following MVP screens:

* landing page;
* login page;
* registration page;
* supplier dashboard;
* supplier profile page;
* supplier product form;
* supplier product management;
* supplier received requests;
* supplier request details;
* store dashboard;
* store profile page;
* catalog search/listing;
* supplier detail page;
* product detail page;
* contact/quote request form;
* store sent requests;
* store request details;
* not found fallback page.

---

## 24. Out of Scope

The frontend intentionally does not include:

* payment UI;
* checkout flow;
* order management;
* logistics tracking;
* advanced messaging;
* public ratings and reviews;
* advanced analytics dashboards;
* subscription billing screens.

These features are outside the MVP scope and should not be presented as completed features.

---

## 24. Frontend Design Rationale

The frontend structure was designed to stay:

* simple;
* readable;
* route-driven;
* aligned with the MVP;
* easy to review;
* easy to extend after the MVP.

The separation between pages, layouts, components and services helps keep the code maintainable while staying realistic for a portfolio project.