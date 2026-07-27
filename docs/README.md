# Docs

## Purpose
This folder contains product, architecture, API, database, security, testing, demo, and review documentation for KERNO.

## Analogy
Think of this folder as the project reference shelf: it explains decisions that are too broad to live inside one source file.

## Contents
- `architecture/` explains the application, backend, frontend, and CSS structure.
- `api/` documents backend API behavior and historical API references.
- `database/` documents database schema and role alignment.
- `security/` documents authentication and security notes.
- `testing/` documents testing plans, reports, evidence, and Postman resources.
- `demo/` contains the product demo scenario.
- `review/` contains technical review notes and Stage 4 manual review preparation.
- `audits/` contains targeted audit notes and quality checks performed before review.
- `sprints/` contains Stage 4 sprint planning, reviews, and retrospectives.
- `docker/` contains Docker local development documentation.
- `STAGE4_DELIVERABLE_LINKS.md` centralizes repository, project, sprint, testing, and review links.
- `assets/` contains documentation images.

## How It Fits in KERNO
Documentation helps contributors understand how the React frontend, Express backend, Prisma schema, and PostgreSQL database work together.

## Maintenance Notes
Keep source-adjacent details in folder README files and keep broader architecture or process decisions in this `docs/` tree.
