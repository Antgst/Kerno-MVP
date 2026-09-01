<div align="center">
  <img src="./docs/assets/kerno-logo.png" alt="Kerno logo" width="180" />

  <h1>KERNO</h1>

  <p><strong>Marketplace SaaS B2B facilitant la découverte de fournisseurs et les demandes entre magasins et fournisseurs.</strong></p>
</div>

> KERNO est un projet portfolio Holberton et le socle d'une éventuelle initiative entrepreneuriale future. Le nom et l'identité restent provisoires.

## Commencer ici

**Branche d'intégration active : `develop-V2`.**

La branche GitHub par défaut `main` reste un snapshot historique/stable ; elle ne doit pas être utilisée comme référence pour les travaux V2 en cours.

Pour contribuer ou comprendre rapidement le dépôt :

1. ce README — vue d'ensemble et démarrage rapide ;
2. [`CONTRIBUTING.md`](./CONTRIBUTING.md) — workflow Git, conventions et vérifications ;
3. [`AGENTS.md`](./AGENTS.md) — règles opérationnelles pour les agents ;
4. [`docs/README.md`](./docs/README.md) — carte de la documentation détaillée ;
5. [`docs/architecture/APPLICATION_ARCHITECTURE.md`](./docs/architecture/APPLICATION_ARCHITECTURE.md) — architecture ;
6. [`docs/api/API_SUMMARY.md`](./docs/api/API_SUMMARY.md) — API ;
7. [`docs/database/DATABASE_SCHEMA.md`](./docs/database/DATABASE_SCHEMA.md) — base de données ;
8. [`docs/testing/TESTING_EVIDENCE.md`](./docs/testing/TESTING_EVIDENCE.md) — tests ;
9. [`docs/security/README.md`](./docs/security/README.md) — sécurité ;
10. [`docs/docker/CI_CD.md`](./docs/docker/CI_CD.md) — CI/CD et déploiement.

### Règle Git actuelle

- partir de `develop-V2` ;
- créer une branche dédiée ;
- ouvrir la PR **vers `develop-V2`** ;
- ne pas pousser directement sur `develop-V2` ;
- ne pas retargeter les PR V2/RNCP vers `develop` ou `main` ;
- ne jamais merger sans validation explicite après review.

`develop` reste lié au déploiement historique existant. `main` reste le snapshot stable historique. Aucune synchronisation entre ces branches n'est implicite.

---

## Le produit en 30 secondes

KERNO répond à un problème simple : la recherche de fournisseurs reste souvent fragmentée entre annuaires, sites web, contacts, recommandations et échanges informels.

Le MVP structure le premier contact commercial :

```text
Supplier creates a profile
        ↓
Supplier publishes products
        ↓
Store searches products or suppliers
        ↓
Store views details
        ↓
Store sends a contact or quote request
        ↓
Supplier receives and reviews the request
```

### Fonctionnalités principales

**Fournisseur**
- créer et modifier son profil ;
- publier et gérer ses produits ;
- recevoir des demandes de contact/devis ;
- consulter et faire évoluer le statut d'une demande.

**Magasin**
- créer et modifier son profil ;
- rechercher produits et fournisseurs ;
- consulter les fiches détaillées ;
- envoyer une demande structurée ;
- suivre les demandes envoyées.

**Hors périmètre MVP**
- paiement ;
- logistique ;
- messagerie interne ;
- avis/notations ;
- facturation d'abonnement ;
- recommandation avancée ;
- application mobile native.

---

## Stack

| Couche | Technologie |
| --- | --- |
| Frontend | React, JavaScript, Vite, Tailwind CSS |
| Backend | Node.js, Express, JavaScript |
| API | REST, Swagger / OpenAPI |
| Base de données | PostgreSQL |
| ORM | Prisma |
| Authentification | JWT, cookie HttpOnly |
| Dev local | Docker Compose pour PostgreSQL |
| CI / dépôt | GitHub Actions, GitHub, GHCR |

Architecture synthétique :

```text
Browser
  ↓
React Frontend
  ↓ HTTP / JSON
Express REST API
  ↓
Prisma ORM
  ↓
PostgreSQL
```

Le backend suit une architecture de **monolithe modulaire**, organisée par domaines métier (`auth`, `users`, `suppliers`, `stores`, `categories`, `products`, `requests`).

---

## Structure du dépôt

```text
Kerno-MVP/
├── backend/                # API Express, Prisma, modules métier, tests
├── frontend/               # application React/Vite, composants, pages, Playwright
├── deployment/             # configuration de déploiement
├── docs/                   # architecture, API, BDD, sécurité, tests, audits, rapports
├── .github/workflows/      # CI et déploiement
├── scripts/                # scripts utilitaires
├── tools/                  # outils d'audit
├── compose.yaml            # PostgreSQL local
├── CONTRIBUTING.md         # workflow de contribution
├── AGENTS.md               # consignes agents
└── README.md               # porte d'entrée
```

La carte détaillée est dans [`docs/README.md`](./docs/README.md).

---

## Installation locale

### Prérequis

- Git ;
- Node.js `22.22.3` via `.nvmrc` ;
- npm `10.9.8` ;
- Docker avec Docker Compose.

### Installation

```bash
git clone https://github.com/Antgst/Kerno-MVP.git
cd Kerno-MVP
git switch develop-V2
nvm use

npm ci
npm ci --prefix backend
npm ci --prefix frontend
```

Préparer l'environnement backend :

```bash
cp backend/.env.example backend/.env
```

Ne jamais committer de secret ou de fichier `.env` local.

### PostgreSQL + Prisma

```bash
docker compose up -d postgres
docker compose exec postgres pg_isready -U kerno_user -d kerno_db

cd backend
npm exec prisma -- generate
npm exec prisma -- migrate status
npm exec prisma -- migrate deploy
cd ..
```

### Démarrer l'application

```bash
npm run dev
```

Services locaux par défaut :

- frontend : `http://localhost:5173` ;
- backend : `http://localhost:5000` ;
- health : `http://localhost:5000/api/health` ;
- Swagger : `http://localhost:5000/api/docs` si `ENABLE_API_DOCS=true`.

Arrêt :

```bash
docker compose down
```

`docker compose down -v` supprime les données PostgreSQL locales : ne l'utiliser qu'intentionnellement.

---

## Vérifications

Backend :

```bash
npm test --prefix backend
```

Frontend :

```bash
npm run lint --prefix frontend
npm run build --prefix frontend
```

E2E lorsqu'un parcours utilisateur est concerné :

```bash
npm run test:e2e --prefix frontend
```

Prisma lorsqu'un changement touche la base :

```bash
cd backend
npm exec prisma -- migrate status
```

Avant commit/PR :

```bash
git diff --check
git status --short
git diff
```

Toujours documenter uniquement les vérifications réellement exécutées.

---

## API

L'API est exposée sous `/api`.

Domaines principaux :

- `/api/auth`
- `/api/users`
- `/api/suppliers`
- `/api/stores`
- `/api/categories`
- `/api/products`
- `/api/requests`

Pour les routes et contrats détaillés : [`docs/api/API_SUMMARY.md`](./docs/api/API_SUMMARY.md).

---

## Base de données

Entités principales :

- `users`
- `supplier_profiles`
- `store_profiles`
- `categories`
- `products`
- `contact_requests`

PostgreSQL est utilisé pour la persistance et Prisma centralise l'accès aux données.

Référence : [`docs/database/DATABASE_SCHEMA.md`](./docs/database/DATABASE_SCHEMA.md).

---

## Sécurité

Les principaux mécanismes incluent :

- hachage des mots de passe ;
- authentification JWT ;
- session portée par cookie HttpOnly ;
- contrôle des rôles ;
- contrôle d'ownership sur les ressources protégées ;
- validation côté serveur ;
- CORS configuré par environnement ;
- audits et tests de régression sécurité.

Voir :

- [`SECURITY.md`](./SECURITY.md) — signalement de vulnérabilité ;
- [`docs/security/README.md`](./docs/security/README.md) — documentation sécurité ;
- [`docs/audits/`](./docs/audits/) — audits historiques.

Aucune documentation ne doit être interprétée comme une certification de conformité absolue : les limites et points de vigilance restent documentés.

---

## Tests et qualité

La stratégie combine notamment :

- tests API/backend ;
- tests de contrôle d'accès et sécurité ;
- tests Playwright sur les parcours concernés ;
- contrôles lint/build frontend ;
- validations manuelles ciblées ;
- Postman / Swagger selon le besoin.

Les rapports historiques et preuves sont dans [`docs/testing/`](./docs/testing/).

---

## CI/CD et déploiement

Les workflows GitHub Actions se trouvent dans `.github/workflows/`.

Le déploiement historique est lié à `develop`. **Les travaux V2 et RNCP ne doivent pas être confondus avec une autorisation de déploiement.**

Documentation :

- [`docs/docker/CI_CD.md`](./docs/docker/CI_CD.md)
- [`deployment/`](./deployment/)

---

## Workflow de contribution

`develop-V2` est la branche d'intégration active.

Workflow normal :

```text
develop-V2
   ↓
branche de chantier
   ↓
modifications + vérifications
   ↓
PR vers develop-V2
   ↓
review
   ↓
merge uniquement après autorisation explicite
```

Les PR doivent préciser :

- besoin couvert ;
- modifications ;
- vérifications exécutées ;
- risques/limites ;
- impact BDD, sécurité ou déploiement lorsqu'il existe ;
- éléments volontairement non modifiés.

Règles complètes : [`CONTRIBUTING.md`](./CONTRIBUTING.md).

---

## Documentation

### Parcours rapide

| Besoin | Ouvrir |
| --- | --- |
| Comprendre l'architecture | [`docs/architecture/APPLICATION_ARCHITECTURE.md`](./docs/architecture/APPLICATION_ARCHITECTURE.md) |
| Comprendre le backend | [`docs/architecture/BACKEND_STRUCTURE.md`](./docs/architecture/BACKEND_STRUCTURE.md) |
| Comprendre le frontend | [`docs/architecture/FRONTEND_STRUCTURE.md`](./docs/architecture/FRONTEND_STRUCTURE.md) |
| Voir l'API | [`docs/api/API_SUMMARY.md`](./docs/api/API_SUMMARY.md) |
| Voir la BDD | [`docs/database/DATABASE_SCHEMA.md`](./docs/database/DATABASE_SCHEMA.md) |
| Voir la sécurité | [`docs/security/README.md`](./docs/security/README.md) |
| Voir les tests | [`docs/testing/TESTING_EVIDENCE.md`](./docs/testing/TESTING_EVIDENCE.md) |
| Voir Docker / CI-CD | [`docs/docker/CI_CD.md`](./docs/docker/CI_CD.md) |
| Voir le rapport de clôture Stage 5 | [`docs/reports/KERNO_STAGE5_REPORT_FR.pdf`](./docs/reports/KERNO_STAGE5_REPORT_FR.pdf) |
| Voir toute la documentation | [`docs/README.md`](./docs/README.md) |

Les éléments Stage 4 restent conservés comme **archives de projet** et ne remplacent pas la documentation active lorsque celle-ci existe.

---

## Équipe et responsabilités

KERNO a été développé par trois étudiants Holberton. Les responsabilités ont évolué pendant le projet ; pour éviter d'attribuer à une personne l'ensemble d'un domaine, le tableau ci-dessous reprend les **focus documentés pendant l'implémentation Stage 4** :

| Membre | Focus documenté |
| --- | --- |
| Antoine Gousset | pilotage produit/projet, frontend, UI/UX, documentation, QA visuelle et préparation de démonstration |
| Gwendal Boisard | backend/API, base de données et Prisma |
| Yonas Houriez | intégration, workflow GitHub, support tests et review |

Le projet reste collectif et comporte des contributions transverses au-delà de ces focus.

### Auteurs

- [Antoine Gousset](https://github.com/Antgst)
- [Yonas Houriez](https://github.com/Ausaryu)
- [Gwendal Boisard](https://github.com/Gwendal-B)

---

## Liens projet

- Repository : https://github.com/Antgst/Kerno-MVP
- Project Board : https://github.com/users/Antgst/projects/1/views/1
- Application déployée historique : https://kerno.ausaryu.com/
- Demo Day landing page : https://kerno-landing.netlify.app/
- Stage 3 mockups : https://canva.link/qqyguvw0uxid4ys
- Stage 3 report — EN : https://canva.link/85zocsxjseziifk

---

## Licence et propriété intellectuelle

Aucune licence open source n'est accordée par le README à ce stade.

Le projet a été réalisé dans un cadre pédagogique et est également envisagé comme base d'une éventuelle initiative entrepreneuriale. La publication du dépôt ne vaut pas autorisation de réutilisation, redistribution ou exploitation commerciale.

> Le statut des champs de licence présents dans certains `package.json` doit être traité séparément avant toute clarification juridique définitive ; cette PR documentaire ne les modifie pas.

---

## Source de vérité

En cas de contradiction, utiliser cet ordre :

1. état actuel vérifié sur GitHub ;
2. code et configuration de la branche concernée ;
3. issue ou pull request du chantier ;
4. documentation active ;
5. rapports historiques.

Pour la V2 actuelle, la branche de référence est **`develop-V2`**.