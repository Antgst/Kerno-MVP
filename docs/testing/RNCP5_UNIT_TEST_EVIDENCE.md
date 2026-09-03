# RNCP5 — Unit test evidence

Date: 2026-09-03  
Working branch: `test/rncp5-unit-tests`  
Status: work in branch, not merged into `develop-V2`.

## Purpose

This document isolates the unit-test evidence prepared for the DWWM RNCP review. It deliberately distinguishes unit tests from the existing API, integration and browser regression suites documented in `TESTING_EVIDENCE.md`.

The objective is not to claim exhaustive unit coverage. The selected tests target the representative business flow used in the RNCP dossier: a store sends a request to a supplier.

## Backend unit tests

Source:

```text
backend/test/requests.service.unit.test.js
```

Command:

```bash
npm run test:unit --prefix backend
```

The backend package also runs the Node unit tests from its regular `npm test` script after syntax checks.

Reference commit:

```text
189b0b207e928d8fc8fa1b63e595f04e104279b2
```

Covered behaviors:

1. a valid request is persisted with the normalized payload and initial `PENDING` status;
2. a product that does not belong to the target supplier is rejected;
3. a store cannot read a request owned by another store;
4. an allowed supplier status is normalized and persisted.

These tests replace Prisma with an in-memory mock through the Node module cache. They therefore exercise the service rules without PostgreSQL, HTTP or Express.

## Frontend unit tests

Sources:

```text
frontend/src/utils/requestFormValidation.js
frontend/test/requestFormValidation.unit.test.js
```

Command:

```bash
npm run test:unit --prefix frontend
```

Reference commit:

```text
7a8fc04bbe5f97b6adcd8e48e27f280e51c6b302
```

Covered behaviors:

1. all required-field errors are returned for an empty form;
2. whitespace-only required values are rejected;
3. a complete valid form is accepted and optional fields remain optional;
4. only the missing required field is reported when the other required values are present.

The validation rules were extracted from `RequestFormPage.jsx` into a pure function specifically so they can be tested without a browser, React renderer or API.

## CI evidence for the backend-unit-test commit

The original pull request used to validate commit `189b0b2` was later closed because the RNCP work is now intentionally kept without an open PR. The completed workflow runs remain valid historical evidence for that commit.

GitHub Actions run:

```text
Vérifications develop-V2 — run 33780685749 — SUCCESS
```

The single `Backend et frontend` job completed successfully, including:

- repository checkout;
- pull-request diff check;
- Node/npm setup;
- root, backend and frontend dependency installation;
- backend `npm test`;
- frontend lint;
- frontend Vite build.

React Doctor run:

```text
React Doctor — run 33780685771 — SUCCESS
```

The `react-doctor` job completed successfully on the same commit.

These workflow results apply to commit `189b0b2`. Later branch-only commits have not been validated by those historical runs.

## Accessibility work associated with the representative form

The same working branch contains targeted semantic improvements to `frontend/src/components/requests/RequestFormFields.jsx`.

Current branch evidence includes:

- `aria-busy` on the form during submission;
- native `required` semantics on the message textarea;
- `aria-invalid` and `aria-describedby` for the message error;
- alert semantics for target and message errors;
- an explicit visible keyboard-focus ring on the cancel action;
- existing `Input.jsx` label association and error description support;
- existing `LoadingState.jsx` live status semantics.

Reference accessibility commits:

```text
0f2dbe26e52b3fee21b0dba3b4c099b8370c5849
054312971df480c1f904b46054791051b82f4238
```

These points are evidence of targeted accessibility work, not a claim of full RGAA compliance.

## Verification performed on 2026-09-03

The exact unit-test source files and their direct source dependencies were reproduced in an isolated Node.js harness and executed with Node `v22.16.0`.

Result:

```text
Frontend unit tests: 4 passed, 0 failed
Backend unit tests: 4 passed, 0 failed
Total: 8 passed, 0 failed
```

This isolated check proves the focused unit-test code executes successfully. It is not equivalent to a full repository `npm ci`, lint, Vite build, Playwright or PostgreSQL regression run.

The current branch is deliberately kept without an open PR. The repository CI workflow is pull-request-triggered for `develop-V2`, so the later branch-only commits do not consume PR CI runs.

## Evidence boundaries for the dossier and jury

Safe wording:

> KERNO already has broad API and browser regression coverage. For the RNCP review, I added focused unit tests on the representative request flow: four service-level backend tests with Prisma mocked, and four frontend tests on pure form-validation rules. They complement rather than replace the existing API and E2E suites.

Do not claim:

- exhaustive unit coverage;
- 100% coverage;
- that API/pytest or Playwright tests are unit tests;
- that the branch-only changes are integrated into `develop-V2` before they actually are;
- that the successful historical CI run covers later branch-only commits;
- full accessibility or RGAA compliance from these targeted improvements.

## Remaining verification before integration or final submission

When an integration decision is eventually made, run from the real repository checkout:

```bash
npm ci
npm ci --prefix backend
npm ci --prefix frontend
npm test --prefix backend
npm run test:unit --prefix frontend
npm run lint --prefix frontend
npm run build --prefix frontend
```

Run the existing API/E2E suites as appropriate near the final RNCP submission, then record the date and exact results in the dossier evidence pack.
