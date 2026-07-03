<div align="center">
  <img src="./docs/assets/kerno-logo.png" alt="Kerno logo" width="180" />

  <h1>KERNO</h1>

  <p><strong>B2B SaaS marketplace MVP connecting direct or local suppliers with retail stores.</strong></p>
</div>

> Note: Kerno is a temporary working name for this portfolio project. The name, brand identity, and visual direction may evolve later if the project moves forward as a real entrepreneurial initiative.

Kerno was born from a concrete retail observation: finding the right supplier is often more difficult than it should be.

For many retail stores, discovering direct, local, regional, or specialized suppliers still relies on fragmented information, manual research, scattered contacts, and informal exchanges. This makes sourcing slower, less structured, and harder to compare.

At the same time, many suppliers struggle to make their products visible to the right retail buyers. They may have relevant offers, strong local value, or specific expertise, but lack a simple professional space where stores can discover them, understand their products, and initiate a first business contact.

Kerno aims to bridge that gap.

At this stage, Kerno is used as a provisional project name. It gives the MVP a clear identity during the portfolio and development phase, but it remains open to future naming, branding, and positioning changes if the project becomes a real business initiative.

The project is designed as a B2B SaaS marketplace MVP focused on supplier discovery, product visibility, and structured first contact between stores and suppliers. It does not try to replace the full purchasing process. Instead, it focuses on the first critical step: helping the right store find the right supplier and send a clear contact or quote request.

The MVP follows a simple and realistic chain:

```text
Supplier creates a profile
        ↓
Supplier publishes products
        ↓
Store searches for suppliers or products
        ↓
Store views product and supplier details
        ↓
Store sends a contact or quote request
        ↓
Supplier receives and reviews the request
```

This repository contains the Stage 4 implementation of Kerno, based on the Stage 3 technical documentation, mockups, architecture, database model, API planning, SCM strategy, and quality plan.

---

<a id="table-of-contents"></a>

## 📚 Table of Contents

* [⚡ At a Glance](#at-a-glance)
* [💡 Key Value Proposition](#key-value-proposition)
* [📌 Project Overview](#project-overview)
* [🧩 Problem Statement](#problem-statement)
* [🚀 Product Vision](#product-vision)
* [🎯 MVP Scope](#mvp-scope)
* [🧮 MoSCoW Prioritization](#moscow-prioritization)
* [🚫 Out of Scope](#out-of-scope)
* [🛣️ Future Evolutions](#future-evolutions)
* [👥 User Roles](#user-roles)
* [🧭 Main User Journey](#main-user-journey)
* [🖥️ Core Features](#core-features)
* [🎨 Mockups and Product Screens](#mockups-and-product-screens)
* [🧱 Tech Stack](#tech-stack)
* [🏗️ Application Architecture](#application-architecture)
* [🧩 Backend Modules](#backend-modules)
* [🗄️ Database Design](#database-design)
* [🔌 API Overview](#api-overview)
* [📁 Repository Structure](#repository-structure)
* [📖 Documentation Map](#documentation-map)
* [⚙️ Getting Started](#getting-started)
* [🔐 Environment Variables](#environment-variables)
* [🐳 Docker Local Development](#docker-local-development)
* [🌿 Development Workflow](#development-workflow)
* [📊 GitHub Project Workflow](#github-project-workflow)
* [🧪 Testing Strategy](#testing-strategy)
* [✅ Quality and Review Process](#quality-and-review-process)
* [🤖 AI-Assisted Working Method](#ai-assisted-working-method)
* [📅 Sprint Organization](#sprint-organization)
* [🤝 Collaboration Model](#collaboration-model)
* [👨‍💻 Team](#team)
* [✍️ Authors](#authors)
* [🔗 Project Links](#project-links)
* [📄 License](#license)
* [🔒 Project Origin and Intellectual Property Notice](#project-origin-and-intellectual-property-notice)

---

<a id="at-a-glance"></a>

## ⚡ At a Glance

| Item                 | Description                                        |
| -------------------- | -------------------------------------------------- |
| Project type         | B2B SaaS marketplace MVP                           |
| Target users         | Direct/local suppliers and retail stores           |
| Core value           | Supplier discovery and structured first contact    |
| Main business action | Store sends a contact or quote request             |
| MVP focus            | Profiles, products, search, detail pages, requests |
| Frontend             | React, JavaScript, Vite, Tailwind CSS              |
| Backend              | Node.js, Express, JavaScript                       |
| Database             | PostgreSQL with Prisma ORM                         |
| Local infrastructure | Docker Compose for PostgreSQL local development    |
| API                  | REST                                               |
| API documentation    | OpenAPI / Swagger + current API summary + historical Sprint 2 reference |
| Portfolio stage      | Holberton Stage 4 MVP implementation               |

---

<a id="key-value-proposition"></a>

## 💡 Key Value Proposition

Kerno helps suppliers become visible and helps stores discover relevant product offers faster.

### For suppliers

* create a professional company profile;
* publish structured product offers;
* increase visibility to retail buyers;
* receive contact or quote requests from interested stores.

### For stores

* discover direct, local, regional, or specialized suppliers;
* search products and supplier profiles;
* compare basic supplier and product information;
* send structured contact or quote requests.

---

<a id="project-overview"></a>

## 📌 Project Overview

Kerno is a B2B SaaS marketplace MVP designed to connect suppliers and retail stores through a simple professional discovery platform.

The product focuses on the first commercial step between both sides:

* supplier visibility;
* product discovery;
* supplier and product detail pages;
* structured contact or quote requests.

The MVP intentionally stays narrow. It does not include payment, logistics, internal messaging, ratings, advanced analytics, or full procurement automation. These features may be considered later, but they are not part of the current implementation scope.

This project is built as part of the Holberton School portfolio process, with a strong focus on teamwork, planning, scope control, architecture, documentation, Git workflow, and MVP delivery.

---

<a id="problem-statement"></a>

## 🧩 Problem Statement

Retail stores often need to find new suppliers quickly, but supplier discovery is still fragmented.

Common issues include:

* supplier information is scattered across websites, personal networks, directories, emails, or informal recommendations;
* stores lose time comparing suppliers and understanding what they offer;
* direct and local suppliers can be hard to identify;
* supplier product information is often incomplete or inconsistent;
* the first business contact is not always structured.

For suppliers, the problem is also clear:

* visibility toward retail buyers is limited;
* presenting products in a professional and reusable way can be difficult;
* contact requests are often informal or incomplete;
* smaller suppliers may struggle to compete with larger, more visible actors.

Kerno addresses this by creating a focused marketplace where suppliers can publish their profile and products, and stores can search, view details, and send structured requests.

---

<a id="product-vision"></a>

## 🚀 Product Vision

The product vision is to create a professional B2B marketplace that makes supplier discovery simpler, clearer, and more structured for retail stores.

The long-term ambition is to become a trusted sourcing interface between retail stores and suppliers, especially for direct, local, regional, or specialized sourcing opportunities.

For the MVP, the vision is intentionally limited:

> Help a store discover a supplier, understand its products, and send a structured first contact request.

---

<a id="mvp-scope"></a>

## 🎯 MVP Scope

The MVP focuses on the smallest set of features required to demonstrate the marketplace value.

### Must Have

* user registration and login;
* user roles: supplier and store;
* supplier profile creation and display;
* store profile creation and display;
* product creation by suppliers;
* product catalog;
* supplier catalog;
* product detail page;
* supplier detail page;
* structured contact or quote request;
* basic request tracking;
* responsive frontend foundation;
* REST API backend;
* PostgreSQL database with Prisma ORM.

### Should Have

* category filtering;
* product search;
* supplier search;
* basic profile editing;
* clean visual identity;
* Swagger / OpenAPI documentation.

### Could Have

* basic dashboard cards;
* request status updates;
* supplier product activation / deactivation;
* basic UI polish;
* empty states.

### Won't Have / Not for MVP

* payment;
* logistics;
* delivery tracking;
* internal messaging;
* ratings and reviews;
* advanced analytics;
* real supplier verification workflow;
* subscription billing;
* recommendation engine;
* mobile app.

---

<a id="moscow-prioritization"></a>

## 🧮 MoSCoW Prioritization

### Must Have Summary

The Must Have scope covers the essential user journey:

```text
Account → Profile → Product → Search → Details → Request
```

Without these elements, the MVP cannot demonstrate its core value.

### Should Have Summary

The Should Have scope improves usability and credibility, especially with search, filters, editing, and API documentation.

### Could Have Summary

The Could Have scope adds comfort and polish but is not required to validate the MVP.

### Won't Have Summary

The Won't Have scope protects the project from becoming too large and losing focus during the portfolio timeline.

---

<a id="out-of-scope"></a>

## 🚫 Out of Scope

The following elements are intentionally excluded from the MVP:

* online payment;
* supplier subscription billing;
* logistics and shipping;
* advanced procurement workflows;
* internal chat;
* ratings and reviews;
* notifications;
* advanced data import;
* supplier scoring;
* legal contract management;
* ERP integration;
* accounting integration.

These features may be explored later only if the MVP proves useful and the core workflow is validated.

---

<a id="future-evolutions"></a>

## 🛣️ Future Evolutions

### V2 — Product and User Experience Improvements

Possible V2 features:

* advanced product filters;
* saved searches;
* favorites;
* supplier badges;
* certifications;
* improved request management;
* request status history;
* supplier onboarding improvements;
* product image management;
* category-based browsing.

### V3 — Business and Marketplace Expansion

Possible V3 features:

* SaaS subscription plans;
* supplier promotion options;
* featured supplier placement;
* analytics dashboard;
* sourcing insights;
* verification workflow;
* team accounts;
* multi-store management;
* CSV product import.

### Long-Term Product Direction

Possible long-term directions:

* payment integration;
* logistics partners;
* quote comparison;
* purchase order generation;
* API integrations;
* AI-assisted supplier matching;
* marketplace trust scoring;
* regional sourcing maps.

---

<a id="user-roles"></a>

## 👥 User Roles

### Visitor

A visitor is not authenticated.

Possible actions:

* access the public landing page;
* understand the product value;
* choose to register or log in.

### Supplier

A supplier is a registered user who wants to present their company and products.

Possible actions:

* create a supplier profile;
* edit supplier information;
* publish products;
* manage product visibility;
* receive contact or quote requests;
* view request details.

### Store

A store is a registered user who wants to discover suppliers and products.

Possible actions:

* create a store profile;
* search suppliers;
* search products;
* view supplier detail pages;
* view product detail pages;
* send contact or quote requests;
* follow sent requests.

---

<a id="main-user-journey"></a>

## 🧭 Main User Journey

```text
1. User registers
2. User selects or receives a role: SUPPLIER or STORE
3. Supplier creates a profile
4. Supplier publishes products
5. Store creates a profile
6. Store browses or searches products / suppliers
7. Store views details
8. Store sends a structured request
9. Supplier receives the request
```

---

<a id="core-features"></a>

## 🖥️ Core Features

### Authentication

* register;
* login;
* password hashing;
* JWT-based session foundation;
* role-based access.

### Supplier Profile

* create supplier profile;
* view supplier profile;
* update supplier profile;
* expose public supplier information to stores.

### Store Profile

* create store profile;
* view store profile;
* update store profile;
* store sourcing information.

### Product Management

* create product;
* list supplier products;
* view product details;
* associate product with supplier;
* optional category association.

### Catalog and Search

* list products;
* list suppliers;
* browse product detail pages;
* browse supplier detail pages;
* prepare search and filtering foundations.

### Contact and Quote Requests

* create request from store to supplier;
* optionally link request to a product;
* view sent requests as store;
* view received requests as supplier;
* track request status.

---

<a id="mockups-and-product-screens"></a>

## 🎨 Mockups and Product Screens

The Stage 3 design work includes mockups for the main MVP screens:

* landing page;
* register / login;
* role selection;
* supplier dashboard;
* store dashboard;
* supplier profile;
* store profile;
* product creation;
* product catalog;
* supplier catalog;
* product detail page;
* supplier detail page;
* request creation;
* request tracking;
* request detail.

The design direction is based on a professional B2B SaaS interface with a premium but practical visual identity.

Main design principles:

* clear hierarchy;
* trust and professionalism;
* simple navigation;
* desktop-first responsive layout;
* supplier and product visibility;
* structured business actions.

---

<a id="tech-stack"></a>

## 🧱 Tech Stack

| Layer               | Technology                      |
| ------------------- | ------------------------------- |
| Frontend            | React                           |
| Frontend language   | JavaScript                      |
| Frontend build tool | Vite                            |
| Styling             | Tailwind CSS                    |
| Backend             | Node.js                         |
| Backend framework   | Express                         |
| Backend language    | JavaScript                      |
| Database            | PostgreSQL                      |
| ORM                 | Prisma                          |
| API                 | REST                            |
| API documentation   | Swagger / OpenAPI               |
| Authentication      | JWT foundation                  |
| Local database      | Docker Compose PostgreSQL       |
| Version control     | Git + GitHub                    |
| Project tracking    | GitHub Issues / GitHub Projects |

---

<a id="application-architecture"></a>

## 🏗️ Application Architecture

The application follows a simple full-stack architecture:

```text
Browser
  ↓
React Frontend
  ↓ HTTP / JSON
Express REST API
  ↓
Prisma ORM
  ↓
PostgreSQL Database
```

The backend is organized as a modular monolith.

```text
backend/
  src/
    modules/
      auth/
      users/
      suppliers/
      stores/
      categories/
      products/
      requests/
    routes/
    middlewares/
    lib/
    config/
```

The frontend is organized around pages, components, layouts, hooks, routes, API helpers, and utilities.

```text
frontend/
  src/
    api/
    assets/
    components/
    hooks/
    layouts/
    pages/
    routes/
    utils/
```

### Architecture Principles

* keep the MVP simple;
* avoid premature microservices;
* separate frontend and backend concerns;
* keep backend modules organized by domain;
* use REST endpoints for communication;
* keep database access centralized through Prisma;
* document important decisions.

---

<a id="backend-modules"></a>

## 🧩 Backend Modules

### Auth Module

Responsible for:

* registration;
* login;
* password hashing;
* JWT generation;
* authentication checks.

### Users Module

Responsible for:

* user data;
* current user endpoint;
* user role management foundation.

### Suppliers Module

Responsible for:

* supplier profile creation;
* supplier profile listing;
* supplier profile details;
* supplier profile update.

### Stores Module

Responsible for:

* store profile creation;
* store profile details;
* store profile update.

### Categories Module

Responsible for:

* product category listing;
* category creation foundation.

### Products Module

Responsible for:

* product creation;
* product listing;
* product details;
* supplier product association;
* category association.

### Requests Module

Responsible for:

* contact request creation;
* sent requests for stores;
* received requests for suppliers;
* request detail view;
* request status foundation.

---

<a id="database-design"></a>

## 🗄️ Database Design

The database is built with PostgreSQL and Prisma ORM.

### Main Tables

* `users`
* `supplier_profiles`
* `store_profiles`
* `categories`
* `products`
* `contact_requests`

### Main Relationships

* one user can have one supplier profile;
* one user can have one store profile;
* one supplier can publish many products;
* one category can contain many products;
* one store can send many contact requests;
* one supplier can receive many contact requests;
* one request can optionally reference one product.

### Database Diagram

A database diagram is maintained in the project documentation and Stage 3 materials.

---

<a id="api-overview"></a>

## 🔌 API Overview

The backend exposes a REST API under the `/api` prefix.

### Swagger Documentation

When the backend is running:

```text
http://localhost:5000/api/docs
```

OpenAPI JSON:

```text
http://localhost:5000/api/openapi.json
```

### API References

Final API summary:

```text
docs/api/API_SUMMARY.md
```

Sprint 2 backend API documentation is also available in:

```text
docs/api/BACKEND_API_S2.md
```

### Current API Status

Implemented backend domains include:

* health;
* auth;
* users;
* suppliers;
* stores;
* categories;
* products;
* requests.

### Main Implemented Routes

Health:

```text
GET /api/health
```

Auth:

```text
GET /api/auth
POST /api/auth/register
POST /api/auth/login
```

Users:

```text
GET /api/users
GET /api/users/me
```

Suppliers:

```text
GET /api/suppliers
GET /api/suppliers/:id
POST /api/suppliers/profile
GET /api/suppliers/profile/me
PUT /api/suppliers/profile/me
```

Stores:

```text
GET /api/stores
POST /api/stores/profile
GET /api/stores/profile/me
PUT /api/stores/profile/me
```

Categories:

```text
GET /api/categories
POST /api/categories
```

Products:

```text
GET /api/products
GET /api/products/:id
POST /api/products
PUT /api/products/:id
DELETE /api/products/:id
```

Requests:

```text
POST /api/requests
GET /api/requests/sent
GET /api/requests/received
GET /api/requests/:id
PATCH /api/requests/:id/status
```

For the final API reference, see [`docs/api/API_SUMMARY.md`](./docs/api/API_SUMMARY.md).

---

<a id="repository-structure"></a>

## 📁 Repository Structure

```text
Kerno-MVP/
  backend/
    prisma/
    src/
      config/
      lib/
      middlewares/
      modules/
      routes/
    tests/
  docs/
    api/
    architecture/
    assets/
    database/
    demo/
    docker/
    review/
    security/
    testing/
  frontend/
    public/
    src/
      api/
      assets/
      components/
      config/
      hooks/
      layouts/
      pages/
      routes/
      services/
      styles/
      utils/
  compose.yaml
  CONTRIBUTING.md
  README.md
```

---

<a id="documentation-map"></a>

## 📖 Documentation Map

The final Stage 4 documentation is split by topic:

| Topic | File |
| --- | --- |
| Application architecture | [`docs/architecture/APPLICATION_ARCHITECTURE.md`](./docs/architecture/APPLICATION_ARCHITECTURE.md) |
| Backend structure | [`docs/architecture/BACKEND_STRUCTURE.md`](./docs/architecture/BACKEND_STRUCTURE.md) |
| Frontend structure | [`docs/architecture/FRONTEND_STRUCTURE.md`](./docs/architecture/FRONTEND_STRUCTURE.md) |
| Frontend CSS architecture | [`docs/architecture/FRONTEND_CSS_ARCHITECTURE.md`](./docs/architecture/FRONTEND_CSS_ARCHITECTURE.md) |
| Database schema | [`docs/database/DATABASE_SCHEMA.md`](./docs/database/DATABASE_SCHEMA.md) |
| API summary | [`docs/api/API_SUMMARY.md`](./docs/api/API_SUMMARY.md) |
| Docker local database | [`docs/docker/DOCKER.md`](./docs/docker/DOCKER.md) |
| Auth and security notes | [`docs/security/AUTH_SECURITY_NOTES.md`](./docs/security/AUTH_SECURITY_NOTES.md) |
| Testing evidence | [`docs/testing/TESTING_EVIDENCE.md`](./docs/testing/TESTING_EVIDENCE.md) |
| Demo scenario | [`docs/demo/DEMO_SCENARIO.md`](./docs/demo/DEMO_SCENARIO.md) |
| Technical review notes | [`docs/review/TECHNICAL_REVIEW_NOTES.md`](./docs/review/TECHNICAL_REVIEW_NOTES.md) |
| Stage 4 deliverable links | [`docs/STAGE4_DELIVERABLE_LINKS.md`](./docs/STAGE4_DELIVERABLE_LINKS.md) |
| Stage 4 sprint plan | [`docs/sprints/SPRINT_PLAN_STAGE4.md`](./docs/sprints/SPRINT_PLAN_STAGE4.md) |
| Stage 4 sprint reviews and retrospectives | [`docs/sprints/SPRINT_REVIEWS_RETROSPECTIVES.md`](./docs/sprints/SPRINT_REVIEWS_RETROSPECTIVES.md) |
| Stage 4 test evidence | [`docs/testing/STAGE4_TEST_EVIDENCE.md`](./docs/testing/STAGE4_TEST_EVIDENCE.md) |
| Stage 4 manual review checklist | [`docs/review/STAGE4_MANUAL_REVIEW_CHECKLIST.md`](./docs/review/STAGE4_MANUAL_REVIEW_CHECKLIST.md) |
| Quality audit | [`docs/audits/quality-audit-2026-07-03.md`](./docs/audits/quality-audit-2026-07-03.md) |

---

<a id="getting-started"></a>

## ⚙️ Getting Started

### Prerequisites

* Node.js
* npm
* PostgreSQL or Docker
* Git
* VS Code or equivalent editor
* Postman or equivalent API testing tool

### Clone the Repository

```bash
git clone https://github.com/Antgst/Kerno-MVP.git
cd Kerno-MVP
```

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev
npm run dev
```

Once the backend is running, you can access:

* API health check: `http://localhost:5000/api/health`
* Swagger UI: `http://localhost:5000/api/docs`
* OpenAPI JSON: `http://localhost:5000/api/openapi.json`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend routing is defined in [`frontend/src/routes/routeConfig.js`](./frontend/src/routes/routeConfig.js) and documented in [`docs/architecture/FRONTEND_STRUCTURE.md`](./docs/architecture/FRONTEND_STRUCTURE.md).

### Database Setup

```bash
cd backend
npx prisma generate
npx prisma migrate dev
```

### Docker Local Database

Docker Compose is used to provide a shared local PostgreSQL environment for the team.

```bash
docker compose up -d
docker compose ps
docker compose logs
docker compose down
```

To reset the local PostgreSQL volume, use:

```bash
docker compose down -v
```

> Warning: `docker compose down -v` removes local database volumes and deletes local PostgreSQL data.

---

<a id="environment-variables"></a>

## 🔐 Environment Variables

### Backend `.env.example`

```env
PORT=5000
DATABASE_URL="postgresql://kerno_user:kerno_password@localhost:5432/kerno_db?schema=public"
JWT_SECRET="replace_with_local_secret"
NODE_ENV="development"
```

### Frontend `.env.example`

```env
VITE_API_BASE_URL="http://localhost:5000/api"
```

### Docker PostgreSQL Environment

The Docker PostgreSQL service uses local development values defined in `compose.yaml`.

---

<a id="docker-local-development"></a>

## 🐳 Docker Local Development

### Docker Scope

Docker is currently used for local PostgreSQL only.

The frontend and backend are still run directly with npm scripts during development.

### Docker Commands

Start PostgreSQL:

```bash
docker compose up -d
```

Check running containers:

```bash
docker compose ps
```

View logs:

```bash
docker compose logs
```

Stop containers:

```bash
docker compose down
```

Reset local database volume:

```bash
docker compose down -v
```

### Expected Docker Files

```text
compose.yaml
docs/docker/DOCKER.md
```

---

<a id="development-workflow"></a>

## 🌿 Development Workflow

### Branches

Main branch logic:

* `main`: stable final branch;
* `develop`: integration branch;
* `S1`, `S2`, `S3`, `S4`, `S5`: historical sprint branches used during staged development;
* feature, fix, docs and visual branches: scoped branches created from `develop` unless a temporary integration branch is explicitly announced.

Branch naming examples:

```text
setup/s1-04-project-structure
backend/s2-01-health-route
database/s2-02-prisma-schema
frontend/s3-01-routing-map
```

### Pull Requests

Pull request rules:

* one PR per issue or small group of closely related tasks;
* PR targets `develop` unless a temporary integration branch is explicitly announced;
* PR title follows the project convention;
* PR description summarizes changes and validation;
* PR references the related issue;
* PR is reviewed before merge.

---

<a id="github-project-workflow"></a>

## 📊 GitHub Project Workflow

### Project Columns

The project board uses columns such as:

* Backlog;
* Sprint;
* To Do;
* In Progress;
* Review;
* Done;
* Blocked;
* Parking Lot.

### Issue Tracking Rules

Each issue should include:

* clear title;
* user story or purpose;
* acceptance criteria;
* technical notes;
* validation steps;
* assignee;
* reviewer when applicable;
* sprint label;
* priority label.

### Review Logic

Review should verify:

* scope alignment;
* code quality;
* naming consistency;
* documentation updates;
* lint/build/test results;
* no accidental generated or local files committed.

---

<a id="testing-strategy"></a>

## 🧪 Testing Strategy

### Manual Testing

Manual testing is used to validate core MVP flows during development:

* run the backend;
* run the frontend;
* test API routes with Postman;
* test frontend flows in the browser;
* verify expected errors and empty states.

### Backend Testing

Backend testing includes:

* route availability;
* response format;
* status codes;
* validation errors;
* authentication requirements;
* role-based access control.

### API Testing

API testing uses:

* Postman collections;
* Swagger UI;
* manual curl commands;
* backend validation scripts where relevant.

### Integration Testing

Integration testing focuses on:

* frontend calling backend API;
* frontend environment variable configuration;
* authentication flow;
* protected routes;
* supplier and store workflows;
* product and request workflows.

---

<a id="quality-and-review-process"></a>

## ✅ Quality and Review Process

Before a PR is considered ready:

* code must match the issue scope;
* `npm --prefix frontend run build` should pass for frontend changes;
* `npm --prefix frontend run lint` should pass for frontend changes;
* backend syntax checks or tests should pass for backend changes;
* documentation must be updated when relevant;
* README files must stay aligned with the current project state;
* no `.env`, `node_modules`, or build output should be committed accidentally;
* generated code, including Prisma output, should only be committed when it is intentionally part of the project structure and reviewed.

---

<a id="ai-assisted-working-method"></a>

## 🤖 AI-Assisted Working Method

AI tools are used as support for:

* planning;
* architecture review;
* documentation drafting;
* route and API consistency checks;
* code review preparation;
* debugging;
* learning and explanation.

### Main Uses of AI

* clarify tasks before coding;
* detect inconsistencies;
* prepare issue descriptions and PR descriptions;
* review documentation;
* propose implementation steps;
* support learning without replacing team understanding.

### Learning Principles

* the team should understand the code it ships;
* AI suggestions must be reviewed critically;
* no generated code should be merged blindly;
* explanations and validation matter as much as output.

### BMAD Working System

BMAD is used as a lightweight working method to separate product, technical, UX/UI, critical review, and orchestration perspectives when useful.

It helps the team challenge assumptions, avoid scope creep, and keep decisions aligned with the MVP.

### Responsible AI Usage

AI is used as an assistant, not as an owner of the project.

The team remains responsible for:

* technical decisions;
* code quality;
* final validation;
* project direction;
* documentation accuracy.

---

<a id="sprint-organization"></a>

## 📅 Sprint Organization

### Sprint Timeline

The Stage 4 implementation is organized into five sprints.

| Sprint   | Focus                                     |
| -------- | ----------------------------------------- |
| Sprint 1 | Project setup and foundations             |
| Sprint 2 | Backend MVP and database                  |
| Sprint 3 | Frontend foundation and MVP navigation    |
| Sprint 4 | Core MVP features                         |
| Sprint 5 | Tests, integration, demo and finalization |

### Sprint 1 — Project Setup and Foundations

Focus:

* repository setup;
* Git workflow;
* project structure;
* README foundation;
* team conventions.

### Sprint 2 — Backend MVP and Database

Focus:

* Express backend foundation;
* PostgreSQL and Prisma;
* MVP database schema;
* backend modules;
* API routes;
* Swagger documentation;
* authentication foundation.

### Sprint 3 — Frontend Foundation and MVP Navigation

Focus:

* frontend routing;
* application layout;
* authentication screens;
* supplier and store navigation;
* catalog and detail page foundations;
* request flow UI foundation.

### Sprint 4 — Core MVP Features

Focus:

* frontend/backend integration;
* product flow;
* supplier flow;
* store flow;
* contact request flow;
* role-based UI behavior.

### Sprint 5 — Tests, Integration, Demo and Finalization

Focus:

* bug fixing;
* QA;
* documentation polish;
* demo preparation;
* final review;
* portfolio delivery.

---

<a id="collaboration-model"></a>

## 🤝 Collaboration Model

The project is developed by a team of three Holberton students.

### Collaboration Principles

* shared understanding before implementation;
* clear issue ownership;
* regular review;
* small focused branches;
* direct communication when blocked;
* scope control.

### Shared Review Culture

The team reviews:

* code;
* documentation;
* architecture decisions;
* API consistency;
* UI consistency;
* sprint progress.

### Learning Goal

The project is not only about shipping a working MVP.

It is also used to demonstrate:

* teamwork;
* planning;
* technical growth;
* full-stack development;
* product thinking;
* professional documentation.

---

<a id="team"></a>

## 👨‍💻 Team

| Name            | Main Role                                                |
| --------------- | -------------------------------------------------------- |
| Antoine Gousset | Project lead, product direction, full-stack contribution |
| Yonas Houriez   | Backend lead                                             |
| Gwendal Boisard | Frontend lead                                            |

---

<a id="authors"></a>

## ✍️ Authors

* [Antoine Gousset](https://github.com/Antgst)
* [Yonas Houriez](https://github.com/Ausaryu)
* [Gwendal Boisard](https://github.com/Gwendal-B)

---

<a id="project-links"></a>

## 🔗 Project Links

| Resource             | Link                                        |
| -------------------- | ------------------------------------------- |
| GitHub Repository    | https://github.com/Antgst/Kerno-MVP         |
| GitHub Project Board | https://github.com/users/Antgst/projects/1/views/1 |
| Stage 3 mockups      | https://canva.link/qqyguvw0uxid4ys          |
| Stage 3 report — EN  | https://canva.link/85zocsxjseziifk          |

---

<a id="license"></a>

## 📄 License

No open-source license is granted at this stage.

This repository is currently developed for educational purposes as part of the Holberton School portfolio process. Unless a specific license is added later, the source code, documentation, product concept, mockups, brand elements, architecture decisions, and related materials remain protected and may not be copied, reused, redistributed, or commercially exploited without prior written permission from the project owner and relevant contributors.

---

<a id="project-origin-and-intellectual-property-notice"></a>

## 🔒 Project Origin and Intellectual Property Notice

Kerno was initiated by Antoine Gousset as a future entrepreneurial project.

The Holberton Stage 4 implementation is used to build and demonstrate a functional MVP, but the project is also intended to serve as the foundation for a potential real-world business initiative after the portfolio phase.

All rights are reserved.

This includes, without limitation:

* the product idea and business positioning,
* the Kerno name and brand direction,
* the MVP scope and functional structure,
* the marketplace concept connecting suppliers and retail stores,
* the documentation and mockups,
* the application architecture and database design,
* the source code and implementation work produced in this repository.

No transfer of ownership, commercial usage right, or reuse permission is granted by the publication of this repository.

Any reuse, reproduction, distribution, derivative work, public presentation, or commercial exploitation of this project or its materials requires prior written authorization.

This notice does not replace formal legal protection such as trademark registration, copyright enforcement, or patent filing where applicable. It states the ownership intent and rights reservation attached to the project and its materials.
