# Note d'éco-conception — KERNO / RNCP5

Date : 2026-08-29
Périmètre : choix de conception et d'implémentation réellement observables dans le MVP KERNO.

## Choix déjà favorables à une conception sobre

- périmètre MVP volontairement réduit : pas de paiement, commande, livraison, facturation, messagerie avancée ni analytics avancés ;
- architecture backend en monolithe modulaire plutôt qu'en microservices prématurés ;
- PostgreSQL relationnel unique pour les données métier du MVP ;
- absence d'API externe obligatoire dans le cœur du produit ;
- images secondaires du hero chargées en `lazy`, décodées en `async` ;
- composants frontend réutilisables ;
- séparation claire frontend/backend sans multiplication inutile de services ;
- déploiement conteneurisé reproductible.

Ces éléments réduisent surtout la complexité, les dépendances et les traitements inutiles. Ils ne constituent pas à eux seuls une mesure d'empreinte environnementale.

## Limites actuelles

- aucune mesure énergétique ou carbone n'est intégrée au projet ;
- aucun budget de poids de page ou de bundle n'est formalisé ;
- aucune règle documentée sur le poids maximal des images ;
- la police Inter est actuellement chargée depuis Google Fonts ;
- les métriques réseau, CPU et mémoire ne sont pas archivées comme preuves d'éco-conception.

## Améliorations réalistes

1. mesurer le poids du build frontend et le poids des pages principales ;
2. suivre le volume d'images et privilégier WebP/AVIF quand pertinent ;
3. éviter les dépendances lourdes pour des fonctionnalités simples ;
4. conserver le lazy-loading des médias non prioritaires ;
5. mesurer Lighthouse Performance comme indicateur technique, sans le présenter comme une mesure carbone ;
6. envisager l'auto-hébergement des polices ou les polices système si cela améliore le compromis performance/maintenance ;
7. maintenir le principe d'architecture la plus simple compatible avec le besoin métier.

## Positionnement RNCP

L'éco-conception doit être présentée comme une démarche de conception : réduire le périmètre inutile, limiter les dépendances et les ressources chargées, mesurer avant d'optimiser et éviter les affirmations environnementales non vérifiées.

## Statut RNCP

`PARTIEL — DOCUMENTÉ`

Une preuve plus forte pourra être obtenue avec quelques mesures reproductibles : poids du build, poids des pages/images et audit performance avant/après une optimisation ciblée.
