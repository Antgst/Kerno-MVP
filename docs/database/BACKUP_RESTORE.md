# PostgreSQL — sauvegarde et restauration KERNO

Date de validation initiale : 2026-08-29

## Objectif

Disposer d'une procédure reproductible permettant de sauvegarder la base PostgreSQL KERNO puis de vérifier qu'une restauration produit bien un schéma et des données exploitables.

La restauration de vérification doit toujours être effectuée dans une base séparée. Une restauration destructive sur la base active n'est jamais l'étape de test par défaut.

## Sauvegarde

KERNO utilise PostgreSQL 16 dans les configurations Docker actuelles.

Exemple avec une URL PostgreSQL sans paramètre Prisma `?schema=public` :

```bash
pg_dump "$PG_SOURCE_URL" \
  --format=custom \
  --no-owner \
  --no-privileges \
  --file=kerno-backup.dump
```

Le format custom permet une restauration avec `pg_restore` et facilite la sélection des objets si nécessaire.

Contrôle minimal :

```bash
test -s kerno-backup.dump
```

## Restauration de vérification

Créer une base distincte :

```bash
createdb --maintenance-db="$PG_ADMIN_URL" kerno_restore_verify
```

Puis restaurer :

```bash
pg_restore \
  --dbname="$PG_RESTORE_URL" \
  --no-owner \
  --no-privileges \
  --exit-on-error \
  kerno-backup.dump
```

Après restauration, vérifier au minimum :

- présence d'une table métier KERNO telle que `users` ;
- présence d'un jeu de données connu ;
- absence d'erreur `pg_restore` ;
- possibilité d'interroger la base restaurée.

## Preuve automatisée RNCP

Le script :

```text
scripts/verify-postgres-backup-restore.sh
```

est conçu **uniquement pour une base jetable de développement ou de CI**. Il :

1. crée une table temporaire de preuve et une ligne connue ;
2. produit un dump PostgreSQL custom ;
3. supprime immédiatement la table de preuve de la base source ;
4. crée une base isolée de restauration ;
5. restaure le dump ;
6. vérifie la présence de la table `users` ;
7. vérifie que la ligne de preuve a bien été restaurée ;
8. supprime la base de restauration et le dump temporaire.

Le garde-fou `ALLOW_BACKUP_RESTORE_PROBE=true` est obligatoire pour empêcher une exécution accidentelle sur une base non prévue pour ce test.

### Exemple local avec `compose.yaml`

Après démarrage de PostgreSQL et application des migrations :

```bash
export ALLOW_BACKUP_RESTORE_PROBE=true
export PG_SOURCE_URL='postgresql://kerno_user:kerno_password@localhost:5432/kerno_db'
export PG_ADMIN_URL='postgresql://kerno_user:kerno_password@localhost:5432/postgres'
export PG_RESTORE_DB='kerno_restore_verify'
export PG_RESTORE_URL='postgresql://kerno_user:kerno_password@localhost:5432/kerno_restore_verify'

bash scripts/verify-postgres-backup-restore.sh
```

Résultat attendu :

```text
[backup-restore] SUCCESS: dump restored, KERNO schema present, proof row preserved.
```

## Avant une migration ou un déploiement sensible

1. identifier la version applicative actuellement déployée ;
2. créer une sauvegarde datée ;
3. vérifier que le fichier n'est pas vide ;
4. conserver la sauvegarde hors du volume PostgreSQL actif ;
5. appliquer la migration ;
6. contrôler le healthcheck applicatif et les parcours critiques ;
7. en cas d'échec, suivre la procédure de rollback documentée dans `docs/docker/ROLLBACK.md`.

## Ce que cette preuve démontre pour le RNCP

- utilisation de PostgreSQL ;
- capacité à sauvegarder les données ;
- capacité à restaurer dans un environnement isolé ;
- contrôle du résultat obtenu, et pas seulement exécution d'une commande ;
- prise en compte du risque de perte de données pendant le déploiement.

## Limite

Un test CI de sauvegarde/restauration ne remplace pas une politique d'exploitation réelle : fréquence, rétention, chiffrement, stockage hors site et tests périodiques restent à définir pour une production durable.
