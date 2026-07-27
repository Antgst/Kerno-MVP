# Frontend Tests

## Purpose
This folder contains frontend end-to-end tests.

## Analogy
Think of this folder as the browser workflow checklist: it verifies that important user paths still work from the user's point of view.

## Contents
- `e2e/` contains Playwright end-to-end test files.
- `e2e/mvp-regression.spec.js` covers main regression workflows through the browser.

## How It Fits in KERNO
Frontend tests validate that the React application, routing, and backend-facing flows remain usable after changes.

## Maintenance Notes
Keep tests focused on stable user behavior. Avoid relying on visual details that are likely to change unless the test specifically protects them.
