# Kerno — Landing Page

A single-page, Swiss/International-style landing page for **Kerno**, a B2B SaaS
marketplace connecting direct and local suppliers with retail stores.

Static, self-contained, and framework-free — deploy it anywhere.

## Structure

```
Kerno-LandingPage/
├── index.html      # markup (hero · features · about · deliverables · footer)
├── styles.css      # Swiss grid system, brand palette, responsive + reduced-motion
├── script.js       # smooth scroll spy, sticky header, reveal-on-scroll, mobile nav
└── assets/         # real product imagery + logo (WebP), pulled from the Kerno app
```

Brand palette and Inter typeface are taken directly from the live app
(`frontend/src/index.css`): deep green `#164e3f`, orange `#f97316`,
warm ivory `#f8f5ef`, ink `#0f172a`.

## Run locally

Any static server works, e.g.:

```bash
python3 -m http.server 8080
# open http://localhost:8080
```

## Deploy

Push this folder to a static host — **GitHub Pages**, Netlify, Vercel, or Cloudflare
Pages. No build step. The resulting URL is your **Landing Page URL** deliverable.

## ⚠️ Placeholders to fill in

Some links weren't available in the repo yet. They're clearly marked in `index.html`
with `data-placeholder` and currently point to `#` (a click logs a hint to the console).
Search for `data-placeholder` and replace the `href="#"` values:

| Where | What to add |
|---|---|
| Header + hero + final CTA (`data-app-link`) | The deployed app URL (currently points to the GitHub repo) |
| Deliverables → **Landing Page URL** | This page's own deployed URL |
| Deliverables → **YouTube demo** | The YouTube demo video URL |

Already wired with real links: GitHub repository, GitHub project board,
Stage 3 mockups & report (Canva), Holberton School, and every team member's GitHub
and LinkedIn profiles.
