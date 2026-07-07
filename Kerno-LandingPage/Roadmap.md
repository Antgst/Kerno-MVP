
1. Feature Section

    An image, screenshot, gif, or video
    The name of the feature
    A description of the feature

    Ce que je souhaite: 
    Titre
    description

    une card ou section avec dedans: 
    ┌  l'image/gif          |- Titre de la feature
    └  de la feature        |- la descrition de celle ci
    un menu horizontal avec trois boutons: le nom des features

    chaques boutons change le contenu de la section superieure avec la description de la feature associée au bouton

1.Guided profile completion

Stores and suppliers are guided toward a complete professional profile. 
A circular completion gauge gives instant feedback and helps users understand how ready their profile is before they start using the marketplace.

Profile setup · Completion gauge · Trust signals
 
2.Supplier product catalog

Store users can browse products published by suppliers, explore details, categories and pricing information, then identify the offers that match their sourcing needs.

Product cards · Categories · Pricing units

3. Structured requests

Stores can send structured contact or quote requests to suppliers. Each request keeps the conversation tied to a product or business need, making the first contact clearer and easier to track.

Contact request · Quote flow · Status tracking

Deliverables section

    ## Technical Stack Showcase — Deliverables Section

### Goal

Add a dedicated technical stack showcase inside the landing page, placed between the deliverable links and the final “Ready to see Kerno in action?” CTA.

The goal is to make the landing page feel more complete and professional by showing the real technologies used to build the Kerno MVP, not only the project links.

### Why

The current Deliverables section shows useful links such as the repository, demo, project board and reports, but it does not visually communicate the technical work behind the project.

Adding a clean stack section helps visitors, reviewers and recruiters quickly understand that Kerno is a full-stack application with a real frontend, backend, database, authentication, API documentation, testing and tooling workflow.

### Content

Add a small premium block titled:

**Technical stack**

Subtitle:

**Built with a modern full-stack architecture**

Display the real project stack as icon cards or compact pills:

- React
- Vite
- Node.js
- Express
- Prisma
- PostgreSQL
- JWT
- Swagger / OpenAPI
- Playwright
- Docker
- GitHub
- Postman

### Visual Direction

The stack block should match the Kerno visual identity:

- warm ivory / white background
- subtle border
- rounded corners
- soft premium feel
- green and orange accents
- clean spacing
- responsive layout

Each technology should be displayed with its **real official-style icon**, not emoji placeholders.

### Icon Strategy

Use local SVG icons instead of external icon libraries.

Recommended approach:

- Create a folder such as:

```txt
Kerno-LandingPage/assets/stack-icons/
Add one SVG per technology:
react.svg
vite.svg
nodejs.svg
express.svg
prisma.svg
postgresql.svg
jwt.svg
swagger.svg
playwright.svg
docker.svg
github.svg
postman.svg
Use inline <img> tags with accessible alt text.

Example:

<li class="tech-stack__item">
  <img src="assets/stack-icons/react.svg" alt="" aria-hidden="true" />
  <span>React</span>
</li>

The icon can stay decorative if the text label is already visible.

Layout

Desktop:

[Deliverable cards]

[Technical stack]
React   Vite   Node.js   Express   Prisma   PostgreSQL
JWT     Swagger   Playwright   Docker   GitHub   Postman

[Ready to see Kerno in action?]

Mobile:

Technical stack

[React]
[Vite]
[Node.js]
[Express]
...

The block should wrap naturally and remain readable on small screens.

Acceptance Criteria
The stack block appears between the deliverable cards and the final CTA.
All listed technologies are displayed with real SVG icons.
No emoji icons are used.
Icons are stored locally in the landing page assets.
The layout is responsive.
The section visually matches the existing landing page style.
The existing deliverable links and final CTA remain unchanged.



## Landing Page Visual Continuity Pass

### Goal

Improve the visual continuity of the landing page after the new hero image. The hero now has a strong premium photographic background, while the following sections feel too empty because they rely on flat ivory/white backgrounds.

### Tasks

- Add subtle background depth to the page without making it visually noisy.
- Keep the premium, calm and editorial Kerno identity.
- Use warm ivory as the base color.
- Add very soft green/orange radial gradients or section tints.
- Avoid tech lines, dots, network graphics or futuristic overlays.
- Add subtle section separation through background changes, borders or spacing.
- Make the feature section feel more substantial, ideally with larger product screenshots or screenshot-style cards.
- Keep text readability and contrast high.
- Make sure the design stays responsive.

### Suggested visual direction

- Features section: soft pale green background tint.
- About section: warm ivory with a subtle orange glow or image card emphasis.
- Deliverables section: clean light background with stronger card grouping.
- Final CTA: keep the current dark premium block.

### Acceptance Criteria

- No section after the hero feels like a flat empty white area.
- The page still feels clean and premium.
- Background effects remain subtle.
- No decorative tech network lines are added.
- Mobile layout remains clean.

## Desktop Proximity Scroll Snap

Add subtle desktop-only section snapping to improve the landing page navigation flow.

Use CSS `scroll-snap-type: y proximity` on the main content and apply `scroll-snap-align: start` to the main landing sections.

Scope:
- Desktop/tablet only: `min-width: 900px`
- Disabled when `prefers-reduced-motion: reduce`
- Sections: Hero, Features, About, Deliverables

The scroll must remain natural and should not feel locked or forced.

## Anchor Navigation Alignment Fix

### Goal

Fix the section navigation offset when clicking the navbar links.  
Currently, clicking links like `Features`, `About`, or `Deliverables` scrolls to the section wrapper, but the real content appears slightly too low because each section has large top padding. This makes the section feel visually misaligned and can leave part of the content cut off near the bottom of the viewport.

### Problem

The current anchors are placed directly on the `<section>` elements:

```html
<section class="section features" id="features">

Because the section itself includes large vertical padding, the browser scrolls to the start of the empty padded area instead of the actual section content.

Solution

Move the anchor IDs from the section wrapper to the first meaningful content block inside each section.

Example:

<section class="section features" aria-labelledby="features-title">
  <div class="grid section__head reveal" id="features">

Apply the same logic to:

Features
About
Deliverables
CSS Update

Add a shared scroll margin for the new anchor targets:

#features,
#about,
#deliverables {
  scroll-margin-top: calc(var(--header-h) + 24px);
}

Update the desktop-only scroll snap behavior to target the useful anchor blocks instead of the full section wrappers:

@media (min-width: 900px) and (prefers-reduced-motion: no-preference) {
  main {
    scroll-snap-type: y proximity;
  }

  .hero,
  #features,
  #about,
  #deliverables {
    scroll-snap-align: start;
    scroll-margin-top: calc(var(--header-h) + 24px);
  }
}
Acceptance Criteria
Navbar clicks land on the visible start of each section’s real content.
The section no longer appears too low or visually off-center.
Sticky header spacing is respected.
Desktop proximity scroll snap still works.
Mobile scrolling remains natural.
No visual spacing between sections is broken.
