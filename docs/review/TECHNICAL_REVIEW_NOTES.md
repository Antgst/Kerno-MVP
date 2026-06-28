# KERNO Technical Review Notes

## 1. Purpose

This document prepares the final technical review for the KERNO MVP.

It summarizes the main points to explain during the review:

* project purpose;
* MVP scope;
* architecture;
* database design;
* API design;
* authentication and authorization;
* frontend structure;
* testing strategy;
* Git/GitHub workflow;
* known limitations;
* possible technical questions.

---

## 2. Project Summary

KERNO is a B2B SaaS marketplace MVP.

Its goal is to connect direct or local suppliers with retail stores through a simple professional platform.

The MVP focuses on one core workflow:

1. suppliers create profiles;
2. suppliers publish products;
3. stores browse products and suppliers;
4. stores send structured contact or quote requests;
5. suppliers review received requests.

KERNO does not try to replace a full e-commerce platform. It focuses on the first business contact between stores and suppliers.

---

## 3. Problem Solved

Retail stores often need to discover reliable direct or local suppliers, but supplier information can be scattered, informal or hard to compare.

Suppliers also need a simple way to present their products and receive qualified business requests.

KERNO provides a structured marketplace interface where both sides can interact around profiles, products and contact requests.

---

## 4. MVP Scope

### Included in the MVP

* landing page;
* user registration and login;
* supplier and store roles;
* supplier profile;
* store profile;
* product publication;
* product catalog;
* supplier listing and detail page;
* product detail page;
* structured contact or quote request;
* supplier received requests;
* store sent requests;
* simple request status tracking.

### Excluded from the MVP

* payment;
* checkout;
* orders;
* invoices;
* logistics;
* advanced messaging;
* public ratings and reviews;
* subscription billing;
* supplier scraping;
* advanced analytics.

This limited scope was chosen to keep the project realistic, reviewable and aligned with the core value proposition.

---

## 5. Technical Stack

### Frontend

* React
* JavaScript
* Vite
* React Router
* CSS

### Backend

* Node.js
* Express
* JavaScript
* REST API
* Swagger / OpenAPI

### Database

* PostgreSQL
* Prisma ORM
* Prisma migrations

### Authentication

* Password hashing
* JWT authentication
* Role-based access control

---

## 6. High-Level Architecture

KERNO uses a classic three-layer architecture:

```text
Browser / React frontend
        ↓ HTTP JSON
Node.js / Express REST API
        ↓ Prisma ORM
PostgreSQL database
```

The architecture is intentionally simple.

It avoids microservices because the MVP does not need distributed complexity. Instead, the backend is structured as a modular monolith, with business domains separated into modules.

---

## 7. Backend Architecture

The backend is organized by business domain.

Main modules:

* `auth`
* `users`
* `suppliers`
* `stores`
* `categories`
* `products`
* `requests`
* `health`

Each module generally contains:

* routes;
* controllers;
* services;
* Swagger documentation.

### Why this structure?

This structure keeps the code readable and easier to review.

Routes define API entry points, controllers handle request/response logic, and services handle business/data access logic.

---

## 8. Frontend Architecture

The frontend is organized around:

* routes;
* layouts;
* pages;
* shared components;
* UI components;
* services;
* utilities.

Main folders:

```text
frontend/src/
├── components/
├── layouts/
├── pages/
├── routes/
├── services/
├── config/
└── utils/
```

### Why this structure?

The frontend separates reusable UI from page-level screens.

It also centralizes API calls inside services instead of spreading `fetch` calls across all pages.

This makes the frontend easier to maintain and extend.

---

## 9. Database Design

The MVP database contains six main models:

* `User`
* `SupplierProfile`
* `StoreProfile`
* `Category`
* `Product`
* `ContactRequest`

### Main Relationships

* a user can own one supplier profile;
* a user can own one store profile;
* a supplier can publish many products;
* a category can classify many products;
* a store can send many contact requests;
* a supplier can receive many contact requests;
* a request can optionally be linked to a product.

### Why PostgreSQL and Prisma?

PostgreSQL is well suited for relational data.

Prisma provides:

* a readable schema;
* migrations;
* type-safe style query access;
* clear database relationships;
* easier onboarding for the team.

---

## 10. Authentication and Authorization

KERNO uses JWT authentication.

The flow is:

1. the user registers or logs in;
2. the backend verifies credentials;
3. the backend returns a JWT;
4. the frontend stores the token;
5. protected requests include the token in the `Authorization` header;
6. backend middleware verifies the token and role.

### Roles

KERNO has two roles:

```text
SUPPLIER
STORE
```

### Role-Based Examples

A supplier can:

* create a supplier profile;
* create and manage products;
* read received requests;
* update request status.

A store can:

* create a store profile;
* browse catalog data;
* send contact requests;
* read sent requests.

This role separation prevents users from accessing flows that do not belong to their business side.

---

## 11. API Design

The backend exposes a REST API under:

```text
/api
```

Swagger UI is available at:

```text
/api/docs
```

OpenAPI JSON is available at:

```text
/api/openapi.json
```

### API Domains

* Health
* Auth
* Users
* Suppliers
* Stores
* Categories
* Products
* Requests

### Why REST?

REST is simple, readable and sufficient for this MVP.

The project does not need GraphQL or complex real-time communication at this stage.

---

## 12. Main MVP Flow to Explain

A good review explanation should follow the business flow:

1. A supplier registers.
2. The supplier creates a supplier profile.
3. The supplier publishes a product.
4. A store registers.
5. The store creates a store profile.
6. The store browses the catalog.
7. The store opens a product or supplier detail page.
8. The store sends a structured request.
9. The supplier receives the request.
10. The supplier can update the request status.

This is the central scenario to demonstrate.

---

## 13. Testing Strategy

The testing strategy is pragmatic and MVP-oriented.

It includes:

* backend syntax checks;
* backend API tests;
* Postman/API validation evidence;
* frontend build checks;
* frontend manual route validation;
* full MVP manual scenario testing.

### What to Emphasize

The project does not claim full production-grade test coverage.

The goal is to prove that the core MVP flow works and that critical backend routes and frontend screens are reviewable.

---

## 14. Git and Collaboration Workflow

The team used GitHub to organize work through:

* issues;
* branches;
* pull requests;
* reviews;
* sprint-based planning;
* project board tracking.

### Branching Logic

Typical branch naming examples:

```text
backend/s2-...
frontend/s3-...
docs/s5-final-documentation
```

### Review Logic

Work is split into small issues and reviewed through pull requests.

This helps keep changes traceable and easier to validate.

---

## 15. Key Technical Decisions

### Modular monolith instead of microservices

Reason:

* simpler;
* faster to build;
* easier to review;
* enough for MVP needs.

### REST API instead of GraphQL

Reason:

* simpler for the team;
* clear route structure;
* easy to document with Swagger;
* enough for the current data flow.

### JWT authentication

Reason:

* common web authentication pattern;
* easy to use between frontend and backend;
* supports protected routes.

### PostgreSQL with Prisma

Reason:

* relational marketplace data;
* clear schema;
* migrations;
* easier relationship management.

### MVP scope limitation

Reason:

* focus on the core supplier/store/request flow;
* avoid overbuilding;
* keep the project realistic for the timeline.

---

## 16. Known Limitations

The current MVP has limitations:

* no payment;
* no order system;
* no logistics;
* no full messaging system;
* no review/rating system;
* limited analytics;
* limited automated testing coverage;
* no production-grade CI/CD pipeline;
* no advanced security audit;
* no full accessibility audit.

These limitations are intentional or acceptable for the MVP stage.

---

## 17. Possible Review Questions and Answers

### Why did you choose a modular monolith?

Because the MVP does not need microservices. A modular monolith keeps deployment simple while still separating the code by domain.

---

### Why did you choose REST?

REST is sufficient for the MVP. The routes are clear, easy to test, and easy to document with Swagger.

---

### Why did you use Prisma?

Prisma makes the database schema readable and helps manage migrations and relationships. It also makes onboarding easier for the team.

---

### How do you separate supplier and store permissions?

The backend uses the user role stored in the database and checks it through authentication/authorization middleware.

---

### What prevents a store from creating products?

Product creation routes are protected and require the `SUPPLIER` role.

---

### What prevents a supplier from sending store requests?

Request creation is protected and requires the `STORE` role.

---

### Why is payment excluded?

Payment is not necessary to validate the first MVP value. The MVP focuses on discovery and structured business contact.

---

### Why is messaging excluded?

A complete messaging system would increase scope. The MVP uses structured contact requests as a simpler first version.

---

### What is the most important business action in the MVP?

The contact or quote request. It connects marketplace discovery to a concrete business opportunity.

---

### What would you improve next?

Possible next improvements:

* better search and filters;
* supplier onboarding assistance;
* request reply system;
* notifications;
* product import;
* ratings or trust indicators;
* analytics;
* subscription and billing model;
* production deployment and CI/CD.

---

## 18. Demo Talking Points

During the demo, keep the explanation simple:

1. "KERNO connects suppliers and stores."
2. "The supplier side creates profiles and products."
3. "The store side browses and sends structured requests."
4. "The backend protects supplier and store responsibilities with roles."
5. "The database is centered around users, profiles, products and contact requests."
6. "The MVP intentionally excludes payment and logistics."

---

## 19. Final Review Checklist

Before the technical review, confirm:

| Check                                        | Status |
| -------------------------------------------- | ------ |
| README is up to date                         | TO VERIFY BEFORE REVIEW |
| Architecture documentation is complete       | TO VERIFY BEFORE REVIEW |
| Frontend structure documentation is complete | TO VERIFY BEFORE REVIEW |
| Database schema documentation is complete    | TO VERIFY BEFORE REVIEW |
| API summary is complete                      | TO VERIFY BEFORE REVIEW |
| Testing evidence is updated                  | TO VERIFY BEFORE REVIEW |
| Demo scenario is prepared                    | TO VERIFY BEFORE REVIEW |
| Backend starts correctly                     | TO VERIFY BEFORE REVIEW |
| Frontend starts correctly                    | TO VERIFY BEFORE REVIEW |
| Database migrations are ready                | TO VERIFY BEFORE REVIEW |
| Swagger documentation is accessible          | TO VERIFY BEFORE REVIEW |
| Full MVP scenario works                      | TO VERIFY BEFORE REVIEW |
| No blocking issue remains                    | TO VERIFY BEFORE REVIEW |

---

## 20. Short Oral Pitch

KERNO is a B2B SaaS marketplace MVP that connects direct or local suppliers with retail stores.

The MVP allows suppliers to create a profile and publish products, while stores can browse the catalog and send structured contact or quote requests.

Technically, the project uses a React/Vite frontend, a Node.js/Express REST API, PostgreSQL with Prisma ORM, JWT authentication, and role-based access control for supplier and store flows.

The architecture is intentionally simple and modular to stay realistic for the portfolio timeline while keeping the project maintainable and extensible.
