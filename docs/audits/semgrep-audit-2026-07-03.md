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

Mise à jour après l'issue #232 : l'authentification ne stocke plus le JWT dans le localStorage frontend. Le backend pose désormais un cookie d'authentification HttpOnly, SameSite=Lax en local, et Secure en production. Le frontend envoie les cookies via les requêtes API avec credentials, sans injecter manuellement de header Authorization.

## Lien avec issue #232

Ce finding est rattaché à l’issue #232 : migration du stockage JWT depuis localStorage vers un cookie sécurisé.

Le commentaire GitHub de l’issue #232 a été mis à jour pour mentionner ce finding et la documentation associée :

- docs/audits/semgrep-audit-2026-07-03.md

KERNO migre vers une authentification par cookie HttpOnly dans cette branche. Le sujet CSRF reste un point de vigilance à traiter avant un vrai déploiement production, surtout si SameSite=None ou un contexte cross-site complet devient nécessaire.

Points vérifiés ou à conserver comme vigilance :

- choisir une stratégie SameSite adaptée : Lax ou Strict si possible ;
- si SameSite=None ou un vrai contexte cross-site est nécessaire, prévoir une protection CSRF adaptée pour les routes d’écriture ;
- configurer CORS avec credentials sans wildcard ;
- vérifier login/register/logout ;
- vérifier le refresh sur route protégée ;
- vérifier que localStorage ne contient plus kerno_auth_token après migration ;
- vérifier que le cookie disparaît correctement au logout.

## Décision

La correction code est réalisée dans cette branche : suppression du stockage JWT frontend, cookie HttpOnly backend, CORS credentials et logout avec suppression du cookie.

Le finding est documenté comme point de vigilance sécurité à traiter dans le cadre de l’issue #232.

## Validations à exécuter avant commit

- npm --prefix frontend run lint
- npm --prefix frontend run build
- npm --prefix backend test
- git diff --check

## Conclusion

L’audit Semgrep reste satisfaisant pour cette passe : le finding CSRF reste documenté comme point de vigilance production, tandis que le risque principal de stockage JWT dans localStorage est traité par l’issue #232.
