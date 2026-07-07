# Audit technique — Kerno MVP (2026-07-07)

*Périmètre analysé : backend Express (~3 500 lignes hors code généré), frontend React (~11 500 lignes JS/JSX + ~16 000 lignes CSS), schéma Prisma, tests, CI, dépendances (`npm audit` exécuté), landing statique. Audit statique uniquement : l'application n'a pas été exécutée, les contrastes de couleurs et le comportement runtime n'ont pas été mesurés.*

---

## 1. Résumé exécutif

**État général : bon pour un stade MVP — nettement au-dessus de la moyenne d'un projet portfolio.** Le backend est un monolithe modulaire propre et cohérent (routes → controllers → services, RBAC systématique, Prisma paramétré), le frontend est bien découpé en services/pages/composants avec de bons réflexes d'accessibilité. Aucune faille critique de type injection ou XSS n'a été trouvée, et les secrets ne sont pas versionnés.

**Principaux risques :**
1. **Fuite de coordonnées** : l'API expose email/téléphone des fournisseurs **sans authentification**, alors que le frontend, lui, exige un compte. C'est le seul point que je classe critique.
2. **Aucune protection anti-brute-force** sur le login, pas de headers de sécurité (helmet).
3. **Aucune pagination API** : tout le catalogue est chargé puis filtré côté client — goulot d'étranglement garanti dès que la base grossit (le seed crée déjà ~1 600 produits et 900 demandes).
4. **Pas de tests unitaires backend** : `npm test` ne fait qu'une vérification de syntaxe (`node --check`), et la CI ne lance ni lint, ni build, ni tests.
5. **RGPD inexistant** : liens « Mentions légales / Confidentialité » morts (`href="#"`), aucune suppression de compte. Acceptable tant que le projet n'est pas déployé avec de vrais utilisateurs, non négociable avant.

**Note globale indicative : 7/10** pour un MVP (sécurité 6,5 ; architecture 8 ; qualité 7,5 ; performance 5,5 ; fiabilité 6 ; accessibilité 7,5 ; dépendances 9 ; conformité 3 — pondérée par le stade du projet).

---

## 2. Tableau des problèmes

Gravité : 🔴 Critique · 🟠 Majeur · 🟡 Mineur

### Sécurité

| # | Gravité | Emplacement | Description | Recommandation |
|---|---|---|---|---|
| S1 | 🔴 | `backend/src/modules/suppliers/suppliers.routes.js:10` et `:33` + `suppliers.service.js:28-30` | `GET /api/suppliers` et `GET /api/suppliers/:id` sont **publics** et renvoient `contactEmail`, `phone`, `website`. Le frontend protège ces pages (`access: "auth"` dans `frontend/src/routes/routeConfig.js:41`) mais l'API non → scraping massif des coordonnées sans compte. Incohérence front/back + fuite de données personnelles. | Ajouter `requireAuth` sur ces routes, ou retirer `contactEmail`/`phone` de la variante publique de `getSafeSupplierProfile`. |
| S2 | 🟠 | `backend/src/modules/auth/auth.routes.js:7-8` | Aucun rate limiting sur `/auth/login` et `/auth/register` → brute force et création de comptes en masse possibles. | `express-rate-limit` sur `/api/auth/*` (ex. 10 req/15 min/IP). ~15 lignes. |
| S3 | 🟠 | `backend/src/app.js` | Pas de `helmet` : absence de `X-Content-Type-Options`, `X-Frame-Options`, HSTS, etc. | `app.use(helmet())` — une ligne + une dépendance. |
| S4 | 🟡 | `frontend/src/services/tokenStorage.js:8` + `backend/src/modules/auth/auth.service.js:7` | JWT de 7 jours stocké en `localStorage` : volable en cas de XSS, non révocable. Compromis MVP classique et assumable, mais à documenter. | À ce stade : garder, mais réduire l'expiration (24 h) et noter la migration future vers cookie `httpOnly` + refresh token. |
| S5 | 🟡 | `backend/src/modules/auth/auth.service.js:111-131` | Race condition sur l'inscription : `findUnique` puis `create` → deux requêtes simultanées provoquent une erreur Prisma `P2002` non mappée → 500. Par ailleurs le 409 « Email is already registered » permet l'énumération d'emails (arbitrage UX classique, acceptable en B2B). | Attraper `P2002` dans le middleware d'erreur et le mapper en 409 (voir F3). |
| S6 | 🟡 | `backend/src/modules/categories/categories.routes.js:12-17` | Tout utilisateur SUPPLIER peut créer des catégories **globales** partagées par toute la plateforme → pollution du référentiel commun. | Réserver la création à un futur rôle admin, ou valider/dédupliquer strictement (longueur max, normalisation). |
| S7 | 🟡 | `backend/src/modules/products/products.service.js`, `requests/requests.service.js:105-140` | Pas de longueur maximale sur les champs texte (`name`, `description`, `message`, `subject`…). La limite JSON de 1 Mo (`app.js:34`) borne l'abus, mais un message de 900 Ko reste possible. | Ajouter des longueurs max par champ (ou `@db.VarChar(n)` dans le schéma Prisma). |

**Points sains vérifiés (à conserver)** : bcrypt coût 10 ; JWT vérifié + utilisateur rechargé en base à chaque requête (`auth.middleware.js:44`) ; `requireRole` présent sur toutes les routes d'écriture ; contrôles d'appartenance systématiques (produits, demandes) ; aucune requête SQL brute, aucun `innerHTML`/`dangerouslySetInnerHTML` ; `.env` non versionnés (seuls les `.env.example` le sont) ; message d'erreur de login indifférencié ; stack traces masquées en production ; Swagger désactivable en prod ; CORS restrictif en prod.

### Performance

| # | Gravité | Emplacement | Description | Recommandation |
|---|---|---|---|---|
| P1 | 🟠 | `products.service.js:139-154`, `suppliers.service.js:37-44`, `requests.service.js:153-191` | **Aucune pagination API.** `findMany` sans `take`/`skip`, et le catalogue filtre ensuite tout côté client (`CatalogPage.jsx`). Le seed crée 80 fournisseurs × jusqu'à 20 produits et 900 demandes : chaque affichage du catalogue transfère toute la table. | Ajouter `?page=&limit=` (limit par défaut 20, max 100) + filtres `search`/`categoryId` côté SQL. C'est le chantier perf n°1. |
| P2 | 🟡 | `backend/prisma/schema.prisma` + migrations | Aucun `@@index` : les clés étrangères (`products.supplier_id`, `contact_requests.supplier_id`/`store_id`…) ne sont pas indexées (PostgreSQL n'indexe pas les FK automatiquement — vérifié : aucun `CREATE INDEX` dans les migrations). Toutes les listes filtrées par ces colonnes font des seq scans. | Ajouter `@@index([supplierId])`, `@@index([categoryId])`, `@@index([storeId])`, etc. + `@@index([isActive, createdAt])` sur `products`. |
| P3 | 🟡 | ex. `products.service.js:147-150` | `include: { supplier: true }` charge les entités complètes puis `getSafeProduct` en jette 80 % — sur-fetch systématique. | Remplacer `include` par `select` limité aux champs exposés. |
| P4 | 🟡 | `frontend/src/styles/` | ~16 000 lignes de CSS (plus que le JS applicatif) chargées globalement, en 23 couches successives. Poids du bundle CSS et guerres de spécificité. | Voir A2 — c'est avant tout un problème d'architecture. |

**Points sains** : lazy loading de toutes les routes (`routeConfig.js:1-20`), images en WebP, cache sessionStorage pour user/catégories (`frontendCache.js`), `prefers-reduced-motion` respecté dans la landing.

### Architecture & qualité du code

| # | Gravité | Emplacement | Description | Recommandation |
|---|---|---|---|---|
| A1 | 🟠 | `frontend/src/styles/` | Dette CSS visible et auto-documentée : fichiers numérotés `08-responsive-fixes`, `11-global-polish`, `16-final-ux-polish`, `23-global-visual-harmonization` = couches correctives empilées au lieu de corrections à la source. Chaque nouvelle couche doit surpasser la spécificité des précédentes. | Gel : plus aucune couche « polish ». Puis consolidation progressive par page (le projet a Tailwind : y migrer les styles au fil des retouches). |
| A2 | 🟠 | `SupplierDetailPage.jsx` (661 l.), `SupplierProductFormPage.jsx` (605 l.), `CatalogPage.jsx` (507 l.) | Pages « monstres » qui redéfinissent localement des composants existants : `SupplierDetailPage` recrée sa propre `SupplierProductsToolbar` alors que `components/catalog/CatalogToolbar.jsx` existe. Logique de filtre/tri dupliquée entre catalogue, produits fournisseur et détail fournisseur. | Extraire un hook `useProductFilters` + réutiliser les composants catalog. Le dossier `hooks/` est d'ailleurs **vide** alors que chaque page réécrit le même trio `loading/error/data` dans `useEffect`. |
| A3 | 🟡 | tous les `*.service.js` backend | `createError()` et `validateRequiredString()` copiés-collés dans 6 services (ex. `auth.service.js:15-33`, `products.service.js:17-27`). | Factoriser dans `src/utils/` (le dossier existe déjà avec `phone.js`). |
| A4 | 🟡 | `LoginPage.jsx:21-31`, `utils/jwt.js:25` | `getRoleFromResponse` teste 6 formes de réponse possibles, `getRoleFromToken` en teste 3 : programmation ultra-défensive qui masque un contrat API flou (l'API renvoie toujours `{ user, token }`). | Fixer le contrat de réponse et supprimer les fallbacks. |
| A5 | 🟡 | `Kerno-LandingPage/` (branche courante) | Deuxième landing page statique (HTML/CSS/JS vanilla) à la racine, en doublon conceptuel avec la HomePage React. Code sain (pas de sink XSS, `reduced-motion` géré), mais deux vitrines à maintenir. | Décider : soit c'est une vitrine projet séparée (la déplacer dans `docs/` ou un repo dédié), soit l'intégrer au front React. |
| A6 | 🟡 | validation backend en général | Validation manuelle éparpillée dans les services, sans bibliothèque de schéma. Ça marche, mais chaque nouveau champ = code de validation artisanal. | Adapté au stade MVP ; pour la suite, `zod` en middleware de validation unifierait messages et règles. |

**Points sains** : monolithe modulaire backend exemplaire (routes/controller/service par domaine, nommage homogène) ; frontend organisé par domaine avec composants UI réutilisables (`components/ui/`) ; `apiClient` centralisé propre ; code mort déjà purgé (audit Knip en historique git) ; documentation `docs/` remarquablement fournie.

### Fiabilité & tests

| # | Gravité | Emplacement | Description | Recommandation |
|---|---|---|---|---|
| F1 | 🟠 | `backend/package.json:7` | `npm test` = `node --check` sur 3 fichiers : **une vérification de syntaxe, pas des tests**. Le nom est trompeur pour la CI et les contributeurs. | Renommer en `check:syntax` et introduire de vrais tests unitaires (`node:test` ou vitest + supertest) sur auth et requests au minimum. |
| F2 | 🟠 | `.github/workflows/` | La CI ne contient que React Doctor (advisory, frontend). Ni lint, ni build, ni aucun des tests existants (Playwright, pytest, Newman) n'est exécuté automatiquement — la qualité repose sur la discipline manuelle décrite dans le README. | Workflow GitHub Actions : `npm run lint` + `npm run build` (front), syntax check (back), puis e2e Playwright avec Postgres en service container. |
| F3 | 🟡 | `backend/src/middlewares/error.middleware.js` | Les erreurs Prisma connues ne sont pas mappées : `P2002` (unicité), `P2025` (introuvable) et les UUID malformés partent en 500 « Internal server error ». | Ajouter un mapping des codes Prisma courants → 409/404/400. |
| F4 | 🟡 | toutes les pages avec `useEffect` de fetch (ex. `SupplierDetailPage.jsx`) | Aucun `AbortController`/flag d'annulation : navigation rapide → réponses obsolètes qui écrasent l'état (course), `setState` après démontage. | Pattern `ignore = true` dans le cleanup, ou hook de fetch partagé (rejoint A2). |
| F5 | 🟡 | `health.controller.js`, `server.js` | `/api/health` ne teste pas la connexion DB (répond 200 même base coupée) ; pas de logger de requêtes (morgan/pino) ; pas d'arrêt propre (`SIGTERM`). | Ajouter un `prisma.$queryRaw\`SELECT 1\`` au health check + morgan en dev. Le reste peut attendre un vrai déploiement. |

**Points sains** : middleware d'erreur centralisé avec masquage prod ; états loading/error/empty systématiques côté front ; les tests existants (pytest 1 282 lignes, Playwright 173 lignes, collections Postman/Newman) couvrent bien les parcours critiques — ils sont juste orphelins de la CI.

### Accessibilité & UX

| # | Gravité | Emplacement | Description | Recommandation |
|---|---|---|---|---|
| U1 | 🟠 | `frontend/src/components/home/PublicFooter.jsx:2-5` | « Mentions légales », « Confidentialité », « Conditions d'utilisation », « Contact » pointent tous vers `href="#"`. Liens morts = mauvaise UX et problème de conformité (voir C1). | Créer des pages minimales ou retirer les liens tant qu'elles n'existent pas. |
| U2 | 🟡 | ensemble du front | Non vérifié dans cet audit statique : contrastes de couleurs, parcours clavier complet, gestion du focus après navigation (routes lazy + Suspense). Je ne peux pas juger ces points sans exécuter l'app. | Passe axe-core/Lighthouse + test clavier sur le parcours principal (login → catalogue → demande). |

**Points sains (réels et vérifiés)** : `label htmlFor`, `aria-invalid`, `aria-describedby` reliant erreurs et helpers (`Input.jsx:33-47`) ; `role="alert"` sur `ErrorState.jsx:17` et `aria-live="polite"` sur `LoadingState.jsx:12` ; `aria-labelledby`, `alt` descriptifs, boutons désactivés pendant soumission. C'est au-dessus du standard MVP.

### Dépendances

| # | Gravité | Emplacement | Description | Recommandation |
|---|---|---|---|---|
| D1 | 🟡 | backend `node_modules` | `npm audit` : 3 vulnérabilités **modérées**, toutes dans la chaîne d'outillage dev de Prisma (`@prisma/dev` → `@hono/node-server`, GHSA-92pp-h63x-v22m). N'affecte pas le runtime de production. Frontend : **0 vulnérabilité**. | Surveiller les mises à jour Prisma 7.x ; ne pas lancer `npm audit fix --force` (downgrade cassant vers Prisma 6). |

Stack très à jour (React 19, Express 5, Prisma 7, Vite 8, Tailwind 4, ESLint 10, bcryptjs, jsonwebtoken 9) ; pas de bibliothèque obsolète ou abandonnée détectée ; Knip déjà utilisé pour traquer les dépendances inutilisées. **Meilleur axe du projet.**

### Conformité / RGPD

| # | Gravité | Emplacement | Description | Recommandation |
|---|---|---|---|---|
| C1 | 🟠 (bloquant avant tout déploiement réel) | ensemble du projet | Des données personnelles sont traitées (email, prénom/nom, téléphone dans `schema.prisma:26-49`) mais : aucune politique de confidentialité (lien mort, U1), **aucun endpoint de suppression de compte** (aucun `DELETE` dans les modules users/auth), pas d'info sur la conservation des données, pas de processus pour les droits d'accès/effacement. | Tant que seules des données de seed fictives existent : non bloquant. Avant toute ouverture à de vrais utilisateurs : page confidentialité + mentions légales + suppression de compte (le `onDelete: Cascade` du schéma rend le `DELETE /users/me` simple à implémenter). |
| C2 | 🟡 | `backend/prisma/seed.js:8` | Mot de passe démo unique `Password123!` pour les 130 comptes de seed, et repris en dur dans les tests e2e. Normal en local — dangereux si le seed tourne un jour sur un environnement exposé. | Garde-fou : faire échouer le seed si `NODE_ENV === "production"`. |

---

## 3. Priorisation

### Quick wins (moins d'une journée au total)
1. **S1 — Protéger `/api/suppliers`** : ajouter `requireAuth` ou retirer email/téléphone de la réponse publique (~10 lignes). *Le* correctif à faire en premier.
2. **S2 — Rate limiting** sur `/api/auth/*` (~15 lignes).
3. **S3 — helmet** (1 ligne).
4. **F3 — Mapper P2002/P2025** dans le middleware d'erreur (~15 lignes, corrige aussi S5).
5. **P2 — `@@index`** sur les FK dans le schéma Prisma + une migration.
6. **U1 — Liens morts du footer** : retirer ou créer des pages placeholder honnêtes.
7. **C2 — Bloquer le seed en production** (3 lignes).
8. **F1 — Renommer `npm test`** en `check:syntax` pour ne pas mentir à la CI.
9. **A3 — Factoriser `createError`/`validateRequiredString`** dans `backend/src/utils/`.

### Chantiers de fond
1. **P1 — Pagination + recherche côté API** (products, suppliers, requests) puis adaptation du catalogue front. Impact perf et scalabilité le plus fort.
2. **F2 — CI réelle** : lint + build + e2e Playwright avec Postgres en service container. Les tests existent déjà, il ne manque que le branchement.
3. **A2/F4 — Décomposition des pages > 400 lignes** : hook de fetch partagé (avec annulation), réutilisation des composants catalog, suppression des duplications toolbar/filtres.
4. **A1/P4 — Consolidation CSS** : geler les couches « polish », migrer progressivement vers Tailwind (déjà installé).
5. **C1 — Socle RGPD** avant tout vrai utilisateur : confidentialité, mentions légales, suppression de compte.
6. **S4 — Stratégie de session v2** : cookie httpOnly + refresh token (à planifier, pas urgent au stade MVP).

### Exigence adaptée au stade MVP — arbitrages explicites
- **Non négociables même en MVP** : S1 (fuite de coordonnées — l'API est le produit, le frontend n'est pas une barrière), S2/S3 (coût quasi nul), C2.
- **Acceptables aujourd'hui, à planifier** : JWT en localStorage (S4), absence de zod (A6), absence de tests unitaires exhaustifs (les e2e + pytest couvrent les parcours critiques), énumération d'emails au register, pas de logger structuré (F5).
- **Deviennent bloquants au premier vrai utilisateur** : C1 (RGPD), P1 (pagination).

---

## 4. Conclusion et plan d'action suggéré

Kerno est un MVP sérieusement construit : l'architecture backend est saine, le RBAC est systématique, la stack est moderne et propre, la documentation est exceptionnelle pour un projet de ce stade, et l'accessibilité de base est réellement soignée. Les faiblesses sont typiques d'un MVP qui a privilégié la largeur fonctionnelle : une incohérence d'exposition de données entre front et API (le vrai point rouge), aucun durcissement HTTP, pas de pagination, des tests non branchés en CI, et une dette CSS qui s'est empilée en couches correctives.

**Plan suggéré :**
- **Semaine 1** — Sécurité : les quick wins 1 à 5 (S1, S2, S3, F3, P2). Une demi-journée de travail, élimine tout le rouge et l'essentiel de l'orange sécurité.
- **Semaine 2** — Fiabilité : CI GitHub Actions (lint + build + Playwright), renommage de `npm test`, premiers tests unitaires sur `auth.service` et `requests.service`.
- **Semaines 3-4** — Scalabilité : pagination/recherche API + adaptation du catalogue ; en profiter pour extraire le hook de fetch partagé (traite A2, F4 et P1 dans le même mouvement).
- **Avant tout déploiement public** — Conformité : pages légales, politique de confidentialité, `DELETE /users/me`, expiration JWT réduite.
- **En continu** — Gel des couches CSS « polish » et consolidation opportuniste vers Tailwind à chaque page retouchée.

Points que je n'ai **pas pu juger** (à couvrir par un audit dynamique) : contrastes et parcours clavier réels (U2), comportement sous charge, configuration de production effective (CORS_ORIGIN, ENABLE_API_DOCS — aucun environnement de prod n'existe encore dans le repo).
