# Résumé

Décrire clairement le besoin couvert et le résultat obtenu.

## Issue liée

- Closes #
- Related to #

Supprimer les lignes inutiles. Utiliser `Closes` uniquement lorsque la pull request couvre entièrement l’issue.

## Modifications réalisées

- 
- 
- 

## Vérifications effectuées

Indiquer chaque commande réellement exécutée et son résultat.

```text
Commande :
Résultat :
```

## Base de données

- [ ] Aucun changement de schéma
- [ ] Une nouvelle migration Prisma est incluse
- [ ] Le SQL généré a été inspecté
- [ ] L’impact sur les données a été vérifié

Précisions :

## Sécurité

Décrire les effets sur l’authentification, les autorisations, les secrets, les cookies, les dépendances ou les données sensibles.

## Impact sur le déploiement

- [ ] Aucun impact attendu
- [ ] Impact identifié et documenté
- [ ] Déploiement vérifié avec une preuve

Ne jamais annoncer un déploiement réussi sans preuve.

## Risques et limites

- 
- 

## Éléments volontairement non modifiés

- 
- 

## Captures ou preuves

Ajouter les captures, logs non sensibles ou résultats utiles lorsque nécessaire.

## Checklist

- [ ] La branche part de `develop-V2`, sauf exception explicitement validée
- [ ] La pull request cible `develop-V2`, sauf exception explicitement validée
- [ ] Le périmètre correspond à l’issue ou au chantier annoncé
- [ ] Aucun changement hors sujet n’est inclus
- [ ] `git diff --check` est propre
- [ ] Les tests pertinents ont été exécutés
- [ ] Les résultats des tests sont documentés sans invention
- [ ] La documentation a été mise à jour si nécessaire
- [ ] Aucun secret ou fichier `.env` n’est inclus
- [ ] Les risques, limites et éléments non modifiés sont indiqués
- [ ] La pull request est en brouillon si les vérifications ne sont pas terminées
