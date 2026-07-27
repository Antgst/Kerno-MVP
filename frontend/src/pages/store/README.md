# Store Pages

## Purpose
This folder contains route-level screens for the store role.

## Analogy
Think of this folder as the buyer workspace: it helps stores manage their profile and sourcing activity.

## Contents
- `StoreDashboardPage.jsx` renders the store dashboard.
- `StoreProfilePage.jsx` renders the store profile page.

## How It Fits in KERNO
Store pages connect profile data, supplier discovery, product browsing, and request tracking into the store-side experience.

## Maintenance Notes
Keep store-only behavior here. Shared dashboard or profile components should stay reusable when supplier pages need similar UI patterns.
