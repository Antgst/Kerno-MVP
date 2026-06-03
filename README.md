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

- [⚡ At a Glance](#at-a-glance)
- [💡 Key Value Proposition](#key-value-proposition)
- [📌 Project Overview](#project-overview)
- [🧩 Problem Statement](#problem-statement)
- [🚀 Product Vision](#product-vision)
- [🎯 MVP Scope](#mvp-scope)
- [🧮 MoSCoW Prioritization](#moscow-prioritization)
- [🚫 Out of Scope](#out-of-scope)
- [🛣️ Future Evolutions](#future-evolutions)
- [👥 User Roles](#user-roles)
- [🧭 Main User Journey](#main-user-journey)
- [🖥️ Core Features](#core-features)
- [🎨 Mockups and Product Screens](#mockups-and-product-screens)
- [🧱 Tech Stack](#tech-stack)
- [🏗️ Application Architecture](#application-architecture)
- [🧩 Backend Modules](#backend-modules)
- [🗄️ Database Design](#database-design)
- [🔌 API Overview](#api-overview)
- [📁 Repository Structure](#repository-structure)
- [⚙️ Getting Started](#getting-started)
- [🔐 Environment Variables](#environment-variables)
- [🐳 Docker Local Development](#docker-local-development)
- [🌿 Development Workflow](#development-workflow)
- [📊 GitHub Project Workflow](#github-project-workflow)
- [🧪 Testing Strategy](#testing-strategy)
- [✅ Quality and Review Process](#quality-and-review-process)
- [🤖 AI-Assisted Working Method](#ai-assisted-working-method)
- [📅 Sprint Organization](#sprint-organization)
- [🤝 Collaboration Model](#collaboration-model)
- [👨‍💻 Team](#team)
- [✍️ Authors](#authors)
- [🔗 Project Links](#project-links)
- [📄 License](#license)
- [🔒 Project Origin and Intellectual Property Notice](#project-origin-and-intellectual-property-notice)

---

<a id="at-a-glance"></a>

## ⚡ At a Glance

| Item | Description |
|---|---|
| Project type | B2B SaaS marketplace MVP |
| Target users | Direct/local suppliers and retail stores |
| Core value | Supplier discovery and structured first contact |
| Main business action | Store sends a contact or quote request |
| MVP focus | Profiles, products, search, detail pages, requests |
| Frontend | React, JavaScript, Vite, Tailwind CSS |
| Backend | Node.js, Express, JavaScript |
| Database | PostgreSQL with Prisma ORM |
| Local infrastructure | Docker Compose for PostgreSQL local development |
| API | REST |
| Documentation | README, CONTRIBUTING, API docs, architecture, database, test plan |
| Portfolio stage | Holberton Stage 4 MVP implementation |

---

<a id="key-value-proposition"></a>

## 💡 Key Value Proposition

Kerno helps suppliers become visible and helps stores discover relevant product offers faster.

### For suppliers

- create a professional company profile;
- publish structured product offers;
- increase visibility to retail buyers;
- receive contact or quote requests from interested stores.

### For stores

- search for products or suppliers from one place;
- use simple filters to reduce sourcing time;
- compare essential supplier and product information;
- send clear and structured contact or quote requests.

Kerno does not replace the full purchasing process in the MVP. It focuses on making the first business connection simpler, clearer, and more professional.

---

<a id="project-overview"></a>

## 📌 Project Overview

Kerno is a B2B SaaS marketplace MVP that connects direct or local suppliers with retail stores.

The goal is to simplify supplier discovery, improve product visibility, and structure the first business contact between suppliers and stores.

The MVP does not aim to cover the full purchasing process. Instead, it focuses on product discovery and initial contact:

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

This project is developed as part of the Holberton School portfolio process and must demonstrate:

- a functional MVP,
- clean code organization,
- a professional GitHub repository,
- clear documentation,
- application architecture,
- database design,
- testing evidence,
- team collaboration,
- Git and GitHub best practices.

---

<a id="problem-statement"></a>

## 🧩 Problem Statement

Retail stores often need to find direct, local, regional, or specialized suppliers, but supplier discovery can be fragmented, time-consuming, and poorly structured.

At the same time, smaller suppliers need visibility and a simple way to present their products to potential retail buyers.

Kerno addresses this gap by providing a structured marketplace where:

- suppliers can create a credible profile,
- suppliers can publish product offers,
- stores can search and filter suppliers or products,
- stores can consult detail pages before contacting a supplier,
- stores can send structured contact or quote requests,
- suppliers can receive and review incoming requests.

---

<a id="product-vision"></a>

## 🚀 Product Vision

Kerno aims to become a simple, professional, and scalable sourcing platform for retail stores and suppliers.

The first version is intentionally limited to the core value proposition:

> supplier visibility + product discovery + structured first contact.

Future versions may expand the platform with more advanced features, but the MVP remains focused on validating the central business flow before introducing transactional complexity.

---

<a id="mvp-scope"></a>

## 🎯 MVP Scope

The MVP covers the minimum functional scope required to validate the product value.

### Must Have

- Landing page presenting Kerno and its value proposition
- User registration and login
- Role-based access: supplier or store
- Supplier profile creation and edition
- Store profile creation and edition
- Supplier product creation and management
- Product and supplier catalog
- Search and simple filters
- Product detail page
- Supplier detail page
- Structured contact or quote request form
- Supplier view of received requests
- Store view of sent requests
- Simple request status tracking
- Basic dashboards for suppliers and stores

### Should Have

- Supplier dashboard overview
- Store dashboard overview
- Profile completion indicators
- Simple request follow-up
- Clear onboarding progression

### Could Have

These features may be considered only if the MVP scope is already stable:

- basic recommendations,
- contextual help messages,
- simple product quality hints,
- related product suggestions,
- light supplier activity indicators.

### Won't Have / Not for MVP

These features are deliberately excluded from the MVP and must not be implemented during the first version:

- online payment;
- shopping cart;
- full ordering process;
- delivery or logistics tracking;
- invoicing;
- advanced internal messaging;
- public reviews and ratings;
- advanced analytics;
- complex subscription plans.

These exclusions protect the project from scope drift and keep the MVP focused on the validated value chain: supplier visibility, product discovery, and structured first contact.

---

<a id="moscow-prioritization"></a>

## 🧮 MoSCoW Prioritization

The MVP scope is organized according to the MoSCoW method used during Stage 3.

| Priority | Count | Role in the MVP |
|---|---:|---|
| Must Have | 15 | Covers the complete minimum process: registration, profiles, products, search, detail pages, contact request, and request reception |
| Should Have | 5 | Improves readability, tracking, and simple organization of supplier and store journeys |
| Could Have | 5 | Adds user convenience without blocking MVP validation |
| Won't Have | 8 | Groups excluded features to avoid scope drift and keep the MVP realistic |

### Must Have Summary

The Must Have scope is the foundation of the MVP. It includes:

- account creation and login;
- supplier and store role selection;
- supplier profile creation;
- store profile creation;
- product creation and management;
- catalog search and simple filters;
- product and supplier detail pages;
- structured contact or quote request;
- supplier-side received requests;
- store-side sent requests.

### Should Have Summary

The Should Have scope improves the usability of the MVP without changing its core purpose:

- supplier dashboard;
- store dashboard;
- profile completion indicators;
- simple request tracking;
- clearer onboarding guidance.

### Could Have Summary

The Could Have scope can be considered only if the core MVP is stable:

- recommended suppliers;
- simple product indicators;
- related product suggestions;
- contextual help messages;
- incomplete product indicators.

### Won't Have Summary

The Won't Have scope is intentionally excluded from the MVP:

- payment;
- cart;
- complete ordering;
- delivery and logistics;
- invoicing;
- advanced messaging;
- reviews and ratings;
- advanced analytics;
- complex subscriptions.

---

<a id="out-of-scope"></a>

## 🚫 Out of Scope

The following features are intentionally excluded from the MVP to prevent scope drift:

- online payment,
- shopping cart,
- full order management,
- delivery or logistics tracking,
- invoicing,
- advanced internal messaging,
- public reviews and ratings,
- advanced analytics,
- complex subscription plans,
- heavy admin back office,
- mandatory external API integrations,
- multi-store organization management,
- advanced permission systems.

The MVP is not a complete e-commerce platform. It is a sourcing and first-contact platform.

Some excluded features may become relevant in V2 or V3, but they must not be implemented before the core MVP has been validated.

---

<a id="future-evolutions"></a>

## 🛣️ Future Evolutions

The MVP is intentionally limited, but the product vision can evolve after the first validated version.

The following ideas are not part of the initial MVP. They are possible future directions that may be considered only after the core flow is functional, tested, and validated.

### V2 — Product and User Experience Improvements

A V2 could improve the usability and business value of the platform without transforming it into a full transactional marketplace.

Potential V2 improvements:

- supplier recommendations based on store needs;
- related product suggestions;
- improved search and filter experience;
- profile completion scoring;
- product quality indicators;
- simple notifications for received or sent requests;
- better request follow-up without advanced messaging;
- supplier badges or trust indicators;
- certifications or quality labels;
- richer supplier and product pages;
- light dashboard indicators for suppliers and stores;
- saved searches or simple bookmarks if they do not slow down the MVP.

The goal of V2 would be to improve discovery, credibility, and follow-up while keeping the platform simple.

### V3 — Business and Marketplace Expansion

A V3 could explore more advanced business features if the MVP proves that stores and suppliers actually use the platform and find value in the first-contact workflow.

Potential V3 evolutions:

- advanced messaging between stores and suppliers;
- public reviews and ratings;
- advanced supplier analytics;
- subscription plans;
- premium supplier visibility;
- store organization and multi-user access;
- advanced admin back office;
- external APIs for location, maps, or data enrichment;
- supplier website generation or supplier mini-pages;
- document management for product sheets, certifications, or commercial files;
- order, payment, delivery, or invoicing features only if the business model requires them.

These features must not be implemented too early because they would increase complexity before the core value proposition is validated.

### Long-Term Product Direction

Long term, Kerno could become a broader B2B sourcing platform for retail professionals.

Possible directions:

- local and regional supplier discovery;
- specialized supplier marketplaces by product category;
- supplier qualification and certification;
- sourcing workflow management;
- data-driven recommendations;
- marketplace SaaS subscriptions;
- supplier visibility services;
- tools for retail buyers to structure supplier research.

This long-term vision remains secondary during Stage 4. The current priority is still the MVP: supplier profiles, products, search, detail pages, and structured contact or quote requests.

---

<a id="user-roles"></a>

## 👥 User Roles

### Visitor

A visitor can:

- understand the value proposition,
- choose between a supplier journey and a store journey,
- access registration or login.

### Supplier

A supplier can:

- create an account,
- create and update a supplier profile,
- add and manage products,
- view received contact or quote requests,
- review the details of a request sent by a store.

### Store

A store user can:

- create an account,
- create and update a store profile,
- search for products or suppliers,
- use simple filters,
- view supplier and product detail pages,
- send a structured contact or quote request,
- view sent requests and their simple status.

---

<a id="main-user-journey"></a>

## 🧭 Main User Journey

```mermaid
flowchart TD
    A[Visitor lands on Kerno] --> B{Choose user role}

    B --> C[Supplier registration / login]
    B --> D[Store registration / login]

    C --> E[Supplier creates profile]
    E --> F[Supplier adds products]
    F --> G[Products become visible in catalog]

    D --> H[Store creates profile]
    H --> I[Store searches products or suppliers]
    I --> J[Store views product details]
    J --> K[Store views supplier details]
    K --> L[Store sends contact or quote request]

    L --> M[Backend records request]
    M --> N[Supplier receives request]
    N --> O[Supplier reviews request details]
```

---

<a id="core-features"></a>

## 🖥️ Core Features

### Authentication

- User registration
- User login
- Role selection: supplier or store
- Protected routes
- Role-based access control

### Supplier Profile

- Company name
- Business type
- Location
- Description
- Contact information
- Optional website
- Supplier public detail page

### Store Profile

- Store name
- Brand or structure
- Store type
- Location
- Sourcing needs
- Contact information

### Product Management

- Product creation
- Product edition
- Product visibility status
- Category association
- Product description
- Origin or production area
- Optional image
- Simple commercial information

### Catalog and Search

- Product and supplier listing
- Keyword search
- Simple filters
- Supplier cards
- Product cards
- Links to detail pages

### Contact and Quote Requests

- Structured request form
- Supplier targeted by the request
- Optional product targeted by the request
- Subject and message
- Optional requested quantity
- Store contact details
- Simple request status
- Supplier-side received requests
- Store-side sent requests

---

<a id="mockups-and-product-screens"></a>

## 🎨 Mockups and Product Screens

The Stage 3 documentation defines 15 main screens used as a visual basis for the MVP.

| Screen | Name | Purpose |
|---:|---|---|
| 01 | Landing page | Present Kerno and guide users to the right journey |
| 02 | Login / Registration | Allow users to create an account or log in based on their role |
| 03 | Supplier dashboard | Give suppliers a simple overview of profile, products, and requests |
| 04 | Supplier profile form | Collect professional supplier information |
| 05 | Add product | Allow suppliers to publish structured product offers |
| 06 | Supplier product management | Allow suppliers to manage their products |
| 07 | Supplier received requests | Centralize contact or quote requests received by suppliers |
| 08 | Store dashboard | Give stores a quick overview of sourcing activity |
| 09 | Store profile form | Collect professional store information |
| 10 | Catalog / supplier search | Allow stores to search and filter products or suppliers |
| 11 | Supplier detail page | Help stores evaluate a supplier before contact |
| 12 | Product detail page | Help stores evaluate a product before sending a request |
| 13 | Request for quote / contact | Allow stores to send structured requests |
| 14 | Store sent requests | Allow stores to track sent requests |
| 15 | Received request detail | Allow suppliers to understand store needs before responding |

---

<a id="tech-stack"></a>

## 🧱 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React | Build a component-based user interface |
| Frontend | JavaScript | Keep a simple and consistent language across the stack |
| Frontend | Vite | Fast frontend development and build tooling |
| Frontend | Tailwind CSS | Rapid and consistent UI styling |
| Backend | Node.js | JavaScript runtime for the API |
| Backend | Express | Lightweight REST API framework |
| Database | PostgreSQL | Relational database for structured business data |
| Local infrastructure | Docker Compose | Shared local PostgreSQL environment for the team |
| ORM | Prisma | Database modeling, migrations, and queries |
| API | REST | Simple communication between frontend and backend |
| API Docs | OpenAPI / Swagger | Lightweight route documentation and testing support |
| Auth | JWT or simple session | User authentication and route protection |
| Architecture | Modular monolith | Simple architecture with clear module separation |

The stack is intentionally classic, readable, and realistic for an MVP built by a small team.

---

<a id="application-architecture"></a>

## 🏗️ Application Architecture

Kerno uses a classic three-layer web architecture:

1. **Frontend**: React application used by visitors, suppliers, and stores.
2. **Backend**: Node.js / Express REST API containing business logic.
3. **Database**: PostgreSQL database accessed through Prisma ORM.

```mermaid
flowchart LR
    U[Web browser user] --> F[Frontend<br/>React + JavaScript + Vite + Tailwind CSS]
    F -->|HTTP / JSON via REST API| B[Backend<br/>Node.js + Express + JavaScript]

    B --> A[Auth module]
    B --> US[Users module]
    B --> SP[Suppliers module]
    B --> ST[Stores module]
    B --> P[Products module]
    B --> R[Requests module]

    A --> PR[Prisma ORM]
    US --> PR
    SP --> PR
    ST --> PR
    P --> PR
    R --> PR

    PR --> DB[(PostgreSQL database)]

    DOC[OpenAPI / Swagger documentation] -.-> B
```

### Architecture Principles

- Keep the application simple and explainable.
- Avoid microservices for the MVP.
- Separate responsibilities by backend modules.
- Keep business logic in backend services.
- Keep the frontend focused on UI, navigation, forms, and API consumption.
- Use REST endpoints that are easy to test and document.
- Keep deployment simple with separated frontend, backend, and hosted PostgreSQL database.
- Use Docker Compose to standardize the local PostgreSQL environment during development.

---

<a id="backend-modules"></a>

## 🧩 Backend Modules

The backend is organized as a modular monolith.

### Auth Module

Responsibilities:

- user registration,
- login,
- password verification,
- token or session generation,
- current user retrieval,
- route protection,
- role-based access.

### Users Module

Responsibilities:

- store common user information,
- manage user roles,
- retrieve connected user information,
- update general account data.

### Suppliers Module

Responsibilities:

- create and update supplier profiles,
- display public supplier pages,
- search or list suppliers,
- associate suppliers with products,
- provide supplier dashboard data.

### Stores Module

Responsibilities:

- create and update store profiles,
- display store information when a request is received,
- provide store dashboard data,
- list requests sent by a store.

### Products Module

Responsibilities:

- create products,
- update products,
- deactivate products,
- display products in the catalog,
- filter products by simple criteria,
- display product detail pages.

### Requests Module

Responsibilities:

- create contact or quote requests,
- associate requests with stores, suppliers, and optionally products,
- allow suppliers to view received requests,
- allow stores to view sent requests,
- manage a simple request status,
- check request ownership and access rights.

---

<a id="database-design"></a>

## 🗄️ Database Design

Kerno uses PostgreSQL with Prisma ORM.

The MVP database stores:

- users,
- supplier profiles,
- store profiles,
- categories,
- products,
- contact requests.

### Main Tables

| Table | Purpose |
|---|---|
| `users` | Stores common account data and role |
| `supplier_profiles` | Stores professional supplier information |
| `store_profiles` | Stores professional store information |
| `categories` | Structures product catalog and filters |
| `products` | Stores products published by suppliers |
| `contact_requests` | Stores contact or quote requests sent by stores |

### Main Relationships

- A user can have one supplier profile.
- A user can have one store profile.
- A supplier can publish many products.
- A category can contain many products.
- A store can send many contact requests.
- A supplier can receive many contact requests.
- A product can be linked to many contact requests.
- A contact request can optionally concern a specific product.

### Database Diagram

```mermaid
erDiagram
    USERS ||--o| SUPPLIER_PROFILES : owns
    USERS ||--o| STORE_PROFILES : owns
    SUPPLIER_PROFILES ||--o{ PRODUCTS : publishes
    CATEGORIES ||--o{ PRODUCTS : classifies
    STORE_PROFILES ||--o{ CONTACT_REQUESTS : sends
    SUPPLIER_PROFILES ||--o{ CONTACT_REQUESTS : receives
    PRODUCTS ||--o{ CONTACT_REQUESTS : concerns

    USERS {
        uuid id PK
        string email
        string password_hash
        string role
        string first_name
        string last_name
        datetime created_at
        datetime updated_at
    }

    SUPPLIER_PROFILES {
        uuid id PK
        uuid user_id FK
        string company_name
        text description
        string location
        string business_type
        string contact_email
        string phone
        string website
        datetime created_at
        datetime updated_at
    }

    STORE_PROFILES {
        uuid id PK
        uuid user_id FK
        string store_name
        string brand_name
        string location
        string store_type
        text sourcing_needs
        string contact_email
        string phone
        datetime created_at
        datetime updated_at
    }

    CATEGORIES {
        uuid id PK
        string name
        text description
        datetime created_at
        datetime updated_at
    }

    PRODUCTS {
        uuid id PK
        uuid supplier_id FK
        uuid category_id FK
        string name
        text description
        string price_info
        string minimum_order
        string origin
        string image_url
        boolean is_active
        datetime created_at
        datetime updated_at
    }

    CONTACT_REQUESTS {
        uuid id PK
        uuid store_id FK
        uuid supplier_id FK
        uuid product_id FK
        string subject
        text message
        string requested_quantity
        string status
        datetime created_at
        datetime updated_at
    }
```

---

<a id="api-overview"></a>

## 🔌 API Overview

The backend exposes a REST API.

The API is documented progressively with OpenAPI / Swagger.

### Swagger Documentation

When the backend server is running, the Swagger UI is available at:

```text
http://localhost:3000/api/docs
```

The raw OpenAPI JSON specification is available at:

```text
http://localhost:3000/api/openapi.json
```

The current Swagger document is defined in `backend/src/config/swagger.js` and mounted from `backend/src/app.js`.

### Planned Main Endpoints

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| `GET` | `/api/health` | Check API health | Public |
| `GET` | `/api/docs` | Open Swagger UI documentation | Public |
| `GET` | `/api/openapi.json` | Retrieve raw OpenAPI specification | Public |
| `POST` | `/api/auth/register` | Register a new user | Public |
| `POST` | `/api/auth/login` | Log in a user | Public |
| `GET` | `/api/auth/me` | Retrieve current user | Authenticated |
| `GET` | `/api/users/me` | Retrieve connected account data | Authenticated |
| `POST` | `/api/suppliers/profile` | Create supplier profile | Supplier |
| `GET` | `/api/suppliers/me` | Retrieve own supplier profile | Supplier |
| `PATCH` | `/api/suppliers/me` | Update own supplier profile | Supplier |
| `GET` | `/api/suppliers` | List or search suppliers | Authenticated |
| `GET` | `/api/suppliers/:id` | Retrieve supplier details | Authenticated |
| `POST` | `/api/stores/profile` | Create store profile | Store |
| `GET` | `/api/stores/me` | Retrieve own store profile | Store |
| `PATCH` | `/api/stores/me` | Update own store profile | Store |
| `GET` | `/api/products` | List or search products | Authenticated |
| `POST` | `/api/products` | Create product | Supplier |
| `GET` | `/api/products/:id` | Retrieve product details | Authenticated |
| `PATCH` | `/api/products/:id` | Update product | Supplier owner |
| `DELETE` | `/api/products/:id` | Deactivate product | Supplier owner |
| `POST` | `/api/requests` | Send contact or quote request | Store |
| `GET` | `/api/requests/sent` | View sent requests | Store |
| `GET` | `/api/requests/received` | View received requests | Supplier |
| `GET` | `/api/requests/:id` | View request details | Owner |
| `PATCH` | `/api/requests/:id/status` | Update request status | Supplier |

---

<a id="repository-structure"></a>

## 📁 Repository Structure

Target structure:

```text
kerno-mvp/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── config/
│   │   │   └── swagger.js
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── suppliers/
│   │   │   ├── stores/
│   │   │   ├── products/
│   │   │   └── requests/
│   │   ├── middlewares/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── .env.example
│
├── docs/
│   ├── assets/
│   │   └── kerno-logo.png
│   ├── docker/
│   │   └── DOCKER.md
│   ├── API.md
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   ├── TEST_PLAN.md
│   └── SPRINT_NOTES.md
│
├── compose.yaml
├── .dockerignore
│
├── .github/
│   └── pull_request_template.md
│
├── CONTRIBUTING.md
├── README.md
├── .gitignore
└── LICENSE
```

This structure may evolve during implementation, but the separation between frontend, backend, and documentation must remain clear.

---

<a id="getting-started"></a>

## ⚙️ Getting Started

> The project is under active development. Setup commands may evolve as the frontend and backend foundations are created.

### Prerequisites

Recommended tools:

- Node.js 20.x
- npm
- Docker Desktop or Docker Engine with Docker Compose, recommended for local PostgreSQL
- PostgreSQL, only if Docker Compose is not used
- Git
- VS Code or equivalent editor
- Postman or equivalent API testing tool

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
npm run dev
```

Once the backend is running, you can access:

- API health check: `http://localhost:3000/api/health`
- Swagger UI: `http://localhost:3000/api/docs`
- OpenAPI JSON: `http://localhost:3000/api/openapi.json`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

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
PORT=3000
DATABASE_URL="postgresql://kerno_user:kerno_password@localhost:5432/kerno_db"
JWT_SECRET="replace_with_local_secret"
NODE_ENV="development"
```

### Frontend `.env.example`

```env
VITE_API_BASE_URL="http://localhost:3000/api"
```

### Docker PostgreSQL Environment

The Docker PostgreSQL service uses local development values only.

```env
POSTGRES_USER=kerno_user
POSTGRES_PASSWORD=kerno_password
POSTGRES_DB=kerno_db
```

When the backend runs outside Docker, the backend `DATABASE_URL` should point to `localhost`:

```env
DATABASE_URL="postgresql://kerno_user:kerno_password@localhost:5432/kerno_db"
```

If the backend is dockerized later, the host may change from `localhost` to the Docker service name:

```env
DATABASE_URL="postgresql://kerno_user:kerno_password@postgres:5432/kerno_db"
```

Real `.env` files must never be committed.

---

<a id="docker-local-development"></a>

## 🐳 Docker Local Development

Docker Compose is included to standardize the local development infrastructure.

For the first MVP implementation, Docker is mainly used for PostgreSQL. The backend and frontend can still run locally with standard npm commands.

### Docker Scope

Initial Docker scope:

- provide a local PostgreSQL service;
- keep database configuration consistent across the team;
- support Prisma setup and migrations;
- avoid requiring each team member to manually install and configure PostgreSQL in the same way.

Out of scope for the initial Docker setup:

- production deployment;
- Docker image publishing;
- Kubernetes;
- CI/CD;
- mandatory backend containerization;
- mandatory frontend containerization.

### Docker Commands

Start local services:

```bash
docker compose up -d
```

Check running services:

```bash
docker compose ps
```

Read service logs:

```bash
docker compose logs
```

Stop local services:

```bash
docker compose down
```

Reset local database data:

```bash
docker compose down -v
```

> Warning: `docker compose down -v` removes local Docker volumes and deletes local PostgreSQL data.

### Expected Docker Files

```text
compose.yaml
.dockerignore
docs/docker/DOCKER.md
```

The Docker documentation can be expanded progressively when PostgreSQL, Prisma, and local database workflows are implemented.

---

<a id="development-workflow"></a>

## 🌿 Development Workflow

The project uses a Git workflow based on `main`, `develop`, and short-lived branches.

### Branches

- `main`: stable branch
- `develop`: integration branch
- `feature/...`: new feature branch
- `fix/...`: bug fix branch
- `docs/...`: documentation branch
- `setup/...`: setup branch

### Pull Requests

Every meaningful change must go through a pull request into `develop`.

A pull request must include:

- summary,
- related issue,
- MVP area,
- changes made,
- tests performed,
- points to review,
- out-of-scope check.

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for the full workflow.

---

<a id="github-project-workflow"></a>

## 📊 GitHub Project Workflow

The team uses GitHub Projects to track the technical execution of the Kerno MVP.

The GitHub Project board is used to:

- centralize all sprint issues;
- track task progress;
- make blockers visible;
- organize reviews;
- keep implementation aligned with the MVP scope;
- prepare evidence for the final technical review.

### Project Columns

| Column | Meaning |
|---|---|
| Todo | Issue is defined but not started |
| In Progress | Issue is actively being worked on |
| Review | Work is ready for review or team validation |
| Blocked | Issue cannot progress because of a dependency, decision, or technical blocker |
| Done | Issue is completed, reviewed, and validated |
| Parking Lot | Useful reference, idea, or future improvement not planned for immediate implementation |

### Issue Tracking Rules

Each issue should include:

- a clear objective;
- technical or functional scope;
- responsibilities;
- expected outcome;
- definition of done;
- checklist;
- labels;
- assignees when relevant;
- link to the sprint or project area.

### Review Logic

An issue should not move to `Done` only because code was written. It must be reviewed, tested when relevant, and aligned with the expected MVP scope.

For team-level issues, group validation is required before moving the card to `Done`.

---

<a id="testing-strategy"></a>

## 🧪 Testing Strategy

Testing is planned progressively during the MVP development.

### Manual Testing

Manual tests will validate:

- navigation,
- forms,
- dashboards,
- catalog display,
- product and supplier detail pages,
- contact request submission,
- request visibility for suppliers and stores.

### Backend Testing

Backend tests should verify:

- route responses,
- input validation,
- authentication behavior,
- role-based access,
- database operations,
- request ownership rules.

### API Testing

Postman or an equivalent tool will be used to test:

- authentication endpoints,
- supplier profile endpoints,
- store profile endpoints,
- product endpoints,
- search endpoints,
- contact request endpoints.

### Integration Testing

Integration tests must verify that:

- the frontend correctly communicates with the backend API,
- database operations work as expected,
- protected routes behave correctly,
- the main MVP journey works end-to-end.

Main end-to-end path:

```text
register/login
→ create supplier profile
→ add product
→ create store profile
→ search product
→ view product details
→ send request
→ supplier views received request
```

---

<a id="quality-and-review-process"></a>

## ✅ Quality and Review Process

The project must remain ready for a technical manual review.

Quality expectations:

- readable code,
- clear file structure,
- meaningful commits,
- pull requests before merge,
- code review by at least one teammate,
- MVP scope respected,
- no secrets committed,
- documentation updated when needed,
- tests or manual checks documented.

Review focus:

- Is the feature aligned with the MVP?
- Is the code understandable?
- Are responsibilities correctly separated?
- Is the API behavior predictable?
- Are edge cases handled?
- Is the database usage coherent?
- Can the team explain the implementation?

---

<a id="ai-assisted-working-method"></a>

## 🤖 AI-Assisted Working Method

AI is used in this project as a learning, productivity, documentation, and review support tool.

The goal is not to replace the team's technical understanding. The goal is to accelerate learning, improve structure, challenge decisions, and help the team produce clearer deliverables.

### Main Uses of AI

AI may be used to support:

- understanding technical concepts;
- breaking down complex tasks;
- improving documentation quality;
- preparing issue descriptions;
- reviewing README and project structure;
- identifying missing acceptance criteria;
- suggesting test scenarios;
- helping debug errors;
- comparing implementation choices;
- preparing explanations for technical review.

### Learning Principles

The team must stay able to explain every part of the project.

AI-generated suggestions must be:

- reviewed by the team;
- adapted to the actual project context;
- tested when they affect code;
- rejected when they introduce unnecessary complexity;
- kept aligned with the MVP scope.

### BMAD Working System

The project also uses a structured AI-assisted working method inspired by the BMAD system.

In this context, BMAD is used as a project reasoning and orchestration support system. It helps the team separate product thinking, technical decisions, documentation, QA, backlog preparation, and review logic.

BMAD supports:

- scope control;
- MVP alignment;
- task breakdown;
- role clarification;
- documentation review;
- technical decision review;
- sprint preparation;
- risk identification.

It does not replace team ownership. Antoine remains the project initiator and project owner, while Yonas and Gwendal keep their technical responsibilities within the team.

### Responsible AI Usage

The team does not treat AI output as automatically correct.

Every important suggestion must be checked against:

- the Stage 3 documentation;
- the Stage 4 requirements;
- the actual repository;
- the team's technical level;
- the MVP scope;
- implementation constraints.

The objective is to use AI as a professional assistant while keeping full human control over the project.

---

<a id="sprint-organization"></a>

## 📅 Sprint Organization

The project is organized into five short sprints.

The sprint plan follows the Stage 4 objective: breaking down user stories into manageable development tasks, assigning responsibilities, identifying dependencies, tracking progress, reviewing completed work, and preparing the final technical review.

### Sprint Timeline

| Sprint | Dates | Main Focus | Main Driver(s) |
|---|---|---|---|
| Sprint 1 | 25 May 2026 → 5 June 2026 | Project setup, Git workflow, README, repository structure, backend/frontend foundations | Antoine, with support from Yonas and Gwendal |
| Sprint 2 | 8 June 2026 → 12 June 2026 | Backend MVP, PostgreSQL, Prisma, authentication, API foundations | Yonas, with Antoine support |
| Sprint 3 | 15 June 2026 → 19 June 2026 | Frontend foundation, routing, layouts, main pages, MVP navigation | Gwendal, with Antoine support |
| Sprint 4 | 22 June 2026 → 30 June 2026 | Core MVP features, frontend/backend integration, main user journeys | Antoine, Yonas, Gwendal |
| Sprint 5 | 1 July 2026 → 3 July 2026 | Tests, integration, bug fixing, documentation, demo preparation, final review readiness | Full team |

### Sprint 1 — Project Setup and Foundations

Objective:

- create and prepare the repository;
- define the Git workflow;
- write the initial README;
- define the frontend/backend structure;
- initialize backend and frontend foundations;
- configure the GitHub Project workflow.

Expected outcome:

- clean repository;
- documented workflow;
- initial README;
- clear project structure;
- basic local startup path;
- team validation before deeper development.

### Sprint 2 — Backend MVP and Database

Objective:

- install and configure Prisma with PostgreSQL;
- create the MVP database schema;
- build the modular backend structure;
- implement authentication principles;
- prepare supplier, store, product, catalog, and request API foundations.

Expected outcome:

- backend structure aligned with the Stage 3 architecture;
- database models ready;
- first core API routes available;
- backend test strategy started.

### Sprint 3 — Frontend Foundation and MVP Navigation

Objective:

- create the frontend structure;
- configure routing and layouts;
- prepare reusable components;
- build placeholder pages;
- make supplier and store journeys navigable.

Expected outcome:

- navigable frontend skeleton;
- public, supplier, and store layouts;
- main MVP routes prepared;
- screens aligned with Stage 3 mockups.

### Sprint 4 — Core MVP Features

Objective:

- connect frontend and backend;
- implement the main supplier journey;
- implement the main store journey;
- make contact or quote requests functional;
- validate the end-to-end MVP flow.

Expected outcome:

- supplier can create a profile and add products;
- store can search products or suppliers;
- store can view details and send a request;
- supplier can view received requests;
- store can view sent requests.

### Sprint 5 — Tests, Integration, Demo and Finalization

Objective:

- stabilize the MVP;
- test the end-to-end flow;
- fix critical bugs;
- finalize documentation;
- prepare the final demonstration and technical review.

Expected outcome:

- functional MVP;
- clean repository;
- professional README;
- architecture and database documentation ready;
- testing evidence available;
- demo scenario prepared;
- each team member able to explain the project.

---

<a id="collaboration-model"></a>

## 🤝 Collaboration Model

Kerno is developed collaboratively by a three-person team.

The objective is not only to divide tasks, but also to make sure each team member learns as much as possible from the fullstack development process.

### Collaboration Principles

The team follows these principles:

- work from GitHub issues;
- use clear responsibilities for each task;
- keep the workload balanced;
- use pull requests for meaningful changes;
- review each other's work;
- discuss technical decisions as a group when needed;
- avoid isolated implementation choices;
- document important decisions;
- keep the MVP scope under control.

### Shared Review Culture

Reviews are used as a learning and quality process, not only as a validation step.

Each review should help the team check:

- whether the code is understandable;
- whether the implementation matches the issue;
- whether the MVP scope is respected;
- whether the feature is testable;
- whether the architecture remains coherent;
- whether the team can explain the choice during the final review.

### Learning Goal

Even when one member leads a specific area, the other members should understand the logic behind it.

- Yonas leads backend topics, but Antoine and Gwendal must understand the API and database decisions.
- Gwendal leads frontend topics, but Antoine and Yonas must understand the main user journeys and frontend integration.
- Antoine coordinates the product, documentation, and fullstack coherence, but the technical implementation must remain shared and reviewable.

The goal is to build a working MVP and to maximize collective learning.

---

<a id="team"></a>

## 👨‍💻 Team

| Member | Main Role | Responsibilities |
|---|---|---|
| Antoine Gousset | Project owner / Fullstack support | Project coordination, MVP coherence, documentation, review, fullstack contribution |
| Yonas Houriez | Backend lead | API, database, authentication, business logic, backend modules |
| Gwendal Boisard | Frontend lead | UI, React components, pages, user journeys, frontend integration |

The team works collaboratively, with shared reviews and cross-functional understanding of the MVP.

---

<a id="authors"></a>

## ✍️ Authors

| Name | GitHub | Project Contribution |
|---|---|---|
| Antoine Gousset | [Antgst](https://github.com/Antgst) | Project initiator, product vision, coordination, documentation, fullstack contribution |
| Yonas Houriez | [Ausaryu](https://github.com/Ausaryu) | Backend lead, API, database, authentication, backend implementation |
| Gwendal Boisard | [Gwendal-B](https://github.com/Gwendal-B) | Frontend lead, user interface, React pages, frontend implementation |

---

<a id="project-links"></a>

## 🔗 Project Links

| Resource | Link |
|---|---|
| GitHub repository | https://github.com/Antgst/Kerno-MVP |
| GitHub Project board | https://github.com/users/Antgst/projects/1/views/1 |
| Contribution guide | [CONTRIBUTING.md](./CONTRIBUTING.md) |
| Logo asset path | `docs/assets/kerno-logo.png` |
| API documentation | `docs/API.md` — coming soon |
| Architecture documentation | `docs/ARCHITECTURE.md` — coming soon |
| Database documentation | `docs/DATABASE.md` — coming soon |
| Test plan | `docs/TEST_PLAN.md` — coming soon |
| Stage 3 report — FR | https://canva.link/qqyguvw0uxid4ys |
| Stage 3 report — EN | https://canva.link/85zocsxjseziifk |

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

- the product idea and business positioning,
- the Kerno name and brand direction,
- the MVP scope and functional structure,
- the marketplace concept connecting suppliers and retail stores,
- the documentation and mockups,
- the application architecture and database design,
- the source code and implementation work produced in this repository.

No transfer of ownership, commercial usage right, or reuse permission is granted by the publication of this repository.

Any reuse, reproduction, distribution, derivative work, public presentation, or commercial exploitation of this project or its materials requires prior written authorization.

This notice does not replace formal legal protection such as trademark registration, copyright enforcement, or patent filing where applicable. It states the ownership intent and rights reservation attached to the project and its materials.
