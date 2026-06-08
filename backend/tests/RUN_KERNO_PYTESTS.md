# Kerno Python API tests

These tests are written in Python with `pytest` and `requests`.
They test the running Kerno Express API from the outside.

## Files to add

```text
backend/tests/test_kerno_api_comprehensive.py
backend/tests/conftest.py
```

## Install test dependencies

From the repository root:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install pytest requests
```

## Start the backend

In another terminal:

```bash
cd backend
npm run dev
```

Make sure PostgreSQL is started and the backend answers on:

```text
http://localhost:5000/api/health
```

## Run all tests

From the `backend` folder:

```bash
pytest tests/test_kerno_api_comprehensive.py -v
```

The result file will be created here:

```text
backend/tests/results/kerno_api_test_results.json
```

## Use a different API URL

```bash
KERNO_API_BASE_URL=http://localhost:5000 pytest tests/test_kerno_api_comprehensive.py -v
```

## Use a different result file

```bash
KERNO_PYTEST_RESULTS_FILE=tests/results/latest.json pytest tests/test_kerno_api_comprehensive.py -v
```

## Important notes

- The tests create unique emails using a timestamp and UUID, so they can be run multiple times.
- These are API tests, not internal JavaScript unit tests.
- Some invalid UUID tests accept `400`, `404`, or `500` because the current backend may surface raw Prisma validation errors until explicit UUID validation is added.
