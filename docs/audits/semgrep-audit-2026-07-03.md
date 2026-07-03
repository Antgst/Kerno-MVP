# Audit Semgrep — 2026-07-03

## Objectif

Scanner le code KERNO avec Semgrep pour repérer des patterns de sécurité ou de qualité potentiellement risqués, sans appliquer de correction automatique.

## Périmètre

- backend/src
- backend/prisma
- frontend/src
- package.json
- backend/package.json
- frontend/package.json

Exclusions :

- node_modules
- frontend/dist
- backend/src/generated

## Méthode

Semgrep a été lancé via Docker, car l’environnement local utilise Python 3.8.10 alors que le CLI Semgrep actuel demande une version Python plus récente.

Commande utilisée :

semgrep scan --config "p/default" --metrics=off

Version Semgrep :

1.167.0

## Résultat

Findings: 1
Severity: INFO
Rule: javascript.express.security.audit.express-check-csurf-middleware-usage.express-check-csurf-middleware-usage
File: backend/src/app.js:10
Subject: no CSRF middleware detected in the Express application

## Analyse

Le finding Semgrep indique qu’aucun middleware CSRF n’a été détecté dans l’application Express.

Dans l’architecture actuelle de KERNO, l’authentification repose encore sur un JWT stocké côté frontend et envoyé manuellement dans l’en-tête HTTP Authorization: Bearer <token>.

Les fichiers concernés sont :

- frontend/src/services/tokenStorage.js : stockage actuel du token dans localStorage ;
- frontend/src/services/apiClient.js : ajout manuel du header Authorization: Bearer ;
- backend/src/middlewares/auth.middleware.js : lecture du Bearer token côté backend.

Dans cet état actuel, le finding CSRF est informatif et non bloquant.

Le risque principal déjà identifié est plutôt le stockage du JWT dans localStorage, car il peut être exposé en cas de faille XSS.

## Lien avec issue #232

Ce finding est rattaché à l’issue #232 : migration du stockage JWT depuis localStorage vers un cookie sécurisé.

Le commentaire GitHub de l’issue #232 a été mis à jour pour mentionner ce finding et la documentation associée :

- docs/audits/semgrep-audit-2026-07-03.md

Si KERNO migre vers une authentification par cookie HttpOnly, le sujet CSRF devra être traité pendant cette migration.

Points à vérifier dans cette future branche :

- choisir une stratégie SameSite adaptée : Lax ou Strict si possible ;
- si SameSite=None ou un vrai contexte cross-site est nécessaire, prévoir une protection CSRF adaptée pour les routes d’écriture ;
- configurer CORS avec credentials sans wildcard ;
- vérifier login/register/logout ;
- vérifier le refresh sur route protégée ;
- vérifier que localStorage ne contient plus kerno_auth_token après migration ;
- vérifier que le cookie disparaît correctement au logout.

## Décision

Aucune correction code n’est réalisée dans cette branche.

Le finding est documenté comme point de vigilance sécurité à traiter dans le cadre de l’issue #232.

## Validations à exécuter avant commit

- npm --prefix frontend run lint
- npm --prefix frontend run build
- npm --prefix backend test
- git diff --check

## Conclusion

L’audit Semgrep est satisfaisant pour cette passe : un seul finding informatif, déjà relié à une issue sécurité existante, sans correction urgente à appliquer dans l’état actuel du projet.
