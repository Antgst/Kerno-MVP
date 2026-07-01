# Frontend Data

## Purpose
This folder contains static frontend data used to render UI sections.

## Analogy
Think of this folder as prepared content: components can read structured data without embedding every item directly in JSX.

## Contents
- `homeData.js` contains structured content used by the public homepage.

## How It Fits in KERNO
Static data keeps landing page sections easier to scan and update while the main marketplace data continues to come from backend services.

## Maintenance Notes
Use this folder for stable frontend-only data. Dynamic product, supplier, store, user, or request data should come from the API service layer.
