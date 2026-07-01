# Backend Tests

## Purpose
This folder contains backend API regression tests and supporting test documentation.

## Analogy
Think of this folder as the backend inspection checklist: it verifies that key API workflows still behave as expected.

## Contents
- `test_kerno_api_comprehensive.py` contains comprehensive API regression tests.
- `conftest.py` provides pytest configuration and shared fixtures.
- `RUN_KERNO_PYTESTS.md` explains how to run the backend pytest suite.
- `results/` stores generated test result artifacts.

## How It Fits in KERNO
These tests exercise the Express API through realistic backend workflows and help protect the contract consumed by the frontend.

## Maintenance Notes
Keep tests aligned with the current API behavior and avoid committing generated result files unless they are intentionally used as evidence for a release or review.
