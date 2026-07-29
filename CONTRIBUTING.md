# Contribuer à KERNO

## 1. Objet

Ce document décrit le workflow de contribution de KERNO pour la V2 :

- stratégie de branches ;
- conventions de commits ;
- préparation des pull requests ;
- règles de revue ;
- gestion des issues ;
- vérifications techniques ;
- sécurité et documentation ;
- nettoyage après fusion.

KERNO est une marketplace SaaS B2B qui connecte des fournisseurs locaux ou directs avec des magasins.

Le processus doit rester simple, vérifiable et adapté à une petite équipe.

---

## 2. Périmètre produit actuel

Le parcours central couvre :

1. la création d’un compte fournisseur ;
2. la complétion du profil fournisseur ;
3. la gestion des produits fournisseur ;
4. la création d’un compte magasin ;
5. la complétion du profil magasin ;
6. la recherche de produits et de fournisseurs ;
7. la consultation des détails produit et fournisseur ;
8. l’envoi d’une demande de contact ou de devis ;
9. le suivi des demandes envoyées et reçues.

Ne font pas encore partie du MVP :

- le paiement en ligne ;
- le panier ;
- la commande complète ;
- la livraison et le suivi logistique ;
- la facturation ;
- la messagerie avancée ;
- les abonnements complexes ;
- les avis publics ;
- un back-office administratif lourd.

Toute extension importante de ce périmètre doit être validée avant développement.

---

## 3. Sources de vérité

Respecter cet ordre :

1. état actuel vérifié sur GitHub ;
2. code et documentation de la branche concernée ;
3. issue ou pull request du chantier ;
4. documentation du dépôt ;
5. rapports historiques des anciens stages.

Une information historique ne doit pas être considérée comme actuelle lorsqu’elle peut être vérifiée dans le code ou sur GitHub.

---

## 4. Branches principales

### `main`

`main` contient la version stable historique.

Règles :

- aucun commit direct ;
- aucune fusion automatique depuis `develop-V2` ;
- toute fusion vers `main` nécessite une validation explicite ;
- utiliser cette branche pour les versions stables ou les jalons validés.

### `develop`

`develop` est conservée pour le déploiement Ausaryu existant.

Règles :

- ne pas l’utiliser comme branche d’intégration V2 ;
- ne pas la modifier pour un chantier V2 sans demande explicite ;
- ne pas annoncer un déploiement sans preuve issue des checks ou du serveur.

### `develop-V2`

`develop-V2` est la branche d’intégration active.

Règles :

- partir de `develop-V2` par défaut ;
- cibler `develop-V2` dans les pull requests ;
- ne pas committer directement dessus ;
- ne pas la fusionner vers `main` ou `develop` sans demande explicite.

### `project-landing-page`

Cette branche concerne la landing page séparée.

Les changements de la landing page ne doivent pas être mélangés aux chantiers de l’application V2.

---

## 5. Branches de chantier

Créer une branche dédiée par chantier.

Préfixes autorisés :

- `feat/` : nouvelle fonctionnalité ;
- `fix/` : correction de bug ;
- `chore/` : maintenance ou configuration ;
- `docs/` : documentation ;
- `test/` : tests ;
- `security/` : sécurité ;
- `refactor/` : amélioration interne sans changement fonctionnel.

Exemples :

```text
fix/dashboard-demandes-en-attente
security/configurer-durees-session
chore/configurer-environnement-v2
docs/aligner-documentation-v2
```

Une branche doit avoir un périmètre clair et, lorsque possible, être liée à une issue.

---

## 6. Préparation d’un chantier

Avant toute modification :

1. vérifier la branche active ;
2. exécuter `git status` ;
3. lire le corps complet de l’issue ;
4. consulter les commentaires utiles ;
5. rechercher les pull requests et commits liés ;
6. vérifier si le besoin existe encore dans `develop-V2` ;
7. identifier les fichiers et tests concernés.

Ne pas modifier une issue, fermer une issue ou changer son périmètre sans validation préalable lorsque le chantier porte sur le backlog.

---

## 7. Règles de modification

Pendant le travail :

- rester dans le périmètre validé ;
- privilégier les changements ciblés et réversibles ;
- éviter les refactorisations non demandées ;
- ne pas mélanger plusieurs chantiers indépendants ;
- vérifier régulièrement `git status` et le diff ;
- ne pas utiliser `git add -A` lorsque le périmètre complet n’est pas confirmé ;
- ne pas modifier une migration Prisma déjà appliquée ;
- ne pas supprimer ou réinitialiser des données sans accord explicite ;
- ne jamais exposer de secret ou de donnée sensible.

Ne pas utiliser :

```text
npm audit fix --force
```

sans analyse, justification et accord explicite.

---

## 8. Conventions de commits

Les commits doivent être courts, explicites et rédigés en français.

Format recommandé :

```text
type(portée): description en français
```

Types courants :

- `feat`
- `fix`
- `docs`
- `test`
- `chore`
- `refactor`
- `security`
- `style`

Exemples :

```text
fix(auth): corriger la durée du cookie de session
chore(env): documenter les versions Node et npm
docs(contribution): aligner le workflow sur develop-V2
test(requests): ajouter un scénario de régression fournisseur
```

Éviter les messages vagues :

```text
update
fix
changes
wip
test
```

Un commit ne doit pas prétendre qu’un test est passé lorsqu’il n’a pas été exécuté.

---

## 9. Workflow de pull request

Workflow standard :

1. partir de `develop-V2` ;
2. créer une branche dédiée ;
3. réaliser les changements ;
4. exécuter les vérifications pertinentes ;
5. relire le diff ;
6. créer un commit clair ;
7. pousser la branche après accord explicite ;
8. ouvrir une pull request vers `develop-V2` après accord explicite ;
9. utiliser une PR en brouillon si les vérifications ne sont pas terminées ;
10. passer la PR en prête à relire après validation des tests pertinents ;
11. fusionner uniquement après revue et validation.

Ne jamais pousser, ouvrir une PR ou fusionner sans demande explicite d’Antoine.

---

## 10. Contenu d’une pull request

Chaque pull request doit inclure :

- un titre clair en français ;
- un résumé du besoin ;
- l’issue liée lorsque applicable ;
- la liste des modifications ;
- les vérifications exécutées ;
- les résultats observés ;
- les risques et limites ;
- les éléments volontairement non modifiés ;
- les éventuelles suites recommandées.

Structure recommandée :

```markdown
## Résumé

## Issue liée

Closes #123

## Modifications réalisées

## Vérifications effectuées

## Impact sur le déploiement

## Risques et limites

## Éléments non modifiés

## Suite recommandée
```

Utiliser `Closes #123` uniquement lorsque la PR couvre réellement toute l’issue.

---

## 11. Revue de code

La revue doit vérifier :

- l’adéquation avec l’issue ;
- le respect du périmètre MVP ;
- l’absence de changement hors sujet ;
- la lisibilité du code ;
- la cohérence de l’architecture ;
- les risques de sécurité ;
- les migrations et impacts sur les données ;
- les tests exécutés ;
- la documentation associée ;
- l’impact potentiel sur `develop`, `develop-V2` et le déploiement.

Une approbation ne remplace pas les vérifications techniques.

Les commentaires de revue et leurs réponses doivent être rédigés en français.

---

## 12. Gestion des issues

Une issue doit contenir au minimum :

- un titre clair en français ;
- le contexte ;
- le problème ou besoin ;
- le périmètre ;
- des critères d’acceptation vérifiables ;
- les dépendances ou risques connus.

Avant de recommander une fermeture :

- lire le corps complet ;
- consulter les commentaires ;
- rechercher les PR et commits liés ;
- vérifier le besoin dans `develop-V2`.

Catégories d’audit possibles :

- à fermer ;
- doublon ou à fusionner ;
- à conserver ;
- à reformuler ;
- à traiter prochainement ;
- long terme ;
- référence ou archive.

Aucune mutation en lot ne doit être réalisée sans présentation et validation préalables.

---

## 13. GitHub Project

Le GitHub Project sert à représenter l’état réel du travail.

Statuts recommandés :

- Inbox / À analyser ;
- Future Ideas ;
- To do ;
- In progress ;
- In review ;
- Blocked ;
- Done ;
- Reference / Archive.

Priorités recommandées :

- P0 — Critique ;
- P1 — Haute ;
- P2 — Moyenne ;
- P3 — Faible ;
- P4 — Plus tard.

Une carte ne doit pas rester dans `In progress` lorsqu’elle attend une revue.

Une carte ne doit pas passer dans `Done` avant validation réelle.

Lorsque les outils disponibles ne permettent pas de modifier les champs du Project v2, les mouvements doivent être réalisés manuellement et ne doivent pas être annoncés comme effectués.

---

## 14. Environnement local

Environnement validé :

- Node.js `22.22.3` via `.nvmrc` ;
- npm `10.9.8` ;
- Docker récent ;
- Docker Compose ;
- PostgreSQL `16` via `compose.yaml`.

Installation recommandée :

```bash
nvm use
npm ci
npm ci --prefix backend
npm ci --prefix frontend
```

Démarrage local de PostgreSQL :

```bash
docker compose up -d postgres
```

Vérification de PostgreSQL :

```bash
docker compose exec postgres pg_isready -U kerno_user -d kerno_db
```

Les fichiers d’environnement locaux ne doivent pas être commités.

Utiliser :

- `backend/.env.example`
- `frontend/.env.example`
- `deployment/.env.example`

Ne jamais committer :

- `.env` ;
- clés secrètes ;
- identifiants personnels ;
- exports locaux de base de données ;
- caches ;
- rapports locaux générés.

---

## 15. Vérifications techniques

Adapter les vérifications au périmètre du changement.

### Backend

```bash
npm test --prefix backend
```

Ce contrôle vérifie actuellement la syntaxe des principaux fichiers de démarrage du backend.

### Frontend

```bash
npm run lint --prefix frontend
npm run build --prefix frontend
```

### Tests E2E

Lorsque le chantier concerne un parcours utilisateur :

```bash
npm run test:e2e --prefix frontend
```

### Prisma et base de données

```bash
cd backend
npm exec prisma -- migrate status
```

Pour tout changement de schéma :

- créer une nouvelle migration ;
- inspecter le SQL généré ;
- vérifier l’impact sur les données ;
- tester sur une base locale ;
- documenter les risques.

### Vérification du diff

Avant commit :

```bash
git diff --check
git status --short
git diff
```

Ne jamais inventer un résultat de test ou de check.

---

## 16. Documentation

Mettre à jour la documentation lorsqu’un changement affecte :

- le comportement de l’application ;
- une route API ;
- le schéma de base de données ;
- l’installation ;
- l’architecture ;
- la sécurité ;
- les tests ;
- le déploiement ;
- une décision durable.

Documents importants :

- `README.md`
- `CONTRIBUTING.md`
- `AGENTS.md`
- `SECURITY.md`
- `docs/api/`
- `docs/architecture/`
- `docs/database/`
- `docs/docker/`
- `docs/security/`
- `docs/testing/`

La documentation doit rester factuelle et alignée avec l’implémentation réelle.

---

## 17. Sécurité

Priorités produit :

1. stabilité et sécurité ;
2. validation auprès de magasins et fournisseurs réels ;
3. correction des irritants du parcours existant ;
4. mesure de l’usage et des retours ;
5. fonctionnalités validées par le terrain ;
6. automatisations et expérimentations ;
7. fonctions transactionnelles complexes à long terme.

Toute modification de sécurité doit :

- être ciblée ;
- documenter son objectif ;
- éviter les régressions ;
- inclure les tests pertinents ;
- distinguer les faits vérifiés des hypothèses.

Les rapports historiques de sécurité sont des références et non une preuve de l’état actuel.

---

## 18. Travail assisté par IA

Les outils d’IA peuvent aider pour :

- l’audit ;
- la documentation ;
- la revue ;
- le débogage ;
- la préparation de tests ;
- l’analyse d’architecture.

Toute sortie assistée par IA doit être :

- relue ;
- adaptée au dépôt ;
- vérifiée dans le code ;
- testée lorsque nécessaire ;
- comprise par le contributeur.

Ne pas appliquer automatiquement un changement proposé par une IA.

Les instructions opérationnelles destinées aux agents se trouvent dans `AGENTS.md`.

---

## 19. Définition de terminé

Une tâche est terminée lorsque :

- le besoin de l’issue est couvert ;
- le périmètre est respecté ;
- aucun changement hors sujet n’est inclus ;
- les tests pertinents sont passés ;
- le diff a été relu ;
- les risques et limites sont documentés ;
- la documentation est mise à jour si nécessaire ;
- la pull request a été revue et fusionnée ;
- le statut du GitHub Project reflète l’état réel ;
- la branche du chantier a été nettoyée.

---

## 20. Nettoyage après fusion

Après confirmation de la fusion :

1. revenir sur `develop-V2` ;
2. récupérer la branche distante ;
3. vérifier que la fusion est présente ;
4. supprimer la branche locale ;
5. supprimer la branche distante si GitHub ne l’a pas déjà supprimée ;
6. exécuter `git fetch origin --prune` ;
7. vérifier `git branch -vv` ;
8. vérifier `git status`.

Ne jamais supprimer une branche avant confirmation de sa fusion.
