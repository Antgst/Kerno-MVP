# Contributing to Kerno-MVP

## 1. Purpose

This document defines the Git workflow, branch strategy, pull request rules, review expectations, and collaboration conventions for the Kerno-MVP project.

Kerno is a Holberton Stage 4 portfolio project. The goal is to build a functional MVP for a B2B SaaS marketplace connecting direct or local suppliers with retail stores.

The workflow must stay simple, readable, and realistic for a small team. It must support clean collaboration without adding unnecessary process complexity.

---

## 2. MVP scope reminder

The MVP focuses on the following core journey:

1. A supplier creates an account.
2. A supplier completes a company profile.
3. A supplier adds products.
4. A store creates an account.
5. A store completes a store profile.
6. A store searches for products or suppliers.
7. A store views product and supplier details.
8. A store sends a contact or quote request.
9. A supplier receives and reviews the request.

The MVP must remain focused on supplier visibility, product discovery, and structured first contact between stores and suppliers.

### Out of scope for the MVP

The following features must not be implemented during the MVP unless explicitly validated by the team:

* Online payment
* Shopping cart
* Full order management
* Delivery or logistics tracking
* Invoicing
* Advanced internal messaging
* Advanced analytics
* Complex subscription management
* Reviews and public ratings
* Heavy admin back office
* Mandatory external API integrations

Any feature that extends the MVP scope must be discussed before development.

---

## 3. Main branches

### `main`

`main` is the stable branch.

It contains the clean and validated version of the project. It should be used for final demonstrations or stable project snapshots.

Direct commits to `main` are not allowed.

### `develop`

`develop` is the integration branch.

It contains validated work that is ready to be tested together before being merged into `main`.

All feature, fix, and documentation branches must target `develop` first.

---

## 4. Branch naming rules

Each branch must have a clear purpose and should be linked to a GitHub issue when possible.

### Feature branches

Use `feature/` for new MVP features.

Examples:

* `feature/s2-04-auth-routes`
* `feature/s2-06-supplier-profile-api`
* `feature/s3-03-product-cards`

### Fix branches

Use `fix/` for bug fixes.

Examples:

* `fix/login-validation-error`
* `fix/product-search-filter`
* `fix/request-status-update`

### Documentation branches

Use `docs/` for documentation-only changes.

Examples:

* `docs/s1-02-git-workflow`
* `docs/readme-update`
* `docs/api-documentation`

### Setup branches

Use `setup/` for technical setup tasks.

Examples:

* `setup/backend-express`
* `setup/frontend-vite`
* `setup/prisma-postgresql`

---

## 5. Commit message conventions

Commit messages must be short, explicit, and written in English.

Recommended format:

```text
type: short description
```

Allowed types:

* `feat`: new feature
* `fix`: bug fix
* `docs`: documentation
* `chore`: maintenance or configuration
* `test`: tests
* `refactor`: code improvement without changing behavior
* `style`: formatting or styling only

Examples:

```text
docs: add Git workflow conventions
feat: add user registration route
fix: correct product search filter
chore: configure backend environment
test: add auth route validation tests
```

Avoid vague commits such as:

```text
update
fix
changes
wip
test
```

---

## 6. Pull request workflow

Every meaningful change must go through a pull request.

### Standard workflow

1. Start from `develop`.
2. Create a dedicated branch.
3. Make the changes.
4. Commit with a clear message.
5. Push the branch.
6. Open a pull request into `develop`.
7. Request at least one review.
8. Apply corrections if needed.
9. Merge only after validation.

### Pull request target

Pull requests must target `develop`, not `main`.

The only exception is a final stabilization pull request from `develop` to `main`.

---

## 7. Pull request content

Each pull request must contain the following sections:

```markdown
## Summary

Short explanation of what was added, changed, or fixed.

## Related issue

Closes #issue_number

## MVP area

Specify the related part of the MVP:
- Authentication
- Supplier profile
- Store profile
- Products
- Catalog / Search
- Product detail
- Supplier detail
- Contact request
- Dashboard
- Documentation
- Setup

## Changes made

- Change 1
- Change 2
- Change 3

## Tests performed

Explain what was tested:
- Manual verification
- API test
- Frontend check
- Unit test
- Integration test

## Points to review

Mention specific parts that reviewers should check carefully.

## Out-of-scope check

Confirm that the PR does not introduce features outside the MVP scope.
```

---

## 8. Review rules

At least one reviewer must validate a pull request before merge.

For important features, the review should be done by the full team when possible.

The review must focus on:

* Code readability
* Absence of obvious errors
* Respect of the MVP scope
* Consistency with the planned architecture
* Correct behavior of the related user flow
* No unnecessary complexity
* No out-of-scope feature
* No secret committed in the repository
* Clear naming and understandable structure

The review should detect important problems before integration. It should not block the team on minor details unless they affect quality, clarity, or maintainability.

---

## 9. Testing expectations

Testing must stay adapted to the project stage.

Depending on the feature, the team may use:

* Manual testing
* API testing with Postman or an equivalent tool
* Frontend behavior checks
* Backend route tests
* Integration checks between frontend and backend
* Database operation checks through Prisma and PostgreSQL

Each pull request must explain what was tested.

For backend API routes, the minimum expected validation is:

* The route responds correctly.
* Required fields are validated.
* Invalid input is rejected.
* Protected routes require authentication when needed.
* Role-based access is respected when needed.
* Database operations behave as expected.

For frontend screens, the minimum expected validation is:

* The page renders correctly.
* Navigation works.
* Forms are usable.
* API calls are correctly connected when available.
* Errors are displayed or handled clearly.
* The screen remains aligned with the MVP user journey.

---

## 10. Environment and secrets

Secrets must never be committed.

The following files must remain ignored:

* `.env`
* `.env.local`
* `.env.development`
* `.env.production`

Only example files are allowed:

* `.env.example`

Environment variables must be documented with placeholder values only.

Example:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/kerno_db"
JWT_SECRET="replace_with_local_secret"
PORT=5000
```

---

## 11. Merge rules

A pull request can be merged when:

* The branch targets `develop`.
* The description is complete.
* The related issue is linked.
* The MVP area is identified.
* The tests performed are described.
* At least one reviewer has approved.
* No critical issue remains unresolved.
* The code does not introduce out-of-scope features.
* The branch does not contain secrets or generated files.

`main` must only receive stable code from `develop`.

---

## 12. Issue workflow

Each GitHub issue should represent a clear task.

Before starting an issue, the team must check:

* The objective is clear.
* The scope is realistic.
* The responsible person is identified.
* The reviewer is identified.
* Dependencies are understood.
* The expected result is clear.

Recommended issue statuses:

* `Todo`: not started
* `In Progress`: currently being worked on
* `Review`: ready for review or validation
* `Blocked`: blocked by a dependency or decision
* `Done`: completed and validated

An issue should not be moved to `Done` without review or team validation when required.

---

## 13. Team responsibilities

The project is developed as a team.

General responsibility split:

* Antoine: project owner, coordination, fullstack support, review, documentation, MVP coherence
* Yonas: backend lead, API, database, authentication, business logic
* Gwendal: frontend lead, interface, React components, pages, user flows

Responsibilities may evolve depending on sprint priorities, blockers, and learning needs.

The team should keep the workload balanced and make sure each member understands the main technical decisions.

---

## 14. MVP architecture guardrails

The project follows a simple fullstack architecture:

* Frontend: React, JavaScript, Vite, Tailwind CSS
* Backend: Node.js, Express, JavaScript
* Database: PostgreSQL
* ORM: Prisma
* API: REST
* Documentation: lightweight OpenAPI / Swagger when relevant
* Architecture: modular monolithic backend

The backend should remain organized by clear modules:

* Auth
* Users
* Suppliers
* Stores
* Products
* Requests

The project should avoid premature complexity such as:

* Microservices
* GraphQL
* Complex DevOps pipelines
* Mandatory external integrations
* Advanced permissions systems
* Over-engineered abstractions

---

## 15. Documentation expectations

Documentation must be kept in English.

The repository should progressively include:

* A clear `README.md`
* This `CONTRIBUTING.md`
* Setup instructions
* API documentation
* Database diagram
* Application architecture diagram
* Testing evidence
* Sprint or review notes when needed

Documentation must stay useful and readable. It should help the team and the evaluator understand how the project works.

---

## 16. Definition of Done

A task can be considered done when:

* The expected work is completed.
* The implementation matches the issue scope.
* The code is readable and organized.
* The MVP scope is respected.
* The work has been tested or manually verified.
* The pull request has been reviewed when required.
* Documentation has been updated if needed.
* The GitHub Project status is updated.
* The team can explain the change during a technical review.

---

## 17. Final review mindset

The repository must be ready for a technical manual review.

The team should be able to explain:

* How the application works
* How the frontend communicates with the backend
* How the database is structured
* How authentication and role protection work
* How each MVP feature was tested
* How the team collaborated
* How Git branches, pull requests, and reviews were used
* Why the technical choices are coherent with the MVP

The goal is not only to build the application, but also to prove that the team can work with a clean, professional, and explainable development process.
