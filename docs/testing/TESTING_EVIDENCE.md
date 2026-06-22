# KERNO Testing Evidence

## 1. Purpose

This document gathers testing evidence for the KERNO MVP.

It is intended to support the final technical review by showing:

* what was tested;
* how the tests were executed;
* where test evidence is stored;
* which parts of the MVP were manually verified;
* which checks still need to be completed before final submission.

---

## 2. Testing Scope

The KERNO MVP testing scope covers:

* backend API health;
* authentication flow;
* role-based access control;
* supplier profile flow;
* store profile flow;
* product creation and listing;
* catalog access after authentication;
* supplier and product detail access;
* contact request creation;
* sent and received request tracking;
* request status update;
* frontend navigation;
* frontend route rendering;
* frontend API service integration;
* final end-to-end MVP demo flow.

---

## 3. Testing Strategy

KERNO uses a pragmatic MVP testing strategy based on:

1. backend syntax checks;
2. backend API tests;
3. Postman/manual API validation;
4. frontend build checks;
5. frontend manual route validation;
6. full MVP scenario testing.

The goal is not to provide enterprise-level automated coverage, but to prove that the MVP is functional, reviewable and aligned with the project scope.

---

## 4. Existing Test Evidence Locations

| Evidence                    | Location                                                              | Purpose                                             |
| --------------------------- | --------------------------------------------------------------------- | --------------------------------------------------- |
| Backend pytest runner guide | `backend/tests/RUN_KERNO_PYTESTS.md`                                  | Explains how to run backend API tests               |
| Backend API test file       | `backend/tests/test_kerno_api_comprehensive.py`                       | Comprehensive backend API test scenarios            |
| Backend test results JSON   | `backend/tests/results/kerno_api_test_results.json`                   | Stored backend test result output                   |
| Postman S2 collection       | `docs/testing/test_postman_S2/kerno_issue_36_postman_collection.json` | Postman collection used for Sprint 2 API validation |
| Postman screenshots         | `docs/testing/test_postman_S2/`                                       | Screenshot evidence for API checks                  |

---

## 5. Backend Test Commands

### Syntax Check

From the repository root:

```bash
cd backend
npm test
```

The backend `npm test` script currently checks syntax for key backend files:

```bash
node --check src/server.js
node --check src/app.js
node --check src/routes/index.js
```

### Backend API Tests

From the repository root:

```bash
cd backend
python3 -m pytest tests/test_kerno_api_comprehensive.py -v
```

If the project uses a virtual environment, activate it first.

---

## 6. Frontend Test Commands

### Install Dependencies

From the repository root:

```bash
cd frontend
npm install
```

### Build Check

```bash
npm run build
```

The build check verifies that the React/Vite frontend can be compiled successfully.

### Development Server

```bash
npm run dev
```

The development server is used for manual frontend validation.

---

## 7. Backend API Areas to Validate

| Area                      | Expected Result                                         | Status                  |
| ------------------------- | ------------------------------------------------------- | ----------------------- |
| Health endpoint           | API returns a success response                          | To confirm in final run |
| Register supplier         | Supplier user can register                              | To confirm in final run |
| Register store            | Store user can register                                 | To confirm in final run |
| Login supplier            | Supplier can log in and receive JWT                     | To confirm in final run |
| Login store               | Store can log in and receive JWT                        | To confirm in final run |
| Current user              | Authenticated user can retrieve own account             | To confirm in final run |
| Supplier profile creation | Supplier can create profile                             | To confirm in final run |
| Supplier profile update   | Supplier can update own profile                         | To confirm in final run |
| Store profile creation    | Store can create profile                                | To confirm in final run |
| Store profile update      | Store can update own profile                            | To confirm in final run |
| Category listing          | Public users can list categories                        | To confirm in final run |
| Product creation          | Supplier can create product                             | To confirm in final run |
| Product listing           | Public users can list products                          | To confirm in final run |
| Product detail            | Public users can access product details                 | To confirm in final run |
| Supplier listing          | Public users can list suppliers                         | To confirm in final run |
| Supplier detail           | Public users can access supplier details                | To confirm in final run |
| Request creation          | Store can send request to supplier                      | To confirm in final run |
| Sent requests             | Store can list sent requests                            | To confirm in final run |
| Received requests         | Supplier can list received requests                     | To confirm in final run |
| Request detail            | Store or supplier can access authorized request details | To confirm in final run |
| Request status update     | Supplier can update request status                      | To confirm in final run |
| Unauthorized access       | Protected routes reject missing token                   | To confirm in final run |
| Forbidden access          | Role-protected routes reject wrong role                 | To confirm in final run |

---

## 8. Frontend Areas to Validate

| Area                    | Expected Result                                              | Status                  |
| ----------------------- | ------------------------------------------------------------ | ----------------------- |
| Landing page            | Public landing page renders correctly                        | To confirm in final run |
| Login page              | Login form renders correctly                                 | To confirm in final run |
| Register page           | Register form renders correctly                              | To confirm in final run |
| Catalog page            | Catalog page renders correctly after authentication          | To confirm in final run |
| Product detail page     | Product detail route renders correctly after authentication  | To confirm in final run |
| Supplier detail page    | Supplier detail route renders correctly after authentication | To confirm in final run |
| Supplier dashboard      | Supplier dashboard renders in app layout                     | To confirm in final run |
| Supplier profile page   | Supplier profile page renders correctly                      | To confirm in final run |
| Supplier products page  | Supplier product management page renders correctly           | To confirm in final run |
| Supplier product form   | Supplier product form renders correctly                      | To confirm in final run |
| Supplier requests page  | Supplier received requests page renders correctly            | To confirm in final run |
| Supplier request detail | Supplier request detail page renders correctly               | To confirm in final run |
| Store dashboard         | Store dashboard renders in app layout                        | To confirm in final run |
| Store profile page      | Store profile page renders correctly                         | To confirm in final run |
| Store requests page     | Store sent requests page renders correctly                   | To confirm in final run |
| Store request detail    | Store request detail page renders correctly                  | To confirm in final run |
| Request creation page   | Store can access request form route                          | To confirm in final run |
| Navigation shell        | Header/sidebar navigation works as expected                  | To confirm in final run |
| Not found page          | Unknown routes render fallback page                          | To confirm in final run |
| Responsive behavior     | Layout remains usable on smaller screens                     | To confirm in final run |

---

## 9. Manual MVP Scenario

The final manual test should validate the complete business flow.

### Scenario

1. Start PostgreSQL.
2. Start the backend API.
3. Start the frontend application.
4. Register a supplier account.
5. Create a supplier profile.
6. Create at least one product.
7. Register a store account.
8. Create a store profile.
9. Open the catalog after authentication.
10. Open a product detail page.
11. Open a supplier detail page.
12. Send a structured contact or quote request.
13. Log back as supplier.
14. Open received requests.
15. Open the request detail page.
16. Update the request status.
17. Log back as store.
18. Check sent requests and request detail.

### Expected Result

The full flow should work without blocking errors.

---

## 10. Final Test Run Checklist

This section must be completed before final submission.

| Check                           | Command / Action                                                           | Result | Date | Tester |
| ------------------------------- | -------------------------------------------------------------------------- | ------ | ---- | ------ |
| Backend dependencies installed  | `cd backend && npm install`                                                | TODO   | TODO | TODO   |
| Backend syntax check            | `cd backend && npm test`                                                   | TODO   | TODO | TODO   |
| Backend API tests               | `cd backend && python3 -m pytest tests/test_kerno_api_comprehensive.py -v` | TODO   | TODO | TODO   |
| Backend server start            | `cd backend && npm run dev`                                                | TODO   | TODO | TODO   |
| Swagger available               | Open `/api/docs`                                                           | TODO   | TODO | TODO   |
| OpenAPI JSON available          | Open `/api/openapi.json`                                                   | TODO   | TODO | TODO   |
| Frontend dependencies installed | `cd frontend && npm install`                                               | TODO   | TODO | TODO   |
| Frontend build                  | `cd frontend && npm run build`                                             | TODO   | TODO | TODO   |
| Frontend dev server start       | `cd frontend && npm run dev`                                               | TODO   | TODO | TODO   |
| Full MVP manual scenario        | Run scenario from section 9                                                | TODO   | TODO | TODO   |

---

## 11. Evidence to Add Before Final Submission

Before the final review, add or update:

* terminal output for backend syntax check;
* terminal output for backend API tests;
* terminal output for frontend build;
* screenshots of Swagger UI;
* screenshots of key frontend pages;
* screenshots or logs of the full MVP scenario;
* final result summary.

Recommended folder:

```text
docs/testing/final_validation/
```

Suggested files:

```text
backend_npm_test.txt
backend_pytest_output.txt
frontend_build_output.txt
swagger_screenshot.png
landing_page_screenshot.png
catalog_page_screenshot.png
supplier_dashboard_screenshot.png
store_dashboard_screenshot.png
request_flow_screenshot.png
```

---

## 12. Known Limitations

Current testing is focused on MVP validation.

The project does not currently include:

* full unit test coverage for every service;
* browser automation tests;
* continuous integration pipeline evidence;
* load testing;
* security penetration testing;
* accessibility audit.

These are acceptable limitations for the current portfolio MVP but should be considered for future production readiness.

---

## 13. Final Testing Summary

To be completed after the final test run.

```text
Final backend status: TODO
Final frontend status: TODO
Final database status: TODO
Final MVP scenario status: TODO
Blocking issues found: TODO
Remaining known limitations: TODO
Final tester: TODO
Final test date: TODO
```

---

## 14. Related Documentation

* `backend/tests/RUN_KERNO_PYTESTS.md`
* `backend/tests/results/kerno_api_test_results.json`
* `docs/testing/test_postman_S2/`
* `docs/api/API_SUMMARY.md`
* `docs/architecture/APPLICATION_ARCHITECTURE.md`
* `docs/review/TECHNICAL_REVIEW_NOTES.md`
