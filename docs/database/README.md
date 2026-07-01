# Database Docs

## Purpose
This folder documents the PostgreSQL and Prisma data model used by KERNO.

## Analogy
Think of this folder as the data dictionary: it explains what the main records mean and how they relate.

## Contents
- `DATABASE_SCHEMA.md` documents the main database entities and relationships.
- `USER_ROLE_ENUM_ALIGNMENT.md` explains user role alignment across the database and application.

## How It Fits in KERNO
Database documentation supports backend work involving users, supplier profiles, store profiles, categories, products, and contact requests.

## Maintenance Notes
Keep these documents aligned with `backend/prisma/schema.prisma` after model or enum changes.
