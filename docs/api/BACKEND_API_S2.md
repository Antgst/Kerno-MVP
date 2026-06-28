# Kerno Backend API — Sprint 2

> Historical note: this document records the Sprint 2 backend API state. For the current API reference, use `docs/api/API_SUMMARY.md`.


## Purpose

This document describes the Sprint 2 backend API implemented for the Kerno MVP.

It documents the current backend routes after the Sprint 2 backend foundation work:
- authentication;
- authenticated user access;
- supplier profiles;
- store profiles;
- product and category routes;
- contact request routes;
- health check;
- OpenAPI / Swagger documentation.

The goal is to provide a stable reference for frontend integration, backend review, and project evaluation.

---

## Current status

The Sprint 2 backend exposes a REST API mounted under:

```text
/api
```

Swagger UI is available locally at:

```text
http://localhost:5000/api/docs
```

The raw OpenAPI JSON specification is available at:

```text
http://localhost:5000/api/openapi.json
```

The current OpenAPI configuration uses:

```text
server: /api
paths: 21
bad paths: []
```

This means the OpenAPI server base path is `/api`, and documented paths must not repeat the `/api` prefix.

---

## Authentication model

The backend uses JWT authentication.

Protected routes require an HTTP `Authorization` header:

```http
Authorization: Bearer <token>
```

Two user roles are currently supported:

```text
SUPPLIER
STORE
```

Role-based routes are protected with backend middleware.

---

## API route overview

| Module | Method | Path | Access | Purpose |
|---|---|---|---|---|
| Health | `GET` | `/health` | Public | Check API health |
| Auth | `GET` | `/auth` | Public | Check auth module status |
| Auth | `POST` | `/auth/register` | Public | Register a user |
| Auth | `POST` | `/auth/login` | Public | Log in a user |
| Users | `GET` | `/users` | Public | Check users module status |
| Users | `GET` | `/users/me` | Authenticated | Retrieve current user |
| Suppliers | `GET` | `/suppliers` | Public | List supplier profiles |
| Suppliers | `GET` | `/suppliers/:id` | Public | Retrieve a supplier profile by id |
| Suppliers | `POST` | `/suppliers/profile` | Supplier only | Create supplier profile |
| Suppliers | `GET` | `/suppliers/profile/me` | Supplier only | Retrieve current supplier profile |
| Suppliers | `PUT` | `/suppliers/profile/me` | Supplier only | Update current supplier profile |
| Stores | `GET` | `/stores` | Public | Check stores module status |
| Stores | `POST` | `/stores/profile` | Store only | Create store profile |
| Stores | `GET` | `/stores/profile/me` | Store only | Retrieve current store profile |
| Stores | `PUT` | `/stores/profile/me` | Store only | Update current store profile |
| Categories | `GET` | `/categories` | Public | List categories |
| Categories | `POST` | `/categories` | Supplier only | Create category |
| Products | `GET` | `/products` | Public | List active products |
| Products | `GET` | `/products/:id` | Public | Retrieve product details |
| Products | `POST` | `/products` | Supplier only | Create product |
| Products | `PUT` | `/products/:id` | Supplier only | Update product |
| Products | `DELETE` | `/products/:id` | Supplier only | Deactivate product |
| Requests | `POST` | `/requests` | Store only | Create contact request |
| Requests | `GET` | `/requests/sent` | Store only | List sent requests |
| Requests | `GET` | `/requests/received` | Supplier only | List received requests |
| Requests | `GET` | `/requests/:id` | Authenticated owner | Retrieve request details |
| Requests | `PATCH` | `/requests/:id/status` | Supplier only | Update request status |

> Note: the table above uses OpenAPI paths without the `/api` prefix because the OpenAPI server base path is already `/api`.  
> Example: `/products` in this document means the real HTTP route `/api/products`.

---

## Health

### `GET /health`

Checks whether the API is running.

#### Success response

```json
{
  "success": true,
  "message": "KERNO API is running"
}
```

---

## Auth

### `GET /auth`

Checks whether the auth module is available.

### `POST /auth/register`

Registers a new user.

#### Request body

```json
{
  "email": "supplier@example.com",
  "password": "Password123!",
  "role": "SUPPLIER",
  "firstName": "Ada",
  "lastName": "Lovelace"
}
```

#### Required fields

```text
email
password
role
```

#### Valid roles

```text
SUPPLIER
STORE
```

#### Success response

```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "user-id",
    "email": "supplier@example.com",
    "role": "SUPPLIER",
    "firstName": "Ada",
    "lastName": "Lovelace"
  },
  "token": "jwt-token"
}
```

### `POST /auth/login`

Logs in an existing user.

#### Request body

```json
{
  "email": "supplier@example.com",
  "password": "Password123!"
}
```

#### Success response

```json
{
  "success": true,
  "message": "User logged in successfully",
  "user": {
    "id": "user-id",
    "email": "supplier@example.com",
    "role": "SUPPLIER"
  },
  "token": "jwt-token"
}
```

---

## Users

### `GET /users`

Checks whether the users module is available.

### `GET /users/me`

Returns the currently authenticated user.

#### Access

Authenticated user.

#### Headers

```http
Authorization: Bearer <token>
```

#### Success response

```json
{
  "success": true,
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "role": "SUPPLIER",
    "firstName": "Ada",
    "lastName": "Lovelace"
  }
}
```

---

## Suppliers

### `GET /suppliers`

Returns supplier profiles.

#### Access

Public.

### `GET /suppliers/:id`

Returns a supplier profile by id.

#### Access

Public.

### `POST /suppliers/profile`

Creates the current supplier profile.

#### Access

Supplier only.

#### Headers

```http
Authorization: Bearer <supplier-token>
```

#### Request body

```json
{
  "companyName": "Kerno Roasters",
  "description": "Specialty coffee supplier",
  "location": "Rennes",
  "businessType": "Local supplier",
  "contactEmail": "sales@example.com",
  "phone": "+33123456789",
  "website": "https://example.com"
}
```

#### Required fields

```text
companyName
```

### `GET /suppliers/profile/me`

Returns the current supplier profile.

#### Access

Supplier only.

### `PUT /suppliers/profile/me`

Updates the current supplier profile.

#### Access

Supplier only.

#### Request body

```json
{
  "companyName": "Updated supplier name",
  "description": "Updated description",
  "location": "Rennes",
  "businessType": "Producer",
  "contactEmail": "updated@example.com",
  "phone": "+33123456789",
  "website": "https://example.com"
}
```

---

## Stores

### `GET /stores`

Checks whether the stores module is available.

#### Access

Public.

### `POST /stores/profile`

Creates the current store profile.

#### Access

Store only.

#### Headers

```http
Authorization: Bearer <store-token>
```

#### Request body

```json
{
  "storeName": "Kerno Market",
  "brandName": "Kerno",
  "location": "Rennes",
  "storeType": "Supermarket",
  "sourcingNeeds": "Local and specialty products",
  "contactEmail": "buyer@example.com",
  "phone": "+33123456789"
}
```

#### Required fields

```text
storeName
```

### `GET /stores/profile/me`

Returns the current store profile.

#### Access

Store only.

### `PUT /stores/profile/me`

Updates the current store profile.

#### Access

Store only.

#### Request body

```json
{
  "storeName": "Updated store name",
  "brandName": "Updated brand",
  "location": "Rennes",
  "storeType": "Specialty store",
  "sourcingNeeds": "Premium local products",
  "contactEmail": "updated-buyer@example.com",
  "phone": "+33123456789"
}
```

---

## Categories

### `GET /categories`

Returns product categories.

#### Access

Public.

### `POST /categories`

Creates a product category.

#### Access

Supplier only.

#### Headers

```http
Authorization: Bearer <supplier-token>
```

#### Request body

```json
{
  "name": "Coffee",
  "description": "Coffee products"
}
```

#### Required fields

```text
name
```

---

## Products

### `GET /products`

Returns active products.

#### Access

Public.

### `GET /products/:id`

Returns product details.

#### Access

Public.

### `POST /products`

Creates a supplier product.

#### Access

Supplier only.

#### Headers

```http
Authorization: Bearer <supplier-token>
```

#### Request body

```json
{
  "categoryId": "category-id",
  "name": "Single-origin coffee beans",
  "description": "Washed arabica beans",
  "priceCents": 1200,
  "priceUnit": "KG",
  "minimumOrderQuantity": 10,
  "minimumOrderUnit": "KG",
  "origin": "Colombia",
  "imageUrl": "https://example.com/product.jpg"
}
```

#### Required fields

```text
name
```

### `PUT /products/:id`

Updates a supplier product.

#### Access

Supplier only.

The supplier must own the product.

#### Request body

```json
{
  "categoryId": "category-id",
  "name": "Updated product name",
  "description": "Updated description",
  "priceCents": 1400,
  "priceUnit": "KG",
  "minimumOrderQuantity": 20,
  "minimumOrderUnit": "KG",
  "origin": "Colombia",
  "imageUrl": "https://example.com/product.jpg"
}
```

### `DELETE /products/:id`

Deactivates a supplier product.

#### Access

Supplier only.

The supplier must own the product.

This route performs a soft delete by marking the product as inactive.

---

## Contact requests

### `POST /requests`

Creates a contact or quote request from a store to a supplier.

#### Access

Store only.

#### Headers

```http
Authorization: Bearer <store-token>
```

#### Request body

```json
{
  "supplierId": "supplier-profile-id",
  "productId": "product-id",
  "subject": "Wholesale inquiry",
  "message": "Can you share your current lead times?",
  "requestedQuantity": "50 kg"
}
```

#### Required fields

```text
supplierId
subject
message
```

#### Optional fields

```text
productId
requestedQuantity
```

If `productId` is provided, the product must belong to the selected supplier.

### `GET /requests/sent`

Returns requests sent by the current store.

#### Access

Store only.

### `GET /requests/received`

Returns requests received by the current supplier.

#### Access

Supplier only.

### `GET /requests/:id`

Returns request details.

#### Access

Authenticated user.

The request must belong to:
- the current store, if the user role is `STORE`;
- the current supplier, if the user role is `SUPPLIER`.

### `PATCH /requests/:id/status`

Updates the status of a received request.

#### Access

Supplier only.

The request must have been sent to the current supplier profile.

#### Request body

```json
{
  "status": "READ"
}
```

#### Valid statuses

```text
PENDING
READ
ANSWERED
CLOSED
```

---

## Common error responses

### Bad request

```json
{
  "success": false,
  "message": "Name is required"
}
```

### Unauthorized

```json
{
  "success": false,
  "message": "Authentication required"
}
```

### Forbidden

```json
{
  "success": false,
  "message": "Forbidden: insufficient role"
}
```

### Not found

```json
{
  "success": false,
  "message": "Resource not found"
}
```

### Conflict

```json
{
  "success": false,
  "message": "Resource already exists"
}
```

---

## Local validation performed

Sprint 2 backend validation was performed on branch `S2`.

Checked commands:

```bash
npx prisma generate
node --check src/app.js
node --check src/config/swagger.js
node --check src/routes/index.js
node --check src/modules/health/health.controller.js
node --check src/modules/health/health.routes.js
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/kerno" JWT_SECRET="test-secret" node -e "require('./src/app'); console.log('app loads')"
```

Checked routes:

```bash
curl -i http://localhost:5000/api/health
```

OpenAPI validation:

```bash
curl -s http://localhost:5000/api/openapi.json | node -e "
let d='';
process.stdin.on('data', c => d += c);
process.stdin.on('end', () => {
  const json = JSON.parse(d);
  console.log('server:', json.servers?.[0]?.url);
  console.log('paths:', Object.keys(json.paths).length);
  console.log('bad paths:', Object.keys(json.paths).filter(p => p.startsWith('/api')));
});
"
```

Expected result:

```text
server: /api
paths: 21
bad paths: []
```

---

## Frontend integration notes

The frontend should use the backend base URL:

```text
http://localhost:5000/api
```

Frontend calls should use paths such as:

```text
/auth/login
/users/me
/suppliers/profile/me
/stores/profile/me
/products
/categories
/requests/sent
/requests/received
```

The frontend must not duplicate the `/api` prefix if the configured API client already uses `/api` as its base URL.

---

## Review decision

This document supports the review closure of Sprint 2 backend API issues:

- `#32` supplier profile API routes;
- `#33` store profile API routes;
- `#34` product and category API routes;
- `#35` contact request API routes;
- `#36` backend API documentation and testing.

After this documentation is merged into `S2`, the remaining documentation checklist items in these issues can be marked as completed.
