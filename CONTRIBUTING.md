# Contribuer à KERNO

## Objet

Ce document décrit le workflow de contribution de KERNO pour la V2. Les instructions opérationnelles destinées aux agents se trouvent dans `AGENTS.md`.

Le processus doit rester simple, vérifiable et adapté à une petite équipe.

## Sources de vérité

Respecter cet ordre :

1. état actuel vérifié sur GitHub ;
2. code et configuration de la branche concernée ;
3. issue ou pull request du chantier ;
4. documentation active ;
5. rapports historiques.

Une information historique ne doit pas être considérée comme actuelle lorsqu’elle peut être vérifiée dans le code, la CI ou GitHub.

## Branches

### `main`

Snapshot stable historique. Aucun commit direct. Toute fusion vers `main` nécessite une validation explicite dédiée.

### `develop`

Branche historique liée au déploiement existant. Elle n’est pas la branche d’intégration V2 et ne doit pas être modifiée par un chantier V2 sans demande explicite.

### `develop-V2`

Branche d’intégration active de la V2.

Par défaut :

- partir de `develop-V2` ;
- créer une branche dédiée ;
- cibler `develop-V2` dans la pull request ;
- ne pas pousser directement sur `develop-V2` ;
- ne pas fusionner `develop-V2` vers `main` ou `develop` sans autorisation explicite.

### `project-landing-page`

Landing page séparée. Ne pas mélanger ses changements avec ceux de l’application V2.

## Branches de chantier

Préfixes recommandés :

- `feat/`
- `fix/`
- `chore/`
- `docs/`
- `test/`
- `security/`
- `refactor/`

Exemples :

```text
fix/dashboard-demandes-en-attente
security/configurer-durees-session
chore/configurer-environnement-v2
docs/aligner-documentation-v2
```

Une branche doit avoir un périmètre clair et, lorsque possible, être liée à une issue.

## Préparation d’un chantier

Avant modification :

1. vérifier la branche active et `git status` ;
2. lire l’issue complète et ses commentaires utiles ;
3. vérifier si le besoin existe encore dans `develop-V2` ;
4. inspecter les fichiers concernés ;
5. rechercher les PR/commits liés si nécessaire ;
6. identifier les vérifications pertinentes.

Pour une ambiguïté technique réversible et à faible risque, choisir l’option la plus cohérente avec le dépôt et la documenter. Pour une décision structurante ou difficile à inverser, proposer la recommandation avant de l’appliquer.

## Règles de modification

Pendant le travail :

- rester dans le périmètre annoncé ;
- privilégier les changements ciblés et réversibles ;
- corriger la cause racine démontrée ;
- éviter les refactorisations sans lien avec le chantier ;
- vérifier régulièrement le diff ;
- ne pas modifier une migration Prisma déjà appliquée ;
- ne pas supprimer ou réinitialiser des données difficiles à récupérer sans confirmation explicite ;
- ne jamais exposer de secret ou de donnée sensible.

`npm audit fix --force` n’est pas autorisé sans analyse et autorisation explicite.

## Conventions de commits

Format recommandé :

```text
type(portée): description en français
```

Types courants : `feat`, `fix`, `docs`, `test`, `chore`, `refactor`, `security`, `style`.

Exemples :

```text
fix(auth): corriger la durée du cookie de session
chore(env): documenter les versions Node et npm
docs(contribution): aligner le workflow sur develop-V2
test(requests): ajouter un scénario de régression fournisseur
```

Ne jamais prétendre dans un commit qu’un test est passé s’il n’a pas été exécuté.

## Workflow Git et pull request

Workflow standard :

1. partir de `develop-V2` ;
2. créer une branche dédiée ;
3. réaliser les changements ;
4. exécuter les vérifications pertinentes ;
5. relire le diff ;
6. créer des commits clairs ;
7. pousser la branche de travail ;
8. ouvrir ou mettre à jour la PR vers `develop-V2` ;
9. suivre la CI et corriger les erreurs directement liées ;
10. passer la PR en prête à relire lorsque les vérifications sont terminées ;
11. fusionner uniquement après autorisation explicite.

Dans une mission autorisée, les commits locaux, le push de la branche de travail, la création de PR, le suivi CI et les correctifs liés sont autonomes.

Le merge reste une frontière humaine. Un `go merge` reste valable pour la mission tant que le périmètre ne change pas substantiellement.

Les pushes directs vers `main`, `develop` ou `develop-V2` restent interdits sans autorisation explicite.

## Contenu d’une pull request

Chaque PR doit préciser :

- le besoin couvert ;
- l’issue liée lorsque applicable ;
- les modifications ;
- les vérifications réellement exécutées ;
- les risques et limites ;
- les impacts base de données, sécurité et déploiement ;
- les éléments volontairement non modifiés.

Utiliser `Closes #123` uniquement lorsque la PR couvre réellement toute l’issue.

Utiliser une PR en brouillon tant que les vérifications ne sont pas terminées.

## Revue de code

La revue doit vérifier :

- adéquation avec le besoin ;
- absence de changement hors périmètre ;
- lisibilité et cohérence architecturale ;
- risques de sécurité ;
- migrations et impacts données ;
- tests exécutés ;
- documentation associée ;
- impact potentiel sur `develop`, `develop-V2`, `main` et le déploiement.

Une approbation ne remplace pas les vérifications techniques.

## Gestion des issues

Une issue doit contenir au minimum :

- contexte ;
- problème ou besoin ;
- périmètre ;
- critères d’acceptation vérifiables ;
- risques ou dépendances connus.

Avant fermeture ou fusion avec une autre issue, vérifier le besoin dans l’état actuel de `develop-V2` et les PR/commits liés.

Les mutations importantes en lot du backlog ou du GitHub Project doivent correspondre à une mission explicitement définie.

## Environnement local

Environnement validé :

- Node.js `22.22.3` via `.nvmrc` ;
- npm `10.9.8` ;
- Docker avec Docker Compose ;
- PostgreSQL `16`.

Installation :

```bash
nvm use
npm ci
npm ci --prefix backend
npm ci --prefix frontend
```

PostgreSQL local :

```bash
docker compose up -d postgres
docker compose exec postgres pg_isready -U kerno_user -d kerno_db
```

Les fichiers locaux d’environnement ne doivent jamais être commités. Utiliser les fichiers `.env.example` du dépôt comme référence.

## Vérifications techniques

Backend :

```bash
npm test --prefix backend
```

Frontend :

```bash
npm run lint --prefix frontend
npm run build --prefix frontend
```

E2E lorsqu’un parcours utilisateur est concerné :

```bash
npm run test:e2e --prefix frontend
```

Prisma lorsque la base est concernée :

```bash
cd backend
npm exec prisma -- migrate status
```

Diff :

```bash
git diff --check
git status --short
git diff
```

Adapter les vérifications au périmètre réel. Ne jamais inventer un résultat.

## Base de données

Pour tout changement de schéma :

- créer une nouvelle migration ;
- inspecter le SQL généré ;
- vérifier l’impact sur les données ;
- tester localement ;
- documenter le risque et le plan de retour si nécessaire.

Ne jamais modifier une migration déjà appliquée.

## Documentation

Mettre à jour la documentation directement impactée par une évolution de :

- comportement produit ;
- API ;
- schéma de données ;
- architecture ;
- sécurité ;
- installation ;
- tests ;
- CI/CD ;
- décision technique durable.

Documents clés : `README.md`, `AGENTS.md`, `CONTRIBUTING.md`, `SECURITY.md`, `docs/api/`, `docs/architecture/`, `docs/database/`, `docs/docker/`, `docs/security/`, `docs/testing/`.

## Sécurité et dépendances

Ne jamais :

- exposer un secret ;
- affaiblir une protection sans justification ;
- fusionner aveuglément une mise à jour de dépendance ;
- considérer un ancien rapport de sécurité comme une preuve de l’état actuel.

Les mises à jour patch/minor peuvent être traitées normalement après vérifications. Les mises à jour majeures doivent être évaluées séparément.

Budget API payante : **0 € par défaut**. Toute dépense supplémentaire nécessite une autorisation explicite.

## Déploiement

Le workflow actuel `deploy-develop.yml` concerne `develop` et ne doit pas être confondu avec la V2.

Un merge de PR ne constitue jamais à lui seul une autorisation de production. Toute mise en production réelle nécessite une autorisation explicite et une preuve de résultat.

## Definition of Done

Une tâche est terminée lorsque :

- le besoin est couvert ;
- le périmètre est respecté ;
- les tests pertinents sont passés ;
- `git diff --check` est propre ;
- le diff a été relu ;
- les risques et limites sont documentés ;
- la documentation impactée est à jour ;
- la PR reflète les vérifications réellement exécutées ;
- aucune production n’a été déclenchée sans autorisation.

Après fusion, vérifier la présence du changement dans la branche cible avant de nettoyer la branche de chantier.