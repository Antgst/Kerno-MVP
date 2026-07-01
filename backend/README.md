# Backend

## Purpose
This folder contains the Express REST API for KERNO. It owns authentication, domain rules, persistence access through Prisma, and OpenAPI documentation.

## Analogy
Think of this folder as the service counter of the product: the frontend asks for business operations, and the backend verifies, processes, and records them.

## Contents
- `src/` contains the Express application source code.
- `prisma/` contains the database schema, seed script, and migration history.
- `tests/` contains backend regression tests and supporting test documentation.
- `package.json` and `package-lock.json` define backend scripts and Node.js dependencies.
- The environment sample file documents backend variables expected for local development.
- `prisma.config.ts` provides Prisma CLI configuration.

## How It Fits in KERNO
The backend exposes the API consumed by the React frontend. It connects to PostgreSQL through Prisma and keeps supplier, store, product, category, request, and user data consistent.

## Maintenance Notes
Keep new business features inside the relevant module under `src/modules/`. Shared middleware, configuration, or database access should stay in their dedicated folders.
