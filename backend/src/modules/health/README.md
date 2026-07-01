# Health Module

## Purpose
This module exposes a lightweight API health check.

## Analogy
Think of this module as a status light: it gives a quick signal that the backend can respond.

## Contents
- `health.routes.js` declares the health check endpoint.
- `health.controller.js` returns the health check response.
- `health.swagger.js` documents the health endpoint for the OpenAPI specification.

## How It Fits in KERNO
Health checks help confirm that the Express API is reachable during local development, manual checks, and deployment diagnostics.

## Maintenance Notes
Keep this module small and dependency-light. Health checks should remain fast and easy to interpret.
