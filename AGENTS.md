# Instructions pour les agents — KERNO

## Mission

KERNO est une marketplace SaaS B2B qui connecte des fournisseurs locaux ou directs avec des magasins. La branche d’intégration active de la V2 est `develop-V2`.

L’agent doit privilégier des changements ciblés, testables, réversibles et alignés avec le besoin réel. Le dépôt et GitHub priment sur toute mémoire ou documentation historique.

## Sources de vérité

Respecter cet ordre :

1. état actuel du dépôt et de GitHub ;
2. code et configuration de la branche concernée ;
3. issue ou pull request du chantier ;
4. documentation active ;
5. rapports historiques.

Lorsqu’une information peut être vérifiée dans le code, la CI ou GitHub, ne pas la supposer depuis un ancien rapport.

## Branches

- `main` : snapshot MVP/RNCP stable ;
- `develop` : branche historique du MVP déployé ;
- `develop-V2` : branche d’intégration active de la V2 ;
- `project-landing-page` : landing page séparée.

Règles :

- partir de `develop-V2` sauf demande explicite contraire ;
- créer une branche dédiée par chantier ;
- cibler `develop-V2` dans les pull requests V2 ;
- ne jamais pousser directement sur `main`, `develop` ou `develop-V2` sans autorisation explicite ;
- ne jamais fusionner `develop-V2` vers `main` ou `develop` sans autorisation explicite ;
- ne pas synchroniser les branches uniquement pour aligner leurs historiques ;
- pour un correctif multi-branches, réappliquer ou cherry-pick uniquement le correctif validé puis retester chaque branche ;
- ne jamais annoncer un déploiement sans preuve.

Préfixes de branche recommandés : `feat/`, `fix/`, `chore/`, `docs/`, `test/`, `security/`, `refactor/`.

## Carte du dépôt

```text
backend/                 API Express, Prisma, modules métier
frontend/                application React/Vite et tests Playwright
deployment/              configuration de déploiement
.github/workflows/        CI et déploiement
docs/api/                 documentation API
docs/architecture/        architecture
docs/database/            base de données et décisions Prisma
docs/docker/              Docker / CI-CD
docs/security/            documentation sécurité
docs/testing/             stratégie et rapports de tests
```

Ne pas créer d’`AGENTS.md` imbriqué sauf si un sous-système a réellement des règles différentes.

## Environnement validé

- Node.js `22.22.3` via `.nvmrc` ;
- npm `10.9.8` ;
- Docker avec Docker Compose ;
- PostgreSQL `16` via `compose.yaml`.

Installation :

```bash
nvm use
npm ci
npm ci --prefix backend
npm ci --prefix frontend
```

## Commandes de vérification

Backend :

```bash
npm test --prefix backend
```

Frontend :

```bash
npm run lint --prefix frontend
npm run build --prefix frontend
```

E2E lorsque le chantier touche un parcours utilisateur :

```bash
npm run test:e2e --prefix frontend
```

Prisma lorsque la base est concernée :

```bash
cd backend
npm exec prisma -- migrate status
```

Toujours adapter les vérifications au périmètre réel. Ne jamais annoncer un test comme réussi s’il n’a pas été exécuté.

## Méthode de travail

Avant de modifier :

1. vérifier branche et état Git ;
2. lire l’issue et les commentaires utiles ;
3. inspecter les fichiers concernés ;
4. rechercher les PR/commits liés si nécessaire ;
5. suivre le flux de données ou d’exécution ;
6. vérifier les hypothèses avec l’état réel.

Pendant le travail :

- modifier le minimum nécessaire ;
- corriger la cause racine démontrée ;
- corriger les problèmes directement liés au chantier ;
- signaler les problèmes hors périmètre sans détourner la mission ;
- relire le diff avant commit ;
- préserver les conventions existantes lorsqu’elles restent pertinentes.

## Autonomie Git et GitHub

Dans une mission autorisée :

- exploration, diagnostic et modifications réversibles : autonomes ;
- tests, lint, build et corrections directement liées : autonomes ;
- commits locaux : autonomes ;
- push sur la branche de travail : autonome ;
- création et mise à jour de PR vers `develop-V2` : autonomes ;
- suivi CI et commits correctifs liés : autonomes ;
- passage draft → ready lorsque les vérifications sont terminées : autonome.

Le merge reste une frontière humaine :

- ne pas merger sans autorisation explicite ;
- un `go merge` reste valable pour la mission tant que le périmètre ne change pas substantiellement ;
- si le scope change de façon matérielle, demander une nouvelle validation avant merge.

Les fusions vers `main` ou `develop` constituent toujours un changement structurel distinct et nécessitent une autorisation explicite dédiée.

## Déploiement

Le workflow `deploy-develop.yml` déploie la branche `develop`. Il ne doit pas être modifié ou déclenché dans un chantier V2 sans demande dédiée.

- validation locale / CI : autonome ;
- environnement de dev/test réversible lorsqu’un workflow prévu existe : autonome ;
- production, exposition publique, paiement ou action client réelle : autorisation explicite obligatoire ;
- ne jamais confondre un merge avec une autorisation de production.

## Base de données

- ne pas modifier une migration déjà appliquée ;
- créer une nouvelle migration pour un changement de schéma ;
- inspecter le SQL généré ;
- vérifier l’impact sur les données ;
- ne pas supprimer, réinitialiser ou écraser des données difficiles à récupérer sans confirmation explicite ;
- séparer données locales, démonstration et production.

## Sécurité et dépendances

Ne jamais :

- exposer ou committer un secret ;
- committer `.env`, credentials, dumps locaux ou clés ;
- utiliser `npm audit fix --force` sans analyse et autorisation explicite ;
- affaiblir une protection sans justification ;
- fusionner automatiquement une mise à jour majeure de dépendance.

Les secrets peuvent être utilisés pour une action autorisée sans être affichés, journalisés ou versionnés.

Dependabot :

- sa configuration vit sur la branche par défaut ;
- les mises à jour de version V2 ciblent `develop-V2` ;
- patch/minor peuvent être traités normalement après tests ;
- major doivent être évalués comme changement potentiellement structurant ;
- un correctif de sécurité à appliquer sur plusieurs branches doit être validé séparément sur chaque branche.

Budget API payante : **0 € par défaut**. Toute dépense supplémentaire nécessite une autorisation explicite.

## Documentation durable

Mettre à jour la documentation directement impactée lorsqu’un changement affecte :

- comportement produit ;
- API ;
- schéma de données ;
- architecture ;
- sécurité ;
- installation ;
- tests ;
- CI/CD ;
- décision technique durable.

Les décisions structurelles importantes doivent être documentées durablement plutôt que laissées uniquement dans une conversation.

## Definition of Done

Une tâche est terminée lorsque :

- le besoin est couvert ;
- le périmètre est respecté ;
- les vérifications pertinentes sont passées ;
- `git diff --check` est propre ;
- le diff complet a été relu ;
- les risques et limites sont documentés ;
- la documentation impactée est à jour ;
- la PR reflète les tests réellement exécutés ;
- aucune production n’a été déclenchée sans autorisation.

Après merge, vérifier la présence du changement dans la branche cible et nettoyer la branche de chantier uniquement lorsque la fusion est confirmée.

## Rapports

Après une passe substantielle, rapporter au minimum :

- Résultat ;
- Modifications ;
- Vérifications ;
- Git ;
- À retenir ;
- Reste à faire.

Omettre les sections vides. En cas d’erreur ou d’incident, documenter la cause, la correction et le résultat du nouveau test.