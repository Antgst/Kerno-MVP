---
name: react-doctor
description: Utiliser après des modifications React, avant un commit, ou quand l’utilisateur demande de scanner, trier, nettoyer, expliquer ou configurer des diagnostics React Doctor. Couvre les vérifications de régression, le triage local complet et la configuration sûre des règles.
version: "1.2.0"
---

# React Doctor

React Doctor analyse les bases de code React pour détecter des problèmes de correction, sécurité, performance, accessibilité, bundle et architecture. Il produit un score de santé de 0 à 100.

## Choisir le plus petit workflow utile

- Code React modifié → lancer une vérification de régression sur les changements.
- Nettoyage général ou `/doctor` → lancer le triage local complet.
- Question sur une règle ou demande de configuration → utiliser `references/explain.md`.
- Bruit uniquement dans PR / CI / score → préférer la configuration `surfaces` plutôt que désactiver une règle.

## Après des modifications React

Lancer :

```bash
npx react-doctor@latest --verbose --scope changed
```

Vérifier que le score ne régresse pas. S’il baisse, corriger les régressions avant commit.

C’est une vérification de régression, pas un nettoyage complet. Ne pas lancer le workflow complet `/doctor` sauf si l’utilisateur demande explicitement un triage ou nettoyage complet.

## Nettoyage général

Lancer :

```bash
npx react-doctor@latest --verbose
```

Corriger par priorité : erreurs d’abord, puis warnings. Garder les corrections ciblées sur les diagnostics signalés.

## Triage complet `/doctor`

Utiliser ce workflow quand l’utilisateur écrit `/doctor`, dit “run React Doctor”, ou demande un triage / nettoyage complet.

Récupérer et suivre le playbook canonique :

```bash
curl --fail --silent --show-error \
  --header 'Cache-Control: no-cache' \
  https://www.react.doctor/prompts/react-doctor-agent.md
```

Le playbook est la source de vérité. Il peut modifier le working tree, mais il ne doit jamais commit, push ou ouvrir une PR.

Récupérer les recettes par règle si nécessaire depuis :

```text
https://www.react.doctor/prompts/rules/<plugin>/<rule>.md
```

## Expliquer ou configurer des règles

Si l’utilisateur veut comprendre, désactiver, ajuster ou réduire le bruit d’une règle, ne pas corriger les diagnostics ici. Suivre :

```text
references/explain.md
```

Commencer par :

```bash
npx react-doctor@latest rules explain <rule>
```

Puis appliquer la configuration la plus étroite et la plus sûre.

## Commande principale

Commande courte recommandée :

```bash
npm run doctor:changed
```

Équivalent direct :

```bash
npx react-doctor@latest --verbose --scope changed
```

| Flag | Rôle |
| --- | --- |
| `.` | Scanner le dossier courant |
| `--verbose` | Afficher les fichiers et lignes concernés |
| `--scope changed` | Signaler les problèmes introduits par rapport à la branche de base |
| `--scope lines` | Signaler uniquement les problèmes sur les lignes modifiées |
| `--score` | Afficher uniquement le score numérique |

## À ne pas faire

- Ne pas désactiver une règle uniquement pour masquer un diagnostic.
- Ne pas utiliser `/doctor` complet pour une petite vérification de régression.
- Ne pas modifier la configuration des règles si l’utilisateur demande de corriger le code.
- Ne pas commit, push ou ouvrir de PR automatiquement.
