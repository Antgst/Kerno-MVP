# Backend Tests

## Purpose
This folder contains backend API regression tests and supporting test documentation.

## Analogy
Think of this folder as the backend inspection checklist: it verifies that key API workflows still behave as expected.

## Contents
- `test_kerno_api_comprehensive.py` contains comprehensive API regression tests, including OWASP A01 profile ownership regression coverage.
- `conftest.py` provides pytest configuration and shared fixtures.
- `RUN_KERNO_PYTESTS.md` explains how to run the backend pytest suite.
- `results/` stores generated test result artifacts.

## Security Coverage

The backend pytest suite includes targeted OWASP A01 Broken Access Control checks.

Current OWASP A01 profile ownership coverage verifies that:

- supplier `/profile/me` returns only the authenticated supplier profile;
- store `/profile/me` returns only the authenticated store profile;
- URL ID tampering cannot update another supplier or store profile;
- updating the current profile does not modify another user's profile.

Targeted command from the repository root:

```bash
python3 -m pytest backend/tests/test_kerno_api_comprehensive.py -k "owasp_a01" -q
```

Latest local result on branch `owasp-01`:

```text
6 passed, 127 deselected
```

## How It Fits in KERNO
These tests exercise the Express API through realistic backend workflows and help protect the contract consumed by the frontend.

## Maintenance Notes
Keep tests aligned with the current API behavior and avoid committing generated result files unless they are intentionally used as evidence for a release or review.
