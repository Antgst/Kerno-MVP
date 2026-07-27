# Frontend Config

## Purpose
This folder contains frontend runtime configuration.

## Analogy
Think of this folder as the frontend settings panel: it defines shared values that other layers read instead of hardcoding them.

## Contents
- `api.js` resolves the backend API base URL used by frontend services.

## How It Fits in KERNO
The service layer reads configuration from this folder before sending requests to the Express API.

## Maintenance Notes
Keep configuration explicit and environment-aware. Avoid scattering API base URLs across pages, components, or services.
