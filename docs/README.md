# Documentation KERNO

## Commencer ici

Pour comprendre le projet sans parcourir toute l'arborescence :

1. [`../README.md`](../README.md) — vue d'ensemble, démarrage, architecture, workflow et tests ;
2. [`../CONTRIBUTING.md`](../CONTRIBUTING.md) — règles de contribution et branche d'intégration `develop-V2` ;
3. [`../AGENTS.md`](../AGENTS.md) — consignes opérationnelles pour les agents ;
4. [`architecture/APPLICATION_ARCHITECTURE.md`](./architecture/APPLICATION_ARCHITECTURE.md) — architecture globale ;
5. [`api/API_SUMMARY.md`](./api/API_SUMMARY.md) — référence API courante ;
6. [`database/DATABASE_SCHEMA.md`](./database/DATABASE_SCHEMA.md) — schéma de données ;
7. [`testing/TESTING_EVIDENCE.md`](./testing/TESTING_EVIDENCE.md) — stratégie et preuves de tests ;
8. [`security/README.md`](./security/README.md) — sécurité ;
9. [`docker/CI_CD.md`](./docker/CI_CD.md) — CI/CD et déploiement.

> La branche d'intégration active de la V2 est `develop-V2`. Les documents Stage 4 sont conservés comme historique lorsqu'un document plus récent existe.

## Objectif

Ce dossier centralise la documentation produit, architecture, API, base de données, sécurité, tests, déploiement, démonstration, audits et historique de livraison de KERNO.

## Carte des dossiers

- `architecture/` — architecture applicative, backend, frontend et CSS ;
- `api/` — comportement de l'API et références historiques ;
- `database/` — schéma de données, Prisma et décisions liées à la base ;
- `security/` — authentification, contrôles d'accès et notes de sécurité ;
- `testing/` — stratégie, rapports, preuves et ressources Postman ;
- `docker/` — développement local Docker, CI/CD et déploiement ;
- `demo/` — scénario de démonstration ;
- `reports/` — rapports de clôture et exports de référence ;
- `review/` — notes de revue technique et préparation des revues manuelles ;
- `audits/` — audits ciblés de qualité, sécurité et cohérence ;
- `sprints/` — planification, reviews et rétrospectives Stage 4 ;
- `assets/` — images utilisées par la documentation.

## Documents transverses utiles

- [`STAGE4_DELIVERABLE_LINKS.md`](./STAGE4_DELIVERABLE_LINKS.md) — liens historiques Stage 4 ;
- [`reports/KERNO_STAGE5_REPORT_FR.pdf`](./reports/KERNO_STAGE5_REPORT_FR.pdf) — rapport de clôture Stage 5 ;
- [`demo/DEMO_SCENARIO.md`](./demo/DEMO_SCENARIO.md) — scénario de démonstration ;
- [`review/TECHNICAL_REVIEW_NOTES.md`](./review/TECHNICAL_REVIEW_NOTES.md) — notes de revue technique.

## Règle de lecture

Privilégier, dans cet ordre : état actuel du dépôt/GitHub, code et configuration de `develop-V2`, documentation active, puis rapports historiques. Un document historique ne doit pas remplacer une vérification possible dans le code ou la CI.

## Maintenance

Conserver les détails proches du code dans les README des sous-dossiers. Les décisions transverses, les explications d'architecture et les preuves durables restent dans `docs/`.