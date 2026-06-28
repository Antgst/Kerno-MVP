# Architecture CSS frontend

Ce document décrit l'organisation actuelle des styles frontend de KERNO. Le but est de rendre la cascade CSS lisible, maintenable, partageable avec l'équipe et explicable en revue, sans modifier le rendu validé.

Cette documentation sert de référence commune pour comprendre où ajouter du CSS, comment éviter les overrides fragiles et pourquoi l'ordre des imports doit rester stable.

Elle s'adresse à toute l'équipe frontend afin de faciliter les futures modifications CSS et de réduire les risques de régression visuelle.

## Principe général

Les imports CSS suivent un ordre volontaire :

1. base globale ;
2. pages publiques ;
3. layouts ;
4. composants UI partagés ;
5. authentification ;
6. profils ;
7. dashboards ;
8. pages métier ;
9. responsive ;
10. polish final.

Cet ordre fait partie de l'architecture. Un fichier importé plus bas peut compléter ou affiner des règles définies plus haut. Modifier cet ordre peut créer des régressions visuelles sur les headers, footers, cards, dashboards ou fonds de page.

## Rôle des fichiers

### 01-base.css

Variables CSS, couleurs, typographie, reset léger et styles partagés.

### 02-landing.css

Styles principaux de la landing page : hero, sections marketing, cards publiques et blocs de conversion.

### 03-layout.css

Layouts publics et privés, header, footer, sidebar, containers et structure des pages authentifiées. Ce fichier est sensible car il impacte beaucoup d'écrans.

### 05-ui-components.css

Composants UI réutilisables : boutons, cards, inputs, badges, états vides et éléments partagés.

### 06-marketing-auth.css

Pages login/register et layout marketing/auth. Ce fichier doit rester cohérent avec la landing page.

### 07-profiles.css

Profils magasin et fournisseur : cards, sections d'informations, progression de complétion, formulaires et responsive.

### 08-responsive-fixes.css

Corrections responsive ciblées. Ce fichier ne doit pas devenir un fourre-tout.

### 09-store-dashboard.css

Styles liés aux dashboards : cards, jauges, panels, activité, recommandations et sections store/supplier. Ce fichier est volumineux, mais son rendu est validé.

### 10-landing-responsive.css

Ajustements responsive spécifiques à la landing page.

### 11-global-polish.css

Ajustements visuels globaux appliqués après les styles principaux.

### 12-product-detail.css

Styles des pages de détail produit.

### 13-supplier-products.css

Styles liés à la gestion des produits fournisseur.

### 14-catalog.css

Styles du catalogue connecté.

### 15-supplier-requests.css

Styles liés aux demandes fournisseur et aux détails de demande.

### 16-final-ux-polish.css

Ajustements finaux d'UX/UI. Ce fichier doit rester un fichier de finition.

### 17-targeted-pages.css

Corrections ciblées sur certaines pages. Ce fichier est utile, mais doit rester surveillé.

### 18-landing-buttons.css

Ajustements spécifiques aux boutons de la landing page.

### 19-landing-final-system.css

Ajustements avancés de la landing et des pages publiques. Ce fichier est volumineux et reflète plusieurs passes de polish.

### 20-global-background.css

Système de fond global et harmonisations visuelles. Ce fichier est sensible car il impacte le rendu général des pages.

### 21-circular-progressbar.css

Styles liés aux jauges circulaires de complétion.

## Règles de maintenance

À faire :

- ajouter les styles dans le fichier le plus proche du domaine concerné ;
- réutiliser les variables CSS existantes ;
- garder une nomenclature de classes lisible ;
- vérifier les pages publiques et connectées après modification d'un fichier global ;
- préférer une règle locale claire à un override global fragile.

À éviter :

- ajouter du CSS dans un fichier final, global ou targeted sans raison claire ;
- modifier l'ordre des imports sans validation visuelle ;
- ajouter des !important ;
- créer des sélecteurs trop larges ;
- corriger un problème local avec une règle globale ;
- dupliquer une règle déjà existante plus haut dans la cascade.

## Gestion des !important

Les !important doivent être évités. Ils masquent souvent un problème de cascade, de sélecteur ou d'ordre d'import. L'état actuel du CSS frontend ne dépend pas de !important pour fonctionner.

## Dette technique connue

Le CSS est fonctionnel et validé visuellement, mais certains fichiers restent volumineux :

- 19-landing-final-system.css
- 09-store-dashboard.css
- 02-landing.css
- 17-targeted-pages.css
- 20-global-background.css

Ces fichiers concentrent une partie de l'historique visuel du projet. Ils ne doivent pas être réorganisés sans branche dédiée et validation visuelle complète.

## Plan d'amélioration futur

Une future passe pourrait découper les styles par domaine : base, public, auth, layout, dashboard, catalog, products, requests, profiles et shared.

Cette évolution doit être faite progressivement, avec une validation visuelle complète, car elle touche directement la cascade.

## Validation recommandée

Après une modification CSS significative :

- git diff --check
- npm --prefix frontend run lint
- npm --prefix frontend run build

Puis vérifier au minimum : landing, login, register, store dashboard, supplier dashboard, catalogue, profils et pages de demandes.

## Décision actuelle

L'architecture CSS actuelle est conservée car le rendu est stable et validé. La priorité immédiate est la lisibilité et la maîtrise de la cascade, pas une restructuration lourde avant review.
