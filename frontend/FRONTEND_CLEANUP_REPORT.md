# Frontend cleanup report

Date: 2026-06-23

## Summary

This cleanup focused on removing unused frontend code, reducing duplicated React code, and lowering the amount of JavaScript loaded by the client.

The application still passes lint and production build after the changes.

## What changed

### Routing

- `src/routes/routeConfig.js` now owns both route metadata and the page component for each route.
- `src/routes/AppRoutes.jsx` no longer contains a long manual `if` chain to map route paths to pages.
- Route pages are now loaded with `React.lazy`.
- `AppRoutes` wraps routes in `Suspense` with the existing loading UI.

Impact:

- Less duplicated routing logic.
- Easier to add or edit a route in one place.
- Much smaller initial JavaScript bundle.

### Dashboard components

The store and supplier dashboard pages now reuse the existing shared dashboard components:

- `DashboardIntro`
- `DashboardStats`
- `DashboardRequestsPanel`
- `DashboardQuickActions`
- `DashboardProfileCard`
- `StoreRecommendedSuppliers`
- `SupplierProductsPreview`

Impact:

- Removed duplicated dashboard JSX.
- Kept the same visual structure and behavior.
- Dashboard page files are shorter and easier to read.

### Location autocomplete

- Removed the `country-state-city` dependency.
- Replaced it with `src/data/franceCities.txt`, a compact France-only city dataset.
- `LocationSelect` now imports that text file with Vite raw import and parses it locally.

Impact:

- The autocomplete still supports French city suggestions.
- The app no longer ships worldwide city/state data.
- The location chunk dropped from about `8.8 MB` minified before replacement to about `469 kB` minified.

### Removed unused files

The following files were removed because they were not referenced anymore:

- `src/pages/PlaceholderPage.jsx`
- `src/components/shared/DashboardStatCard.jsx`
- `src/services/index.js`
- `src/utils/formPayload.js`
- `src/assets/hero.png`
- `src/assets/react.svg`
- `src/assets/vite.svg`

### Dependencies

- Removed `country-state-city` from `frontend/package.json`.
- Updated `frontend/package-lock.json` through `npm uninstall country-state-city`.

## Build impact

Before route lazy loading, the main frontend bundle was around:

- `index-*.js`: about `9.2 MB` minified
- gzip: about `2.5 MB`

After route lazy loading:

- `index-*.js`: about `244 kB` minified
- gzip: about `77 kB`

The route pages are now split into smaller chunks loaded on demand.

After replacing `country-state-city`, the largest remaining lazy chunk is:

- `LocationSelect-*.js`: about `469 kB` minified
- gzip: about `108 kB`

No Vite large chunk warning remains in the latest build.

## Verification run

Commands run from the repository root:

```bash
rtk npm --prefix frontend run lint
rtk npm --prefix frontend run build
```

Both commands passed.

Additional checks:

- Searched for stale references to removed files and dependencies.
- Checked the frontend import graph for unreferenced `src` files.
- Confirmed `country-state-city` is no longer present in `frontend/package.json`.

Result:

- No stale references found.
- No unreferenced frontend source files detected.
- Production build completes successfully.

## Notes

`npm --prefix frontend ls --depth=0` reports a few extraneous packages in the local `node_modules` directory. They are not listed in `package.json` and are not included in the production build. I did not prune `node_modules` because it is an environment cleanup, not a required source-code change.
