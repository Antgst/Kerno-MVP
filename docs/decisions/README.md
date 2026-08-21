# Décisions techniques — KERNO

Ce dossier contient les Architecture Decision Records (ADR) de KERNO.

Un ADR est utile lorsqu’une décision est structurante, durable ou coûteuse à inverser : architecture, modèle de données, sécurité, authentification, infrastructure, stratégie de déploiement, dépendance majeure ou convention transverse.

## Règles

- ne pas créer un ADR pour une simple correction locale ;
- documenter le contexte, les options réellement considérées et les conséquences ;
- ne pas réécrire l’historique d’un ADR accepté : créer un nouvel ADR qui le remplace ;
- l’état du code et de la configuration reste prioritaire si un ADR historique n’a pas été maintenu ;
- référencer l’issue ou la PR associée lorsque c’est utile.

## États recommandés

- `proposé`
- `accepté`
- `remplacé`
- `abandonné`

## Nommage

```text
0001-titre-court.md
0002-autre-decision.md
```

Utiliser [`0000-template.md`](./0000-template.md) comme base.