# Backend Utils

## Purpose
This folder contains small reusable backend helpers.

## Analogy
Think of this folder as a small tool tray: it holds focused helpers that do not belong to one domain module.

## Contents
- `phone.js` contains phone-related utility logic.

## How It Fits in KERNO
Utilities support backend modules without owning routes, controllers, services, or database access.

## Maintenance Notes
Keep utilities narrow and dependency-light. Move domain-specific behavior back into the relevant module service when it grows.
