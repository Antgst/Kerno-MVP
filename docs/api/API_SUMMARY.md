# KERNO API Summary

## 1. Purpose

This document summarizes the REST API used by the KERNO MVP.

The API supports the core marketplace workflow:

1. register or login as a supplier or store;
2. create and manage a professional profile;
3. publish and browse products;
4. browse supplier profiles;
5. send and track structured contact or quote requests.

The API intentionally stays focused on the MVP and does not include payment, ordering, logistics, advanced messaging or subscription billing.

---

## 2. API Base Path

The backend exposes all API routes under:

```text
/api
```

Example:

```text
GET /api/health
```

In the route tables below, paths are shown without the `/api` prefix when referring to OpenAPI paths.

Example:

```text
/products
```

means:

```text
/api/products
```

---

## 3. Local API URLs

When the backend is running locally:

```text
http://localhost:5000/api
```

Swagger UI:

```text
http://localhost:5000/api/docs
```

OpenAPI JSON:

```text
http://localhost:5000/api/openapi.json
```

---

## 4. Authentication Model

The API uses JWT authentication.

Protected routes require an `Authorization` header:

```http
Cookie: kerno_auth_token=<http_only_cookie>
```

The token is returned after a successful login or registration.

---

## 5. User Roles

The API supports two roles:

```text
SUPPLIER
STORE
```

Role-based authorization is enforced by backend middleware.

| Role       | Main Permissions                                                                                              |
| ---------- | ------------------------------------------------------------------------------------------------------------- |
| `SUPPLIER` | Create supplier profile, publish products, manage own products, read received requests, update request status |
| `STORE`    | Create store profile, browse catalog data, send contact requests, read sent requests                          |

---

## 6. API Route Overview

| Module     | Method   | Path                    | Access              | Purpose                           |
| ---------- | -------- | ----------------------- | ------------------- | --------------------------------- |
| Health     | `GET`    | `/health`               | Public              | Check API health                  |
| Auth       | `GET`    | `/auth`                 | Public              | Check auth module status          |
| Auth       | `POST`   | `/auth/register`        | Public              | Register a user                   |
| Auth       | `POST`   | `/auth/login`           | Public              | Log in a user                     |
| Users      | `GET`    | `/users`                | Public              | Check users module status         |
| Users      | `GET`    | `/users/me`             | Authenticated       | Retrieve current user             |
| Suppliers  | `GET`    | `/suppliers`            | Public              | List supplier profiles            |
| Suppliers  | `GET`    | `/suppliers/:id`        | Public              | Retrieve supplier profile by id   |
| Suppliers  | `POST`   | `/suppliers/profile`    | Supplier only       | Create supplier profile           |
| Suppliers  | `GET`    | `/suppliers/profile/me` | Supplier only       | Retrieve current supplier profile |
| Suppliers  | `PUT`    | `/suppliers/profile/me` | Supplier only       | Update current supplier profile   |
| Stores     | `GET`    | `/stores`               | Public              | Check stores module status        |
| Stores     | `POST`   | `/stores/profile`       | Store only          | Create store profile              |
| Stores     | `GET`    | `/stores/profile/me`    | Store only          | Retrieve current store profile    |
| Stores     | `PUT`    | `/stores/profile/me`    | Store only          | Update current store profile      |
| Categories | `GET`    | `/categories`           | Public              | List categories                   |
| Categories | `POST`   | `/categories`           | Supplier only       | Create category                   |
| Products   | `GET`    | `/products`             | Public              | List active products              |
| Products   | `GET`    | `/products/:id`         | Public              | Retrieve product details          |
| Products   | `POST`   | `/products`             | Supplier only       | Create product                    |
| Products   | `PUT`    | `/products/:id`         | Supplier only       | Update product                    |
| Products   | `DELETE` | `/products/:id`         | Supplier only       | Deactivate product                |
| Requests   | `POST`   | `/requests`             | Store only          | Create contact request            |
| Requests   | `GET`    | `/requests/sent`        | Store only          | List sent requests                |
| Requests   | `GET`    | `/requests/received`    | Supplier only       | List received requests            |
| Requests   | `GET`    | `/requests/:id`         | Authenticated owner | Retrieve request details          |
| Requests   | `PATCH`  | `/requests/:id/status`  | Supplier only       | Update request status             |

---

## 7. Health Endpoints

### `GET /health`

Checks whether the API is running.

#### Success Response

```json
{
  "success": true,
  "message": "KERNO API is running"
}
```

---

## 8. Auth Endpoints

### `GET /auth`

Checks whether the auth module is available.

#### Success Response

```json
{
  "success": true,
  "module": "auth",
  "message": "Auth module is ready"
}
```

---

### `POST /auth/register`

Registers a new user.

#### Access

Public.

#### Request Body

```json
{
  "email": "supplier@example.com",
  "password": "Password123!",
  "role": "SUPPLIER",
  "firstName": "Ada",
  "lastName": "Lovelace"
}
```

#### Required Fields

```text
email
password
role
```

#### Valid Roles

```text
SUPPLIER
STORE
```

#### Success Response

Returns the created user and sets an HttpOnly authentication cookie named `kerno_auth_token`.

```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "usr_123",
    "email": "supplier@example.com",
    "role": "SUPPLIER",
    "firstName": "Ada",
    "lastName": "Lovelace"
  }

}
```

---

### `POST /auth/login`

Logs in an existing user.

#### Access

Public.

#### Request Body

```json
{
  "email": "supplier@example.com",
  "password": "Password123!"
}
```

#### Success Response

Returns the authenticated user and sets an HttpOnly authentication cookie named `kerno_auth_token`.

```json
{
  "success": true,
  "message": "User logged in successfully",
  "user": {
    "id": "usr_123",
    "email": "supplier@example.com",
    "role": "SUPPLIER"
  }

}
```

---

## 9. Users Endpoints

### `GET /users`

Checks whether the users module is available.

#### Access

Public.

---

### `GET /users/me`

Retrieves the current authenticated user.

#### Access

Authenticated user.

#### Authentication

Authenticated session cookie `kerno_auth_token` sent automatically by the browser/API client.

#### Success Response

```json
{
  "success": true,
  "user": {
    "id": "usr_123",
    "email": "store@example.com",
    "role": "STORE",
    "firstName": "Grace",
    "lastName": "Hopper"
  }
}
```

---

## 10. Suppliers Endpoints

### `GET /suppliers`

Lists supplier profiles.

#### Access

Public.

#### Purpose

Used by the catalog and supplier discovery screens.

---

### `GET /suppliers/:id`

Retrieves a supplier profile by id.

#### Access

Public.

#### Purpose

Used by the supplier detail page.

---

### `POST /suppliers/profile`

Creates the authenticated supplier profile.

#### Access

Supplier only.

#### Authentication

Authenticated session cookie `kerno_auth_token` sent automatically by the browser/API client.

#### Request Body

```json
{
  "companyName": "GreenField Farms",
  "description": "Local fruit and vegetable supplier.",
  "location": "Rennes",
  "businessType": "Local producer",
  "contactEmail": "contact@greenfield.example",
  "phone": "0600000000",
  "website": "https://greenfield.example"
}
```

---

### `GET /suppliers/profile/me`

Retrieves the current supplier profile.

#### Access

Supplier only.

---

### `PUT /suppliers/profile/me`

Updates the current supplier profile.

#### Access

Supplier only.

---

## 11. Stores Endpoints

### `GET /stores`

Checks whether the stores module is available.

#### Access

Public.

---

### `POST /stores/profile`

Creates the authenticated store profile.

#### Access

Store only.

#### Authentication

Authenticated session cookie `kerno_auth_token` sent automatically by the browser/API client.

#### Request Body

```json
{
  "storeName": "Kerno Market",
  "brandName": "Kerno",
  "location": "Rennes",
  "storeType": "Independent retail store",
  "sourcingNeeds": "Local and direct suppliers",
  "contactEmail": "buyer@kerno-market.example",
  "phone": "0600000000"
}
```

---

### `GET /stores/profile/me`

Retrieves the current store profile.

#### Access

Store only.

---

### `PUT /stores/profile/me`

Updates the current store profile.

#### Access

Store only.

---

## 12. Categories Endpoints

### `GET /categories`

Lists product categories.

#### Access

Public.

#### Purpose

Used to organize and filter products.

---

### `POST /categories`

Creates a product category.

#### Access

Supplier only.

#### Request Body

```json
{
  "name": "Fresh Produce",
  "description": "Fresh fruits and vegetables"
}
```

---

## 13. Products Endpoints

### `GET /products`

Lists active products.

#### Access

Public.

#### Purpose

Used by the catalog page and product discovery flow.

#### Filtering

The backend MVP currently returns active products from `/products`.

Catalog search and filters are handled on the frontend after fetching products and suppliers. Backend query-based filtering can be added later if the catalog grows or performance requires it.

---

### `GET /products/:id`

Retrieves product details by id.

#### Access

Public.

#### Purpose

Used by the product detail page.

---

### `POST /products`

Creates a product.

#### Access

Supplier only.

#### Authentication

Authenticated session cookie `kerno_auth_token` sent automatically by the browser/API client.

#### Request Body

```json
{
  "name": "Organic Tomatoes",
  "description": "Fresh local tomatoes.",
  "priceCents": 1200,
  "priceUnit": "COLIS",
  "minimumOrderQuantity": 5,
  "minimumOrderUnit": "COLIS",
  "origin": "Rennes",
  "categoryId": "cat_123",
  "imageUrl": "https://example.com/product.jpg"
}
```

---

### `PUT /products/:id`

Updates a product owned by the authenticated supplier.

#### Access

Supplier only.

#### Request Body

```json
{
  "name": "Updated Organic Tomatoes",
  "priceCents": 1000,
  "priceUnit": "COLIS",
  "minimumOrderQuantity": 10,
  "minimumOrderUnit": "COLIS"
}
```

---

### `DELETE /products/:id`

Deactivates a product owned by the authenticated supplier.

#### Access

Supplier only.

#### Purpose

The MVP uses product deactivation instead of hard deletion to keep the flow safer and easier to manage.

---

## 14. Requests Endpoints

### `POST /requests`

Creates a structured contact or quote request.

#### Access

Store only.

#### Authentication

Authenticated session cookie `kerno_auth_token` sent automatically by the browser/API client.

#### Request Body

```json
{
  "supplierId": "sup_123",
  "productId": "prd_123",
  "subject": "Wholesale inquiry",
  "message": "Can you send us your current pricing and lead times?",
  "requestedQuantity": "50 units"
}
```

#### Required Fields

```text
supplierId
subject
message
```

#### Optional Fields

```text
productId
requestedQuantity
```

---

### `GET /requests/sent`

Lists requests sent by the authenticated store.

#### Access

Store only.

#### Purpose

Used by the store request tracking screen.

---

### `GET /requests/received`

Lists requests received by the authenticated supplier.

#### Access

Supplier only.

#### Purpose

Used by the supplier received requests screen.

---

### `GET /requests/:id`

Retrieves one request by id.

#### Access

Authenticated owner.

A request can be accessed by:

* the store that sent it;
* the supplier that received it.

---

### `PATCH /requests/:id/status`

Updates the status of a received request.

#### Access

Supplier only.

#### Request Body

```json
{
  "status": "READ"
}
```

#### Valid Status Values

```text
PENDING
READ
ANSWERED
CLOSED
```

---

## 15. Common Response Format

Most successful responses follow this structure:

```json
{
  "success": true,
  "message": "Operation completed successfully"
}
```

Resource responses usually include the resource name:

```json
{
  "success": true,
  "product": {
    "id": "prd_123",
    "name": "Organic Tomatoes"
  }
}
```

List responses usually include a plural resource key:

```json
{
  "success": true,
  "products": []
}
```

---

## 16. Common Error Format

Error responses follow this general structure:

```json
{
  "success": false,
  "message": "Error message"
}
```

Common HTTP status codes:

| Status | Meaning                                                            |
| -----: | ------------------------------------------------------------------ |
|  `400` | Invalid request payload                                            |
|  `401` | Authentication missing or invalid                                  |
|  `403` | Authenticated user does not have the required role                 |
|  `404` | Resource not found                                                 |
|  `409` | Resource conflict, for example duplicate email or existing profile |
|  `500` | Internal server error                                              |

---

## 17. MVP Coverage

The API covers the following MVP needs:

* user registration;
* user login;
* JWT authentication;
* role-based access control;
* supplier profile management;
* store profile management;
* product publication;
* product listing and details;
* supplier listing and details;
* category listing and creation;
* store-to-supplier contact requests;
* sent and received request tracking;
* simple request status updates.

---

## 18. Out of Scope

The API intentionally does not cover:

* payments;
* carts;
* orders;
* invoices;
* delivery tracking;
* advanced messaging;
* ratings and reviews;
* subscription billing;
* scraping automation.

These features are outside the current MVP scope.

---

## 19. Related Documentation

* `docs/api/BACKEND_API_S2.md`
* `docs/architecture/APPLICATION_ARCHITECTURE.md`
* `docs/architecture/BACKEND_STRUCTURE.md`
* `docs/database/DATABASE_SCHEMA.md`
* `docs/security/EN_AUTH_SECURITY_NOTES.md`
* `docs/testing/TESTING_EVIDENCE.md`
