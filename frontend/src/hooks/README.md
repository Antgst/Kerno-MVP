# React Hooks

This directory is reserved for future reusable React hooks.

## Current project decision

The directory is currently intentionally unused during the MVP phase.

For now, page-level state, loading logic, error handling, and API calls are handled directly inside pages and through the existing `frontend/src/services/` layer.

## Future use

This directory may be used later if repeated frontend logic starts appearing across multiple pages.

Possible future hooks could include:

```text
hooks/
├── useAuth.js
├── useCurrentUser.js
├── useProducts.js
├── useRequests.js
├── useSupplierProfile.js
└── useStoreProfile.js
```

## Expected benefits

Reusable hooks could help:

- avoid repeating `useState`, `useEffect`, and service calls across pages;
- centralize loading and error logic;
- expose authenticated user and role data through a reusable `useAuth()` hook;
- simplify dashboard pages by moving data loading logic into dedicated hooks;
- make pages easier to read and maintain.

## Rule for now

Do not introduce hooks too early.

Hooks should only be created when there is clear repeated logic across multiple pages. The goal is to reduce duplication, not to add abstraction for its own sake.

If this directory remains unused near the final review, the team should either implement useful hooks based on real duplication or remove the empty directory to keep the repository clean.
