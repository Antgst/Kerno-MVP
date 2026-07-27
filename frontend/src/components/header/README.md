# Header Components

## Purpose
This folder contains the public and authenticated header components used across the frontend.

## Analogy
Think of this folder as the application signpost: it keeps users oriented and gives them access to the right navigation actions.

## Contents
- `PublicHeader.jsx` renders the public-facing header.
- `PublicHeaderActions.jsx` renders public header actions.
- `PublicBrandLink.jsx` renders the public brand link.
- `AppHeader.jsx` renders the authenticated application header.
- `AppHeaderAccount.jsx` renders authenticated account actions.
- `AppHeaderBrand.jsx` renders authenticated brand UI.
- `AppHeaderNav.jsx` renders authenticated navigation links.
- `HeaderIcon.jsx` renders shared header icons.
- `headerAccount.js` contains account-related header configuration.
- `headerNavigation.js` contains navigation configuration for header links.

## How It Fits in KERNO
Header components support both the public marketing and auth flow and the logged-in supplier or store experience.

## Maintenance Notes
Keep navigation labels and links in configuration files when they are shared. Keep header components focused on rendering and interaction.
