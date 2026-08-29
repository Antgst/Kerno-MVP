# Audit accessibilité ciblé — KERNO / RNCP5

Date : 2026-08-29
Branche auditée : `develop-V2`
Périmètre : frontend KERNO, avec priorité aux critères démontrables pour le RNCP DWWM.

## Constats positifs

- Le focus clavier global est visible via `:focus-visible` dans `frontend/src/index.css`.
- Les formulaires de connexion et d'inscription utilisent des labels, des champs obligatoires et des messages d'erreur associés.
- Le choix du rôle dans l'inscription expose `role="radiogroup"`, `role="radio"`, `aria-checked` et `aria-describedby` en cas d'erreur.
- Les images principales observées possèdent des textes alternatifs.
- Le carrousel du hero expose des boutons natifs avec `aria-label` et `aria-current`.
- La mise en page possède plusieurs règles responsive et une largeur minimale de 320 px.

## Écarts identifiés et corrigés dans le lot RNCP5

### Réduction des mouvements

Avant correction, le hero changeait automatiquement d'image toutes les 4,2 secondes sans tenir compte de `prefers-reduced-motion`.

Correction :
- arrêt de la rotation automatique si `prefers-reduced-motion: reduce` est actif ;
- réduction globale des animations et transitions via media query CSS.

### Contraste du CTA orange

Le CTA avec texte blanc sur `#f97316` présente un contraste d'environ 2,8:1, insuffisant pour du texte normal selon WCAG AA.

Correction : utilisation d'un orange plus sombre `#c2410c`, contraste d'environ 5,18:1 avec le blanc. L'orange de marque reste disponible pour les accents décoratifs qui ne portent pas de texte critique.

### Langue du document

Avant correction, `frontend/index.html` déclarait `lang="en"` alors que l'interface est en français.

Correction : `lang="fr"`.

## Contrôles restant à effectuer manuellement

Ces points ne peuvent pas être déclarés conformes uniquement par lecture statique du code :

1. navigation clavier complète sur les parcours Landing → inscription → connexion → dashboards ;
2. ordre de focus et absence de piège clavier ;
3. contraste réel des textes secondaires, états hover/focus et composants non inspectés ;
4. zoom navigateur à 200 % et reflow ;
5. vérification des écrans à 320 px et mobile réel ;
6. audit navigateur avec Lighthouse/axe ou outil équivalent ;
7. vérification du comportement avec lecteur d'écran sur les interactions complexes.

## Statut RNCP

`PARTIEL — FORT`

La base technique est réelle et plusieurs écarts simples sont corrigés. Pour transformer cette preuve en `OK`, conserver une trace reproductible des contrôles clavier, contraste, zoom/reflow et responsive, avec captures/résultats datés.
