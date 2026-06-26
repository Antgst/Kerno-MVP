# Expliquer et configurer les règles

Utiliser ce fichier quand l’utilisateur veut comprendre ou configurer des règles React Doctor.

Ne pas l’utiliser pour corriger des diagnostics. Pour corriger le code, utiliser le workflow principal React Doctor.

Déclencheurs : “pourquoi cette règle se déclenche”, “je ne suis pas d’accord avec cette règle”, “désactive cette règle”, “arrête de signaler X”, “trop de bruit”, “désactive les règles design”.

## Workflow

1. Identifier la clé de règle depuis le diagnostic, par exemple `react-doctor/no-array-index-as-key`.
2. Expliquer la règle avant toute modification :

```bash
npx react-doctor@latest rules explain react-doctor/no-array-index-as-key
```

3. Si la règle détecte un vrai problème de correction, accessibilité, sécurité ou performance, recommander de corriger le code.
4. Si une configuration reste souhaitée, choisir le contrôle le plus étroit.
5. Appliquer avec une commande `rules`.
6. Valider :

```bash
npx react-doctor@latest rules list --configured
npx react-doctor@latest --verbose --diff
```

## Commandes

```bash
npx react-doctor@latest rules list
npx react-doctor@latest rules list --configured
npx react-doctor@latest rules list --category Performance
npx react-doctor@latest rules explain <rule>
npx react-doctor@latest rules disable <rule>
npx react-doctor@latest rules enable <rule>
npx react-doctor@latest rules set <rule> warn
npx react-doctor@latest rules category "React Native" off
npx react-doctor@latest rules ignore-tag design
npx react-doctor@latest rules unignore-tag design
```

Les références de règles acceptent la clé complète, l’identifiant court ou une ancienne clé :

```text
react-doctor/no-danger
no-danger
react/no-danger
```

## Guide de décision

Choisir le contrôle le plus étroit correspondant à l’intention utilisateur.

- Comprendre une règle → `rules explain <rule>`.
- Corriger le problème sous-jacent → utiliser le workflow principal React Doctor.
- Règle valide mais trop stricte pour l’instant → `rules set <rule> warn`.
- Règle non souhaitée partout → `rules disable <rule>`.
- Règle désactivée par défaut à activer → `rules enable <rule>`.
- Domaine technique entier non souhaité → `rules category "<Category>" off`.
- Famille comportementale trop bruyante → `rules ignore-tag <tag>`.
- Règle à garder localement mais à exclure des commentaires PR, du score ou de l’échec CI → configurer `surfaces`; ne pas désactiver la règle.

Utiliser `rules disable <rule>` seulement si l’utilisateur veut clairement que la règle ne tourne plus nulle part, après explication de la règle.

## Priorité de configuration

React Doctor combine les couches de configuration dans cet ordre :

1. `ignore.tags` désactive avant analyse toutes les règles portant ce tag.
2. `rules` surcharge la sévérité d’une règle précise.
3. `categories` définit la sévérité d’une catégorie entière.
4. Les valeurs par défaut s’appliquent si rien n’est configuré.
5. `surfaces` change uniquement où les résultats apparaissent ; cela ne change jamais si une règle tourne ou non.

Une règle désactivée par `ignore.tags` ne peut pas être réactivée par `rules` ou `categories`. Il faut d’abord retirer le tag ignoré.

## Forme de la configuration

La configuration se trouve dans `doctor.config.ts`, `.js`, `.mjs`, `.cjs`, `.json`, `.jsonc`, ou dans `package.json#reactDoctor`.

Les commandes `rules` modifient la configuration existante en place. Si aucune configuration n’existe, elles créent `doctor.config.json` avec `$schema`.

Exemple :

```ts
export default {
  rules: { "react-doctor/no-array-index-as-key": "off" },
  categories: { "React Native": "warn" },
  ignore: { tags: ["design"] },
};
```

## Surfaces

Utiliser `surfaces` quand l’utilisateur veut garder les diagnostics localement, mais les masquer des commentaires PR, du score ou de l’échec CI.

Ne pas désactiver la règle dans ce cas.

Exemples d’intention :

- “Garde-le en local mais pas dans les commentaires PR.”
- “Ne fais pas échouer la CI sur cette catégorie.”
- “Ne compte pas les règles design dans le score.”

## Expliquer à l’utilisateur

Commencer par la sortie “Why it matters” de :

```bash
npx react-doctor@latest rules explain <rule>
```

Pour aller plus loin, utiliser :

```text
https://www.react.doctor/prompts/rules/<plugin>/<rule>.md
```

Ne proposer la désactivation qu’après compréhension de la règle et confirmation que la configuration est préférable à la correction du code.
