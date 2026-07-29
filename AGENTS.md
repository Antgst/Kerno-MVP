# Instructions pour les agents — KERNO

## Contexte produit

KERNO est une marketplace SaaS B2B qui connecte des fournisseurs locaux ou directs avec des magasins.

Le parcours MVP actuel couvre :

- le profil fournisseur ;
- les produits fournisseur ;
- le profil magasin ;
- le catalogue et la recherche ;
- les détails fournisseur et produit ;
- les demandes de contact ou de devis ;
- le suivi des demandes envoyées et reçues.

Le MVP ne comprend pas encore :

- le paiement ;
- la commande complète ;
- la livraison ;
- la facturation ;
- une messagerie avancée.

## Sources de vérité

Respecter cet ordre :

1. état actuel du dépôt GitHub ;
2. code et documentation de la branche concernée ;
3. issue ou pull request du chantier ;
4. documentation du dépôt ;
5. rapports historiques des anciens stages.

Ne jamais supposer qu’une information historique est encore vraie lorsqu’elle peut être vérifiée dans le code ou sur GitHub.

## Branches

- `main` : version stable historique ;
- `develop` : branche conservée pour le déploiement Ausaryu existant ;
- `develop-V2` : branche d’intégration active de la V2 ;
- `project-landing-page` : landing page séparée.

Règles :

- partir de `develop-V2` sauf demande explicite contraire ;
- créer une branche dédiée par chantier ;
- cibler `develop-V2` dans les pull requests ;
- ne jamais fusionner `develop-V2` vers `main` ou `develop` sans accord explicite ;
- ne jamais modifier le workflow de déploiement de `develop` sans chantier et validation dédiés ;
- ne jamais annoncer un déploiement sans preuve.

Préfixes de branche autorisés :

- `feat/`
- `fix/`
- `chore/`
- `docs/`
- `test/`
- `security/`
- `refactor/`

## Workflow Git

Avant toute modification :

1. vérifier la branche active ;
2. exécuter `git status` ;
3. lire l’issue complète ;
4. inspecter les fichiers concernés ;
5. rechercher les PR ou commits liés lorsque nécessaire.

Pendant le travail :

- limiter les changements au périmètre du chantier ;
- éviter les refactorisations non demandées ;
- conserver des changements ciblés, testables et réversibles ;
- inspecter le diff avant tout staging ;
- ne pas utiliser `git add -A` sans validation complète du périmètre.

Avant une pull request :

- exécuter les tests pertinents ;
- vérifier `git diff --check` ;
- vérifier le diff complet ;
- documenter les tests, limites et risques ;
- utiliser une PR en brouillon si les vérifications ne sont pas terminées.

Ne jamais pousser, ouvrir une PR ou fusionner sans demande explicite d’Antoine.

## Nettoyage après fusion

Après chaque pull request fusionnée :

1. revenir sur `develop-V2` ;
2. récupérer la branche distante ;
3. vérifier que la fusion est présente ;
4. supprimer la branche locale du chantier ;
5. supprimer la branche distante si GitHub ne l’a pas déjà supprimée ;
6. exécuter `git fetch origin --prune` ;
7. vérifier l’état final du dépôt.

Ne jamais supprimer une branche avant confirmation de sa fusion.

## Langue

Tout contenu humain lié à KERNO doit être rédigé en français :

- issues ;
- pull requests ;
- commentaires de revue ;
- documentation ;
- notes produit ;
- descriptions de commits.

Les préfixes techniques standardisés peuvent rester en anglais.

Exemple :

```text
fix(auth): corriger la durée du cookie de session
```

Les noms de fichiers, commandes, identifiants de code, routes API et noms de bibliothèques restent inchangés.

## Environnement local

Environnement actuellement validé :

- Node.js `22.22.3` via `.nvmrc` ;
- npm `10.9.8` ;
- Docker récent avec Docker Compose ;
- PostgreSQL `16` via `compose.yaml`.

Commandes d’installation :

```bash
nvm use
npm ci
npm ci --prefix backend
npm ci --prefix frontend
```

Ne jamais committer :

- `.env` ;
- secrets ;
- identifiants ;
- exports locaux de base de données ;
- caches ou fichiers générés.

Utiliser les fichiers `.env.example` comme référence.

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

Tests E2E lorsque le chantier les nécessite :

```bash
npm run test:e2e --prefix frontend
```

Base de données :

```bash
cd backend
npm exec prisma -- migrate status
```

Adapter les vérifications au périmètre réel du changement.

Ne jamais inventer un résultat de test.

## Base de données

- ne pas modifier une migration déjà appliquée ;
- créer une nouvelle migration pour tout changement de schéma ;
- inspecter le SQL généré ;
- ne pas supprimer ou réinitialiser des données sans accord explicite ;
- séparer clairement données locales, démonstration et production.

## Sécurité

Prioriser :

1. stabilité et sécurité ;
2. validation terrain ;
3. irritants du parcours existant ;
4. mesure de l’usage ;
5. fonctionnalités validées ;
6. expérimentations ;
7. fonctions transactionnelles complexes.

Ne jamais :

- exposer un secret ;
- affaiblir une protection sans justification ;
- utiliser `npm audit fix --force` sans analyse et accord explicite ;
- fusionner une mise à jour de dépendance sans vérifier les tests et le diff ;
- considérer un rapport de sécurité historique comme un état actuel.

## Définition de terminé

Une tâche est terminée lorsque :

- le besoin de l’issue est couvert ;
- aucun changement hors périmètre n’est inclus ;
- les tests pertinents sont passés ;
- le diff a été relu ;
- la documentation est mise à jour si nécessaire ;
- les risques et limites sont indiqués ;
- la pull request est validée et fusionnée ;
- la branche du chantier est nettoyée.
