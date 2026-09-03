# RNCP5 — Database evidence

Date: 2026-09-03  
Project: KERNO  
Database: PostgreSQL  
ORM / schema tool: Prisma

## Purpose

This document maps the KERNO database assets to the database evidence expected in the DWWM RNCP dossier. It does not introduce a new database design; it points to the existing conceptual model, physical schema and versioned creation/modification scripts.

The representative RNCP flow is:

```text
StoreProfile -> ContactRequest -> SupplierProfile
                       |
                       v
                    Product
```

## 1. Conceptual / relationship model

Primary source:

```text
docs/database/DATABASE_SCHEMA.md
```

The Mermaid relationship overview documents the business relationships between:

- `User`;
- `SupplierProfile`;
- `StoreProfile`;
- `Category`;
- `Product`;
- `ContactRequest`.

For the RNCP dossier, the most readable reduced diagram should focus on:

```text
User
  |-- SupplierProfile --< Product
  |          |
  |          +--< ContactRequest >-- StoreProfile -- User
  |
  +-- StoreProfile
```

The dossier should explain that `ContactRequest` is the central relation for the representative store-to-supplier flow and may optionally reference a `Product`.

## 2. Physical schema

Authoritative source:

```text
backend/prisma/schema.prisma
```

The current Prisma schema defines:

- UUID primary keys;
- unique user emails;
- unique profile-to-user links;
- the `UserRole` enum with `SUPPLIER` and `STORE`;
- the `ProductPriceUnit` enum;
- explicit relations and foreign-key delete behavior;
- snake_case PostgreSQL table/column mappings;
- a default `PENDING` status for `ContactRequest`.

Physical PostgreSQL table names:

| Prisma model | PostgreSQL table |
| --- | --- |
| `User` | `users` |
| `SupplierProfile` | `supplier_profiles` |
| `StoreProfile` | `store_profiles` |
| `Category` | `categories` |
| `Product` | `products` |
| `ContactRequest` | `contact_requests` |

For the dossier, use a short excerpt of `schema.prisma` around `UserRole`, `Product` and `ContactRequest` rather than reproducing the whole schema.

## 3. Creation and modification scripts

Versioned SQL scripts are stored under:

```text
backend/prisma/migrations/
```

Current migration chain:

### Initial MVP schema

```text
backend/prisma/migrations/20260604195732_init_mvp_schema/migration.sql
```

Creates:

- `UserRole`;
- the six MVP tables;
- primary keys and unique indexes;
- foreign keys and delete/update behavior.

### Request status default alignment

```text
backend/prisma/migrations/20260608204904_align_request_status_default/migration.sql
```

Changes the default value of `contact_requests.status` from the historical lowercase value to:

```sql
'PENDING'
```

### Product price model evolution

```text
backend/prisma/migrations/20260622170956_replace_product_price_info/migration.sql
```

Replaces the earlier free-text price/minimum-order fields with structured fields:

- `price_cents`;
- `price_unit`;
- `minimum_order_quantity`;
- `minimum_order_unit`.

It also creates the `ProductPriceUnit` enum.

### Liter unit addition

```text
backend/prisma/migrations/20260702120000_add_liter_to_product_price_unit/migration.sql
```

Adds `LITER` to `ProductPriceUnit`.

## 4. Important interpretation for the jury

The initial migration is historical. It must not be presented alone as the current physical schema because later migrations modify it.

Safe explanation:

> `schema.prisma` represents the current application model. The migration directory represents the versioned SQL history used to create and evolve the PostgreSQL schema. The initial migration creates the MVP structure, then later migrations align the request status default and evolve the product price model.

This distinction demonstrates both the current physical model and the database change history.

## 5. Representative data path

When a store sends a request:

1. the authenticated user is resolved to a `StoreProfile`;
2. the target `SupplierProfile` is checked;
3. an optional `Product` is checked against that supplier;
4. a `ContactRequest` is persisted with `storeId`, `supplierId`, optional `productId`, subject, message, optional quantity and initial `PENDING` status;
5. foreign-key relations connect the request to the participating profiles and optional product.

Primary implementation evidence:

```text
backend/src/modules/requests/requests.service.js
backend/prisma/schema.prisma
```

## 6. Data integrity and security points to explain

Database/schema level:

- UUID identifiers;
- unique email;
- unique user/profile relationship;
- foreign-key constraints;
- controlled delete behavior;
- enum-constrained user role;
- versioned migrations.

Application/service level:

- role and ownership checks remain server-side responsibilities;
- the service verifies that a product belongs to the selected supplier before persisting a request;
- Prisma access does not replace input validation or authorization.

The dossier should distinguish database integrity constraints from application authorization rules.

## 7. RNCP evidence selection

Recommended body-of-dossier assets:

1. one reduced relationship diagram centered on `User`, profiles, `Product` and `ContactRequest`;
2. one short `schema.prisma` excerpt for `UserRole` + `ContactRequest`;
3. one short initial-migration SQL excerpt showing table/foreign-key creation;
4. one later migration excerpt showing a real schema evolution.

Recommended annexes:

- complete conceptual Mermaid diagram from `DATABASE_SCHEMA.md`;
- targeted current Prisma schema;
- migration list and one or two representative SQL files.

Avoid pasting the full schema and every migration into the main dossier.

## 8. Status

For RNCP evidence purposes, the database requirement is materially covered by existing repository assets:

- conceptual relationship model: available;
- physical model: available;
- creation SQL: available;
- modification SQL: available;
- representative business-flow persistence: available.

Remaining work is presentation work: produce the clearest final diagram/captures and verify that the dossier references the current schema plus the migration chain, not the initial migration alone.
