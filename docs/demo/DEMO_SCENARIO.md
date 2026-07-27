# KERNO Demo Scenario

## 1. Purpose

This document describes the recommended demo flow for the KERNO MVP technical review.

The goal is to demonstrate the complete marketplace flow from both sides:

* supplier side;
* store side;
* product discovery;
* structured contact or quote request.

The demo should stay focused on the MVP scope and avoid presenting out-of-scope features as completed work.

---

## 2. Demo Goal

The demo must prove that KERNO can support its core value proposition:

> Help retail stores discover direct or local suppliers, browse products, and send structured contact or quote requests through a simple B2B marketplace interface.

---

## 3. Demo Preparation

Before starting the demo, make sure the following services are running:

### Backend

```bash
cd backend
npm run dev
```

Expected backend URL:

```text
http://localhost:5000
```

Expected API base path:

```text
http://localhost:5000/api
```

Swagger UI:

```text
http://localhost:5000/api/docs
```

---

### Frontend

```bash
cd frontend
npm run dev
```

Expected frontend URL:

```text
http://localhost:5173
```

---

### Database

PostgreSQL must be running and the Prisma migrations must be applied.

Useful commands:

```bash
cd backend
npx prisma validate
npx prisma migrate dev
```

Optional database inspection:

```bash
npx prisma studio
```

---

## 3.1 Presentation Roles and Rehearsal

### Speaking Parts

The final speaking parts are assigned as follows:

* **Antoine**: project introduction, main live demo driver, MVP scope, transitions and closing summary;
* **Gwendal**: frontend presentation, interface choices, user experience and visual support during the demo;
* **Yonas**: backend, API, database, security and technical support during the demo;
* **Full team**: questions, retrospective and final review.

### Rehearsal and Team Review

The complete demo flow has been rehearsed with the full team.

Following the rehearsal:

* the sequence and timing were reviewed;
* transitions between speakers were validated;
* the script was adjusted where necessary;
* demo accounts and seeded data were checked;
* backup steps were reviewed;
* MVP exclusions were validated;
* the final presentation flow was approved by the full team.

---

## 4. Demo Accounts

Use the accounts created by `backend/prisma/seed-demo.js`.

### Supplier Account

```text
Email: supplier1@kerno-demo.local
Password: Password123!
Role: SUPPLIER
Company: Brasserie du Littoral
Contact: Camille Le Gall
```

### Store Account

```text
Email: store1@kerno-demo.local
Password: Password123!
Role: STORE
Store: L'Épicerie du Marais
Contact: Claire Berthier
```

These accounts are prepared by the demo seed. Use the login page rather than registering new accounts during the presentation.

---

## 5. Demo Data

The following examples match the data created by `backend/prisma/seed-demo.js`.

### Supplier Profile Example

```text
Contact: Camille Le Gall
Company name: Brasserie du Littoral
Business type: Brasserie artisanale
Description: Brasserie familiale installée sur la côte atlantique, spécialisée dans les boissons artisanales élaborées à partir de fruits locaux.
Location: Nantes, Pays de la Loire, France
Phone: +33 2 40 11 22 33
Website: https://brasserie-du-littoral.example
Category: Boissons artisanales
```

### Product Example

```text
Name: Cidre doux fermier
Description: Cidre fermier élaboré à partir de pommes locales, fermentation lente en cuve.
Price: 4.50 EUR per unit
Minimum order: 24 units
Supplier: Brasserie du Littoral
Origin: Nantes, Pays de la Loire, France
Category: Boissons artisanales
Image: /assets/products/cidre-doux-fermier.webp
```

### Additional Product Examples

```text
Jus de pomme artisanal
Limonade au citron
```

### Store Profile Example

```text
Contact: Claire Berthier
Store name: L'Épicerie du Marais
Store type: Épicerie fine
Location: Paris, Île-de-France, France
Phone: +33 1 42 11 22 33
Sourcing needs: Recherche de producteurs locaux pour enrichir un rayon épicerie fine et boissons artisanales.
```

### Contact Request Example

```text
Product: Cidre doux fermier
Store: L'Épicerie du Marais
Supplier: Brasserie du Littoral
Subject: Demande de tarifs professionnels
Message: Bonjour, nous souhaiterions connaître vos tarifs professionnels ainsi que vos conditions de livraison pour un référencement en rayon.
Requested quantity: Commande initiale de lancement
```

---

## 6. Recommended Demo Flow

## Step 1 — Present the Landing Page

Open the frontend homepage.

```text
/
```

Explain:

* what KERNO is;
* who it is for;
* the two-sided marketplace logic;
* the MVP scope.

Expected result:

* the landing page is visible;
* the value proposition is understandable;
* navigation to login/register is available.

---

## Step 2 — Log In as Supplier

Go to:

```text
/login
```

Log in with the prepared supplier demo account.

Explain:

* the supplier role;
* the professional profile used to present the company;
* the product publication flow.

Expected result:

* the supplier account is authenticated;
* the user is redirected to the supplier dashboard;
* supplier profile, products and received requests are accessible.

---

## Step 3 — Create or Review Supplier Profile

Go to:

```text
/supplier/profile
```

Create or review the supplier profile using the demo data.

Explain:

* this profile represents the supplier company;
* it is used by stores to evaluate supplier credibility;
* it is part of the supplier discovery flow.

Expected result:

* supplier profile is created or displayed;
* profile data can be updated.

---

## Step 4 — Create or Review a Product

Go to:

```text
/supplier/products
```

Review the prepared product data. Product creation can also be demonstrated from the supplier product management page when required.

Explain:

* products are the core marketplace objects;
* each product belongs to a supplier;
* product information helps stores understand price, minimum order, category and origin.

Expected result:

* the prepared products are visible;
* the product detail can be opened;
* product creation and management remain available as part of the supplier journey.

---

## Step 5 — Review Supplier Product Management

Go to:

```text
/supplier/products
```

Explain:

* suppliers can review their published products;
* this screen is intentionally simple for the MVP;
* the MVP does not include stock management, logistics or orders.

Expected result:

* created product appears in the list;
* supplier can access product management actions if implemented.

---

## Step 6 — Log In as Store

Log out from the supplier account, then go to:

```text
/login
```

Log in with the prepared store demo account.

Explain:

* the store role;
* stores use KERNO to discover suppliers and products;
* stores send structured commercial requests;
* stores do not manage products.

Expected result:

* the store account is authenticated;
* the user is redirected to the store dashboard;
* catalog, supplier details and sent requests are accessible.

---

## Step 7 — Create or Review Store Profile

Go to:

```text
/store/profile
```

Create or review the store profile using the demo data.

Explain:

* the store profile identifies the buyer or retail structure;
* it helps suppliers understand who is sending requests;
* sourcing needs clarify the store’s interests.

Expected result:

* store profile is created or displayed;
* profile data can be updated.

---

## Step 8 — Browse the Catalog

Go to:

```text
/catalog
```

Explain:

* this is the main discovery screen;
* stores can browse products and suppliers;
* the catalog is an authenticated shared frontend route;
* the backend read endpoints for products and suppliers remain public API endpoints.

Expected result:

* products or supplier cards are visible;
* the previously created product can be found if data is available;
* filters/search can be demonstrated if implemented.

---

## Step 9 — Open Product Detail Page

Open a product detail page.

Example route format:

```text
/products/:id
```

Explain:

* the product detail page centralizes product information;
* it helps the store decide whether to contact the supplier;
* the page should guide the user toward a structured request.

Expected result:

* product details are visible;
* supplier information is visible when available;
* request action is accessible if implemented.

---

## Step 10 — Open Supplier Detail Page

Open a supplier detail page.

Example route format:

```text
/suppliers/:id
```

Explain:

* supplier detail gives context about the company;
* the store can evaluate local trust, activity and contact information;
* the MVP keeps supplier profiles simple and readable.

Expected result:

* supplier details are visible;
* supplier products or profile information are visible when available.

---

## Step 11 — Send a Contact or Quote Request

Go to:

```text
/requests/new
```

Create a request using the demo request data.

Explain:

* this is the key MVP conversion action;
* KERNO does not process payment or orders;
* the MVP validates structured first contact between store and supplier.

Expected result:

* request is created;
* store can track the sent request;
* supplier can later see the received request.

---

## Step 12 — Review Store Sent Requests

Go to:

```text
/store/requests
```

Explain:

* stores can track requests they sent;
* this replaces informal notes or unstructured contact tracking in the MVP.

Expected result:

* sent request appears in the list;
* request detail can be opened.

---

## Step 13 — Review Supplier Received Requests

Log back in as supplier if needed.

Go to:

```text
/supplier/requests
```

Explain:

* suppliers can view requests received from stores;
* this gives suppliers a simple commercial inbox;
* the MVP does not include advanced messaging.

Expected result:

* received request appears in the list;
* request detail can be opened.

---

## Step 14 — Open Request Detail

Open the request detail page.

Example route formats:

```text
/supplier/requests/:id
/store/requests/:id
```

Explain:

* both sides can view request details;
* access is protected so only the related store or supplier should access the request.

Expected result:

* request subject, message, quantity and related profile data are visible;
* unauthorized users cannot access unrelated requests.

---

## Step 15 — Update Request Status

As supplier, update the request status if the UI/API flow is available.

Possible statuses:

```text
PENDING
READ
ANSWERED
CLOSED
```

Explain:

* status tracking is intentionally simple;
* it helps show request progression without implementing full messaging.

Expected result:

* request status updates correctly;
* updated status is visible in the request list or detail page.

---

## 7. Demo Closing Summary

At the end of the demo, summarize:

* the MVP supports supplier registration and profile creation;
* suppliers can publish products;
* stores can register and create profiles;
* stores can browse products and suppliers;
* stores can send structured requests;
* suppliers can review received requests;
* the project stays inside the MVP scope.

---

## 8. What Not to Claim During Demo

Do not claim that KERNO currently includes:

* payment;
* order management;
* delivery or logistics;
* supplier scraping;
* advanced messaging;
* ratings and reviews;
* production-ready subscription billing;
* automated onboarding;
* advanced analytics.

These are future possibilities, not completed MVP features.

---

## 9. Possible Demo Risks

| Risk | Mitigation |
|---|---|
| Existing demo user already exists | Use login instead of register |
| Empty catalog | Create a supplier product before browsing catalog |
| Request cannot be created | Verify store profile exists and supplier/product ids are valid |
| Backend is not running | Start backend with `npm run dev` |
| Database is not ready | Run Prisma validation and migrations |
| Frontend cannot reach API | Check frontend API base URL |
| Role access issue | Verify the current logged-in account role |

---

## 10. Final Demo Checklist

### Rehearsal Status

The full team rehearsal has been completed. The final script, speaking parts, backup plan and MVP exclusions have been reviewed and approved.

The technical checklist below must still be rechecked immediately before the final live presentation.

Before the final review:

| Check | Status |
|---|---|
| Backend starts correctly | TO VERIFY BEFORE DEMO |
| Frontend starts correctly | TO VERIFY BEFORE DEMO |
| Swagger opens correctly | TO VERIFY BEFORE DEMO |
| Supplier account ready | TO VERIFY BEFORE DEMO |
| Store account ready | TO VERIFY BEFORE DEMO |
| Supplier profile ready | TO VERIFY BEFORE DEMO |
| Store profile ready | TO VERIFY BEFORE DEMO |
| At least one product exists | TO VERIFY BEFORE DEMO |
| Catalog displays data | TO VERIFY BEFORE DEMO |
| Contact request can be created | TO VERIFY BEFORE DEMO |
| Supplier received requests visible | TO VERIFY BEFORE DEMO |
| Store sent requests visible | TO VERIFY BEFORE DEMO |
| Request detail page works | TO VERIFY BEFORE DEMO |
| No blocking issue found | TO VERIFY BEFORE DEMO |

---

## 11. Suggested Demo Duration

Recommended timing:

| Section | Duration |
|---|---:|
| Project introduction | 1 min |
| Supplier flow | 3 min |
| Store discovery flow | 3 min |
| Request flow | 2 min |
| Architecture/API/testing summary | 3 min |
| Questions | Variable |

Total target demo duration: around 10 to 12 minutes.