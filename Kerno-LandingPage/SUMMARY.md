# Kerno — Landing Page: résumé de la livraison

Page one-page complète pour **Kerno**, construite en style **Suisse / International
Typographic Style**, à partir du contexte réel du projet (README, assets, palette de
marque, équipe) — pas de template générique.

## Ce qui a été construit

Site statique, sans framework — [index.html](index.html), [styles.css](styles.css),
[script.js](script.js) — avec une grille disciplinée à 12 colonnes, des filets fins,
des numéros d'index éditoriaux (`01 / 02 / 03`), des labels en mono, et un fort
contraste titres/texte. La palette et la typo viennent directement de l'app réelle
(`frontend/src/index.css`) : vert profond `#164e3f`, orange `#f97316`, ivoire chaud,
encre `#0f172a`, police Inter.

### Un seul scroll continu, avec un vrai fil narratif

- **Hero** — image de couverture (asset `landing-background-premium`), le nom KERNO,
  une description en une ligne, une nav indexée (Features · About · Deliverables),
  et un bouton « Open the app », plus une ligne de stats Focus/Stack/Stage.
- **Features** — trois fonctionnalités clés (Supplier discovery, Product visibility,
  Structured requests), chacune avec une vraie photo, un badge, une description et
  des tags, suivies du flow strip supplier → request.
- **About** — une vraie histoire d'origine (la frustration derrière Kerno), une image
  sticky de ferme, la mention Holberton School + lien, et les trois membres de
  l'équipe avec liens GitHub/LinkedIn/X.
- **Deliverables** — une grille de cartes : Landing Page URL, YouTube demo, GitHub
  repo, project board, mockups & rapport Canva, plus une bande CTA finale.
- **Footer** — marque, navigation, liens du projet, équipe.

### Interactions (vérifiées avec Chromium headless réel)

Scroll fluide vers les ancres qui dégage bien le header sticky, mise en surbrillance
de la nav au scroll (scroll-spy), apparition progressive des sections au scroll,
ombre du header au scroll, menu mobile — le tout avec un repli pour
`prefers-reduced-motion`. Zéro erreur console, zéro requête d'asset en échec, et
responsive jusqu'au mobile.

## Vérifications effectuées

- Rendu contrôlé via Chromium headless (Playwright) : captures desktop, mobile, et
  par section, aucune erreur console ni requête échouée.
- Reveal-on-scroll : opacité passe bien à 1 au scroll réel dans la zone visible.
- Scroll-spy : le clic sur « About » active bien le lien de nav correspondant.
- Offset d'ancrage : le titre de la section « About » dégage bien le header sticky
  (270px de marge contre 75px de hauteur de header).

## Ce qu'il reste à compléter — 4 éléments

Ces informations n'existaient pas dans le repo, donc elles sont marquées avec
`data-placeholder` dans `index.html` (un clic dessus logue juste un indice dans la
console — pas de navigation morte) :

1. **URL de l'app déployée** — pointe actuellement vers le repo GitHub
   (attribut `data-app-link`, 3 emplacements : header, hero, CTA final)
2. **Landing Page URL** — le lien de déploiement de cette page elle-même
3. **YouTube demo** — l'URL de la vidéo de démo
4. **LinkedIn + X** pour chaque membre de l'équipe (les liens GitHub sont déjà réels)

Tout le reste — repo GitHub, project board, mockups/rapport Canva, lien Holberton,
GitHub de chaque membre — est déjà relié avec de vraies URLs.

## Note sur le bouton « Open the app »

Utilisé comme cible provisoire le repo GitHub, car aucun environnement de production
n'existe encore (confirmé par `docs/STAGE4_DELIVERABLE_LINKS.md` dans Kerno-MVP :
« No public production environment is listed at this stage »). À remplacer par l'URL
live dès que le MVP est déployé.

## Déploiement

Voir [README.md](README.md) pour les instructions de lancement local et de
déploiement (GitHub Pages / Netlify / Vercel / Cloudflare Pages — aucune étape de
build nécessaire).
