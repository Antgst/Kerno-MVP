# Layouts

## Purpose
This folder contains page shells that provide consistent structure around route-level pages.

## Analogy
Think of layouts as frames around a workspace: pages change, but the surrounding navigation and structure stay consistent.

## Contents
- `PublicLayout.jsx` wraps public-facing pages such as the landing, login, register, and fallback screens.
- `AppLayout.jsx` wraps authenticated dashboard-style pages with the application shell.

## How It Fits in KERNO
Layouts keep public navigation separate from authenticated supplier and store workflows while allowing route pages to focus on their own content.

## Maintenance Notes
Keep layout components responsible for structure, not domain data fetching. Route pages should decide what business data they need.
