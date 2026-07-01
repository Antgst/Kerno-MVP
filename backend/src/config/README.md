# Backend Config

## Purpose
This folder contains backend configuration files that assemble external-facing or application-wide settings.

## Analogy
Think of this folder as the control panel: it defines shared configuration used by the API runtime.

## Contents
- `swagger.js` builds the OpenAPI specification from module Swagger files and configures API documentation metadata.

## How It Fits in KERNO
Swagger configuration exposes API documentation through the backend app and keeps module endpoint documentation assembled in one place.

## Maintenance Notes
When adding or changing API endpoints, update the relevant module Swagger file and ensure the central Swagger configuration still includes it.
