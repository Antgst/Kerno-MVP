# Rollback de déploiement KERNO

Date : 2026-08-29

## Contexte

Le pipeline de déploiement KERNO publie des images GHCR avec :

- un tag mobile `develop` ;
- un tag immuable `sha-<commit>`.

Le fichier `deployment/compose.production.yaml` accepte la variable `KERNO_TAG`, ce qui permet de redéployer explicitement une image précédente.

Le conteneur applicatif applique `npx prisma migrate deploy` au démarrage avant de lancer le serveur.

## Principe

Un rollback applicatif et un rollback de données ne sont pas la même opération.

- **Application** : revenir à une image GHCR connue et précédemment validée.
- **Base de données** : ne jamais supposer qu'un retour d'image annule automatiquement une migration déjà appliquée.

Pour cette raison, une sauvegarde PostgreSQL avant une migration sensible constitue le filet de sécurité des données.

## Rollback applicatif

### 1. Identifier le dernier commit sain

Exemple :

```text
sha-0123456789abcdef...
```

Le SHA doit correspondre à une image déjà construite et validée.

### 2. Positionner le tag précédent

Dans l'environnement de déploiement :

```bash
export KERNO_IMAGE='ghcr.io/antgst/kerno-mvp'
export KERNO_TAG='sha-<commit-sain>'
```

### 3. Redéployer

```bash
docker compose --env-file data/.env -f compose.production.yaml pull app
docker compose --env-file data/.env -f compose.production.yaml up -d --remove-orphans app
```

### 4. Vérifier

```bash
curl --fail http://127.0.0.1:5000/api/health
```

Puis tester les parcours critiques :

- connexion ;
- consultation catalogue ;
- création/lecture des ressources principales selon le scénario concerné.

## Cas des migrations Prisma

`prisma migrate deploy` applique les migrations versionnées mais n'est pas un mécanisme automatique de rollback destructif.

Stratégie retenue :

1. privilégier des migrations compatibles avec la version précédente quand cela est raisonnable ;
2. sauvegarder la base avant une migration risquée ;
3. si le code échoue mais que le schéma reste compatible, revenir simplement à l'image précédente ;
4. si la migration a rendu les données ou le schéma incompatibles, interrompre les écritures et choisir explicitement entre :
   - correction en avant (`forward fix`) ;
   - restauration contrôlée de la sauvegarde pré-migration.

La restauration doit être un dernier recours car elle peut supprimer les écritures effectuées depuis la sauvegarde.

## Restauration contrôlée après incident

Avant toute restauration destructive :

1. arrêter ou mettre en maintenance l'application ;
2. conserver si possible une sauvegarde de l'état en échec pour analyse ;
3. restaurer d'abord la sauvegarde dans une base isolée ;
4. vérifier schéma et données ;
5. documenter la fenêtre de perte potentielle de données ;
6. restaurer la base active uniquement après décision explicite ;
7. redéployer l'image compatible ;
8. vérifier healthcheck et parcours métier.

La procédure technique de sauvegarde/restauration est détaillée dans `docs/database/BACKUP_RESTORE.md`.

## Checklist post-déploiement / post-rollback

- [ ] conteneur PostgreSQL healthy ;
- [ ] conteneur application healthy ;
- [ ] `/api/health` répond sans erreur ;
- [ ] migrations attendues connues ;
- [ ] authentification fonctionnelle ;
- [ ] lecture d'une ressource métier ;
- [ ] écriture contrôlée sur un scénario de test si l'environnement le permet ;
- [ ] logs inspectés pour erreurs répétées ;
- [ ] version réellement déployée enregistrée.

## Preuve RNCP

Cette procédure démontre que le déploiement n'est pas traité comme une simple commande `docker compose up` : KERNO possède une stratégie de retour applicatif, une distinction explicite entre code et données, un contrôle de santé et un lien avec la sauvegarde PostgreSQL.
