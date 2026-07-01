# Backend Routes

## Purpose
This folder contains the central route registration point for backend modules.

## Analogy
Think of this folder as the API switchboard: it connects each module router to the shared `/api` entry point.

## Contents
- `index.js` imports module routes and mounts them into the Express API.

## How It Fits in KERNO
The Express app uses this folder to expose auth, users, suppliers, stores, products, categories, requests, and health endpoints through one routing layer.

## Maintenance Notes
Register new module routes here after creating the module's own `*.routes.js` file.
