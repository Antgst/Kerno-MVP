# Audit visuel frontend — 2026-07-03

## Objectif

Contrôler la cohérence visuelle de KERNO après la manual review et avant les prochaines passes DemoDay.

Cet audit couvre les pages publiques, les pages authentifiées, les dashboards, les profils, le catalogue, les demandes, les détails produit/fournisseur et les formulaires principaux.

## Périmètre

Cette passe reste volontairement conservatrice :

- pas de modification backend ;
- pas de modification API ;
- pas de modification routes ;
- pas de modification Prisma ;
- pas de refonte UI ;
- pas de correction CSS sans anomalie visuelle claire.

## Pages contrôlées

- Landing page
- Login
- Register
- Supplier dashboard
- Store dashboard
- Supplier requests
- Store requests
- Supplier request detail
- Store request detail
- Supplier products
- Product detail
- Supplier detail
- Supplier product form
- Request form
- Supplier profile
- Store profile
- Catalog

## Points vérifiés

- cohérence typographique ;
- tailles et poids des titres ;
- hiérarchie titre / sous-titre / contenu ;
- couleurs principales ;
- usage du vert KERNO et du orange CTA ;
- barres orange sous les titres ;
- alignements ;
- espacements ;
- cards ;
- boutons ;
- headers public et privé ;
- sidebar ;
- fonds de page ;
- états de liste et sections principales.

## Constats

- La cohérence globale est bonne.
- Les pages publiques landing, login et register restent alignées.
- Les dashboards store et supplier sont lisibles et cohérents avec la direction premium.
- Les profils store et supplier restent alignés avec le système visuel.
- Le catalogue, les pages détail et les pages demandes sont cohérents avec la DA actuelle.
- Les barres orange sous les titres sont présentes sur les pages importantes.
- La typographie globale est déjà centralisée par le système typographique existant.
- Aucun usage de !important n’a été détecté dans les styles audités.

## Décision

Aucune correction CSS n’est réalisée dans cette branche.

Le rendu actuel est suffisamment stable et cohérent. Modifier le CSS sans anomalie claire créerait plus de risque de régression que de gain visuel.

## Points reportés

Les éventuels ajustements de données de démonstration, wording de seed ou images produits seront traités plus tard dans une branche dédiée DemoDay.

## Validations à exécuter avant commit

- npm --prefix frontend run lint
- npm --prefix frontend run build
- npm --prefix backend test
- git diff --check

## Conclusion

L'audit visuel valide l'état actuel du frontend KERNO. La branche sert de trace documentaire et ne modifie pas le rendu.
