# PostgreSQL — comptes et droits KERNO

Date : 2026-08-29

## État réellement observé

La configuration de production actuelle crée PostgreSQL avec :

- `POSTGRES_USER` ;
- `POSTGRES_PASSWORD` ;
- `POSTGRES_DB`.

L'application construit actuellement `DATABASE_URL` avec **ce même `POSTGRES_USER`**.

Cela signifie que KERNO ne possède pas encore, dans la configuration de déploiement actuelle, de séparation explicite entre :

- le compte propriétaire/migration de la base ;
- le compte runtime de l'application.

Cette limite est documentée volontairement : il serait incorrect de présenter l'état actuel comme un modèle de moindre privilège déjà appliqué.

## Modèle recommandé

### 1. Rôle propriétaire / migration

Usage : création du schéma et application des migrations Prisma.

Droits attendus :

- propriétaire des objets applicatifs ou rôle dédié à la migration ;
- DDL nécessaire aux migrations (`CREATE`, `ALTER`, `DROP` sur les objets concernés) ;
- pas d'utilisation par le serveur applicatif pendant son fonctionnement normal si une séparation stricte est mise en place.

### 2. Rôle runtime `kerno_app`

Usage : connexion quotidienne de l'API Express.

Droits minimaux typiques :

- `CONNECT` sur la base ;
- `USAGE` sur le schéma `public` ;
- `SELECT`, `INSERT`, `UPDATE`, `DELETE` sur les tables nécessaires ;
- `USAGE`, `SELECT` sur les séquences si le modèle en utilise ;
- aucun `CREATEDB` ;
- aucun `CREATEROLE` ;
- pas de droits DDL si l'application n'en a pas besoin à l'exécution.

Exemple indicatif à adapter à l'environnement :

```sql
REVOKE CREATE ON SCHEMA public FROM PUBLIC;

CREATE ROLE kerno_app LOGIN PASSWORD '<secret-managed-outside-git>';
GRANT CONNECT ON DATABASE kerno_db TO kerno_app;
GRANT USAGE ON SCHEMA public TO kerno_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO kerno_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO kerno_app;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO kerno_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO kerno_app;
```

Ce SQL est un **modèle de durcissement**, pas une migration déjà appliquée au déploiement KERNO.

### 3. Rôle de sauvegarde

Selon l'exploitation, une sauvegarde peut être réalisée avec un compte dédié en lecture suffisante pour `pg_dump`, sans lui donner de droits de modification applicative.

Le choix exact dépend du mode d'hébergement et de la politique de sauvegarde.

## Pourquoi séparer les rôles

- limite l'impact d'une compromission de l'application ;
- évite qu'un bug runtime puisse modifier le schéma ;
- clarifie les responsabilités : migration, exploitation, sauvegarde ;
- applique le principe du moindre privilège.

## Secrets

Les mots de passe et URLs de connexion ne doivent pas être versionnés dans Git. KERNO utilise des variables d'environnement / fichiers d'environnement pour injecter les valeurs de déploiement.

## Décision pour le MVP actuel

Pour ne pas modifier brutalement une infrastructure déjà fonctionnelle uniquement pour le RNCP, la séparation propriétaire/runtime est documentée comme **amélioration de durcissement à appliquer avant une production plus exigeante**.

La preuve RNCP consiste à :

1. montrer l'état réel ;
2. identifier le risque ;
3. expliquer les droits nécessaires ;
4. proposer un modèle de moindre privilège applicable ;
5. ne pas prétendre qu'un durcissement non déployé l'est déjà.

## Statut

`DOCUMENTÉ — DURCISSEMENT NON ENCORE APPLIQUÉ`
