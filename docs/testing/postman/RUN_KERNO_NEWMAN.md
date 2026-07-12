# Run KERNO Postman/Newman Regression

## Purpose

This folder contains a fresh Postman/Newman smoke regression collection for the current KERNO MVP API.

It is complementary to the main pytest backend regression suite and the Playwright frontend regression suite. It is intentionally focused on the main API flow instead of duplicating every pytest case.

## Files

```text
docs/testing/postman/
├── kerno_mvp_regression.postman_collection.json
├── kerno_local.postman_environment.json
└── RUN_KERNO_NEWMAN.md
```

## Prerequisites

The local backend must be running and populated with the current demo seed from `backend/prisma/seed-demo.js`.

Default environment values:

```text
baseUrl: http://localhost:5001/api
supplier: supplier1@kerno-demo.local / Password123!
store: store1@kerno-demo.local / Password123!
```

If your backend runs on port `5000`, update `baseUrl` in:

```text
docs/testing/postman/kerno_local.postman_environment.json
```

or override it in Postman/Newman.

## Run with Newman

From the repository root:

```bash
npx newman run docs/testing/postman/kerno_mvp_regression.postman_collection.json \
  -e docs/testing/postman/kerno_local.postman_environment.json
```

## Expected coverage

The collection checks:

1. API health.
2. Public categories list.
3. Public products list.
4. Public suppliers list.
5. Product detail.
6. Supplier detail.
7. Unauthorized access to `/users/me`.
8. Supplier login.
9. Store login.
10. Current supplier user.
11. Current store user.
12. Store contact request creation.
13. Store sent requests.
14. Supplier received requests.
15. Created request detail.

## Expected result

The Newman run should complete with all assertions passing.

The exact request/assertion count may evolve if the collection is expanded later.

## Notes

Generated Newman reports should not be committed unless intentionally added as small documented evidence.

This collection does not replace:

- `backend/tests/test_kerno_api_comprehensive.py`
- `frontend/tests/e2e/mvp-regression.spec.js`

It only adds an external API testing format that can be reviewed or reused by the team.
