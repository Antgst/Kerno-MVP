# Rapport d'audit de sécurité KERNO

## 1. Contexte

Ce rapport documente le travail d'audit de sécurité réalisé sur le backend du MVP KERNO et sur les outils de sécurité associés.

- Branche auditée : `experimental-pentesting-antoine`
- Étape : audit local et validation
- Statut de la pull request : aucune pull request n'a été créée à ce stade
- Statut de fusion : aucune fusion n'a été créée à ce stade

L'objectif de cet audit était d'améliorer la posture de sécurité du MVP, de valider les protections critiques de l'API et de fournir un document de revue technique clair, adapté à Holberton, à un portfolio et à une revue d'ingénierie.

## 2. Résumé exécutif

L'audit n'a identifié aucun problème critique ni de sévérité élevée dans les résultats de l'audit statique local. Plusieurs constats de sévérité moyenne et faible restent présents, principalement liés à des opportunités d'amélioration, à la surveillance des dépendances et à des éléments de durcissement du MVP.

Le contrôle d'accès et le durcissement de production ont été améliorés et testés. Le smoke test de sécurité de l'API et le smoke test de durcissement de production se sont tous deux terminés sans échec.

Les principales améliorations couvrent le durcissement CORS, le contrôle de l'exposition de la documentation API en production, les protections de taille et d'analyse des payloads JSON, une gestion plus sûre des erreurs en production et un renforcement des vérifications de propriété des demandes.

## 3. Périmètre

Le périmètre de l'audit incluait :

- le comportement de sécurité de l'API backend ;
- le contrôle d'accès aux demandes et les vérifications de propriété ;
- les valeurs par défaut de durcissement en production ;
- la gestion des payloads JSON ;
- le comportement des réponses d'erreur en production ;
- le résultat de l'audit de sécurité statique local ;
- l'automatisation des smoke tests de sécurité et le comportement de nettoyage ;
- la clarté de la documentation d'environnement.

L'audit n'incluait pas :

- de test d'intrusion externe ;
- de revue de l'infrastructure ou de la configuration cloud ;
- de validation de journalisation ou d'alerting centralisés ;
- de tests de sécurité frontend dans le navigateur au-delà des risques documentés du MVP ;
- de revue manuelle de chaque paquet source de dépendance.

## 4. Fichiers modifiés et ajoutés

Le travail d'audit de sécurité sur la branche auditée inclut les ajouts et changements suivants :

- outil d'audit statique local ajouté : `tools/security-audit/kerno-security-audit.cjs` ;
- smoke test de sécurité API ajouté : `tools/security-audit/kerno-api-security-smoke.cjs` ;
- script de nettoyage des données de smoke test ajouté : `tools/security-audit/kerno-security-smoke-cleanup.cjs` ;
- smoke test de durcissement de production ajouté : `tools/security-audit/kerno-production-hardening-smoke.cjs` ;
- durcissement de sécurité backend appliqué dans la couche API et dans la couche de service des demandes ;
- `backend/.env.example` clarifié.

Ce rapport final a été ajouté sous :

- `docs/security/FR_KERNO_SECURITY_AUDIT_REPORT.md`

## 5. Correctifs de sécurité implémentés

Les correctifs de sécurité suivants ont été implémentés et validés :

- CORS est durci via `CORS_ORIGIN`.
- Swagger/OpenAPI est désactivé par défaut en production.
- Swagger/OpenAPI peut être explicitement activé avec `ENABLE_API_DOCS=true`.
- `express.json` est limité à `1mb`.
- Les payloads JSON invalides sont gérés avec une réponse contrôlée : `Invalid JSON payload`.
- Les erreurs `500` sont masquées aux clients en production, tandis que la journalisation côté serveur reste active.
- `GET /requests/:id` est renforcé avec `requireRole("STORE", "SUPPLIER")`.
- La propriété des demandes est durcie dans la couche de service.
- Les utilisateurs `STORE` peuvent uniquement lire leurs propres demandes envoyées.
- Les utilisateurs `SUPPLIER` peuvent uniquement lire les demandes reçues par leur profil fournisseur.
- Les rôles non pris en charge sont rejetés avec `403`.
- `backend/.env.example` a été clarifié.

## 6. Tests de sécurité ajoutés

La branche inclut des outils de test de sécurité locaux pour permettre une validation répétable :

- outil d'audit statique : `tools/security-audit/kerno-security-audit.cjs` ;
- smoke test de sécurité API : `tools/security-audit/kerno-api-security-smoke.cjs` ;
- script de nettoyage des données de smoke test : `tools/security-audit/kerno-security-smoke-cleanup.cjs` ;
- smoke test de durcissement de production : `tools/security-audit/kerno-production-hardening-smoke.cjs`.

Le smoke test de sécurité API valide l'authentification, l'autorisation, la propriété, le comportement de rejet des payloads et les chemins de requête sensibles pour la sécurité.

Le smoke test de durcissement de production valide des comportements orientés production, comme la documentation API masquée par défaut, les erreurs d'analyse JSON contrôlées et des réponses d'erreur plus sûres en production.

## 7. Résultats de validation

### Audit statique

- Critique : 0
- Élevé : 0
- Moyen : 23
- Faible : 60

### Smoke test de sécurité API

- Réussis : 26
- Échoués : 0

### Smoke test de durcissement de production

- Réussis : 5
- Échoués : 0

### Nettoyage des données de smoke test

- Utilisateurs supprimés : 4
- Profils fournisseurs supprimés : 2
- Profils magasins supprimés : 2
- Produits supprimés : 1
- Demandes de contact supprimées : 1

### Validations réussies

- `backend npm test` : OK
- `frontend npm run lint` : OK
- `frontend npm run build` : OK
- `node --check` sur les scripts de sécurité : OK
- `git diff --check` : OK

## 8. Correspondance OWASP

| Catégorie OWASP | Statut | Notes |
| --- | --- | --- |
| A01 Broken Access Control | Amélioré et testé | Les vérifications de rôle sur les routes de demandes et les contrôles de propriété ont été durcis. |
| A02 Security Misconfiguration | Amélioré et testé | CORS, l'exposition Swagger/OpenAPI en production, les limites JSON et le comportement des erreurs de production ont été durcis. |
| A03 Software Supply Chain Failures | À surveiller | 3 constats backend modérés restent liés aux dépendances Prisma. |
| A04 Cryptographic Failures | Revu | Les secrets sont basés sur l'environnement, et `.env.example` a été nettoyé. |
| A05 Injection | Revu | Le SQL brut de seed local a été accepté comme faux positif. |
| A06 Insecure Design | Revu | Aucun problème bloquant n'a été identifié pour le MVP. |
| A07 Identification and Authentication Failures | Testé | Les jetons manquants et invalides sont rejetés. |
| A08 Software and Data Integrity Failures | Amélioré et testé | Les valeurs `supplierId` des payloads sont ignorées lorsque c'est approprié, et les incohérences produit/fournisseur sont rejetées. |
| A09 Security Logging and Monitoring Failures | Partiellement amélioré | La journalisation côté serveur des erreurs `5xx` a été ajoutée, mais la supervision centralisée n'est pas encore implémentée. |
| A10 Server-Side Request Forgery / Exceptional Conditions | Amélioré et testé | La gestion des JSON invalides a été validée avec une réponse contrôlée. |

## 9. Risques restants du MVP

Les risques suivants restent acceptables pour l'étape actuelle du MVP, mais devront être traités avant la préparation à la production :

- Le jeton d'authentification est encore stocké côté frontend.
- Amélioration future : déplacer le stockage d'authentification vers des cookies HTTP-only, Secure et SameSite.
- Aucune limitation de débit n'est encore implémentée.
- 3 constats backend modérés de `npm audit` restent à examiner avant la livraison finale ou le déploiement.
- La supervision et l'alerting restent limités.
- Aucun test d'intrusion externe n'a été réalisé.

## 10. Limites de l'audit

Cet audit était local et centré sur la base de code. Il améliore la confiance dans l'implémentation actuelle du MVP, mais il ne remplace pas une évaluation de sécurité externe complète.

Limites connues :

- Aucun test d'intrusion externe n'a été réalisé.
- Aucune revue de l'infrastructure, de l'hébergement ou de la couche réseau n'a été incluse.
- Aucune validation de supervision centralisée, de SIEM ou d'alerting n'a été réalisée.
- Des constats liés aux dépendances ont été identifiés pour surveillance, mais ils n'ont pas été entièrement corrigés à cette étape.
- Le modèle de stockage des jetons côté frontend reste un risque du MVP.

Avertissement observé :

- Un `DeprecationWarning` de `pg` est apparu pendant les smoke tests API.
- Il n'était pas bloquant.
- Aucun test de sécurité ou fonctionnel n'a échoué à cause de cet avertissement.
- Il devra être surveillé lors des futures mises à niveau Prisma/PostgreSQL.

## 11. Conclusion

La posture de sécurité du MVP KERNO a été améliorée sur la branche `experimental-pentesting-antoine`.

Les améliorations de sécurité les plus importantes sont désormais couvertes par des smoke tests automatisés, notamment le contrôle d'accès, les vérifications de propriété, le comportement de durcissement en production, la gestion des JSON invalides et les réponses d'erreur contrôlées.

À ce stade, aucun problème critique ni de sévérité élevée ne reste dans les résultats de l'audit statique local, et toutes les commandes de validation documentées se sont terminées avec succès. Les risques restants sont des limites connues du MVP et devront être suivis avant la livraison finale ou le déploiement.
