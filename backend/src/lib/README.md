# Backend Library

## Purpose
This folder contains shared backend infrastructure helpers.

## Analogy
Think of this folder as the common utility cabinet: small infrastructure pieces live here so modules do not rebuild them.

## Contents
- `prisma.js` creates and exports the shared Prisma client used by backend services.

## How It Fits in KERNO
Backend services use the Prisma client from this folder to access PostgreSQL through the generated Prisma client.

## Maintenance Notes
Keep database client creation centralized to avoid multiple Prisma client instances. Add only infrastructure-level helpers here, not domain logic.
