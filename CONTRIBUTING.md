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

During sprint execution, feature, fix, and documentation branches should target the active sprint branch (`S1`, `S2`, `S3`, `S4`, or `S5`). Validated sprint branches can then be merged into `develop`, and `develop` can be stabilized into `main`.

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

1. Start from the active sprint branch.
2. Create a dedicated branch.
3. Make the changes.
4. Commit with a clear message.
5. Push the branch.
6. Open a pull request into the active sprint branch.
7. Request at least one review.
8. Apply corrections if needed.
9. Merge only after validation.

### Pull request target

Pull requests must target the active sprint branch, not `main`.

Validated sprint branches can be merged into `develop`. The final stabilization pull request should go from `develop` to `main`.

---

## 7. Pull request requirements

Each pull request must include:

* A clear title
* A short description of what was changed
* The linked issue number when applicable
* The type of change
* Testing or manual verification notes
* Any known limitations or follow-up work

### Pull request title examples

```text
feat(auth): add user registration endpoint
docs(readme): update MVP scope section
fix(products): prevent empty product name
```

### Pull request description template

```markdown
## Summary

Describe the changes made in this pull request.

## Related issue

Closes #issue-number

## Changes

- Change 1
- Change 2
- Change 3

## Testing

- [ ] Manual test completed
- [ ] Backend test completed
- [ ] Frontend build completed
- [ ] Documentation updated if needed

## Notes

Add any limitation, risk, or follow-up task.
```

---

## 8. Review rules

At least one team member should review a pull request before it is merged.

A reviewer should check:

* The change matches the issue scope
* The MVP scope is respected
* The code is readable
* The file structure is coherent
* No unrelated change is included
* The application still runs
* Documentation is updated when needed

The reviewer should not only approve quickly. The goal is to catch issues early and keep the project explainable for the final review.

---

## 9. Issue workflow

GitHub issues are used to split the project into manageable tasks.

Each issue should include:

* A clear title
* A short description
* Acceptance criteria
* A sprint or priority indication when useful
* A responsible person if assigned
* Relevant labels if used

### Issue status

Issues should move through the project board according to their real state:

* Backlog
* To Do
* In Progress
* Review
* Done
* Blocked
* Parking lot

A task should not stay in progress if it is waiting for review.

A task should not be marked as done until it is reviewed and validated.

---

## 10. Documentation rules

Documentation is part of the project deliverable.

Documentation should be updated when:

* A new feature changes the project behavior
* A new API route is added
* The database schema changes
* The setup process changes
* The architecture changes
* A decision needs to be preserved for the final review

Important documentation files include:

* `README.md`
* `CONTRIBUTING.md`
* `docs/api/API_SUMMARY.md`
* `docs/architecture/APPLICATION_ARCHITECTURE.md`
* `docs/architecture/BACKEND_STRUCTURE.md`
* `docs/architecture/FRONTEND_STRUCTURE.md`
* `docs/database/DATABASE_SCHEMA.md`
* `docs/docker/DOCKER.md`
* `docs/security/AUTH_SECURITY_NOTES.md`
* `docs/testing/TESTING_EVIDENCE.md`
* `docs/demo/DEMO_SCENARIO.md`
* `docs/review/TECHNICAL_REVIEW_NOTES.md`

Documentation must stay clear, factual, and aligned with the real implementation.

---

## 11. Code organization principles

The project should stay easy to understand.

### Backend

Backend code should be organized by domain when possible:

* auth
* users
* suppliers
* stores
* products
* categories
* requests
* health

The backend should keep a clear separation between:

* routes
* controllers
* services
* middlewares
* configuration

### Frontend

Frontend code should be organized by responsibility:

* pages
* layouts
* components
* services
* routes
* config
* utils

Reusable UI should be placed in shared or UI components instead of being duplicated across pages.

---

## 12. Testing expectations

Testing must be proportional to the MVP scope.

Before a pull request is approved, the team should run the relevant checks.

### Backend checks

Possible commands:

```bash
cd backend
npm test
```

If API tests are needed:

```bash
cd backend
python3 -m pytest tests/test_kerno_api_comprehensive.py -v
```

### Frontend checks

Possible commands:

```bash
cd frontend
npm run build
```

Manual route checks should be done for frontend navigation and major screens.

### Manual MVP scenario

Before final submission, the team should validate the full MVP flow:

1. Register or login as supplier.
2. Create or update supplier profile.
3. Create product.
4. Register or login as store.
5. Create or update store profile.
6. Browse catalog.
7. Open product or supplier detail.
8. Send request.
9. Review sent and received requests.
10. Update request status if available.

---

## 13. Environment rules

Local environment files must not be committed.

Do not commit:

* `.env`
* secret keys
* local database dumps
* personal credentials
* generated local caches

Use example files instead:

* `backend/.env.example`
* `frontend/.env.example`

---

## 14. Style and language rules

GitHub-facing content must be written in English.

This includes:

* Issue titles
* Issue descriptions
* Pull request titles
* Pull request descriptions
* Commit messages
* README sections
* Technical documentation

French can be used for team discussion if needed, but final repository content should stay in English.

---

## 15. AI-assisted work rules

AI tools may be used to support the team, but the team remains responsible for the final work.

AI can help with:

* documentation drafts
* code review suggestions
* debugging explanations
* architecture clarification
* test scenario planning

AI should not be used blindly.

Every AI-assisted output must be reviewed, adapted, and validated by the team before being committed.

The team must be able to explain every committed change during the technical review.

---

## 16. Definition of done

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
