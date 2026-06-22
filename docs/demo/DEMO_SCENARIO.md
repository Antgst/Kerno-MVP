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

## 4. Demo Accounts

Use simple demo accounts.

### Supplier Account

```text
Email: supplier.demo@kerno.local
Password: Password123!
Role: SUPPLIER
```

### Store Account

```text
Email: store.demo@kerno.local
Password: Password123!
Role: STORE
```

If these accounts already exist locally, log in with them instead of registering again.

---

## 5. Demo Data

### Supplier Profile Example

```text
Company name: GreenField Farms
Description: Local supplier of fresh fruits and vegetables for retail stores.
Location: Rennes
Business type: Local producer
Contact email: contact@greenfield.example
Phone: 0600000000
Website: https://greenfield.example
```

### Product Example

```text
Name: Organic Tomatoes
Description: Fresh local organic tomatoes available for weekly retail supply.
Price info: 12 EUR / box
Minimum order: 5 boxes
Origin: Rennes area
Category: Fresh Produce
Image URL: https://example.com/tomatoes.jpg
```

### Store Profile Example

```text
Store name: Kerno Market
Brand name: Kerno Retail
Location: Rennes
Store type: Independent retail store
Sourcing needs: Local fruits, vegetables and direct supplier opportunities
Contact email: buyer@kerno-market.example
Phone: 0600000001
```

### Contact Request Example

```text
Subject: Wholesale inquiry for organic tomatoes
Message: Hello, we are interested in your organic tomatoes for weekly retail supply. Could you share your current availability, lead times and pricing conditions?
Requested quantity: 20 boxes per week
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

## Step 2 — Register or Log In as Supplier

Go to:

```text
/register
```

Create or log in with the supplier demo account.

Explain:

* the supplier role;
* the need to create a professional profile before publishing products.

Expected result:

* supplier account is created or authenticated;
* the user is redirected to the supplier area or can access supplier pages.

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

## Step 4 — Create a Product

Go to:

```text
/supplier/products/new
```

Create a product using the demo data.

Explain:

* products are the core marketplace objects;
* each product belongs to a supplier;
* product information helps stores understand availability, price information, minimum order and origin.

Expected result:

* product is created;
* product becomes visible in supplier product management and catalog flow.

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

## Step 6 — Register or Log In as Store

Log out if needed, then go to:

```text
/register
```

Create or log in with the store demo account.

Explain:

* the store role;
* stores use KERNO to discover suppliers and send structured requests;
* stores do not manage products.

Expected result:

* store account is created or authenticated;
* the user can access the store area.

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

Before the final review:

| Check | Status |
|---|---|
| Backend starts correctly | TODO |
| Frontend starts correctly | TODO |
| Swagger opens correctly | TODO |
| Supplier account ready | TODO |
| Store account ready | TODO |
| Supplier profile ready | TODO |
| Store profile ready | TODO |
| At least one product exists | TODO |
| Catalog displays data | TODO |
| Contact request can be created | TODO |
| Supplier received requests visible | TODO |
| Store sent requests visible | TODO |
| Request detail page works | TODO |
| No blocking issue found | TODO |

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