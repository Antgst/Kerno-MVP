# Note RGPD / protection des données — KERNO / RNCP5

Date : 2026-08-29
Périmètre : MVP KERNO tel qu'il est modélisé dans `backend/prisma/schema.prisma`.

## Données personnelles réellement présentes dans le modèle

### Compte utilisateur
- adresse e-mail ;
- hash du mot de passe ;
- rôle `SUPPLIER` ou `STORE` ;
- prénom et nom optionnels ;
- dates de création et mise à jour.

### Profil fournisseur
- nom d'entreprise ;
- description ;
- localisation ;
- type d'activité ;
- e-mail professionnel ;
- téléphone ;
- site web.

### Profil magasin
- nom du magasin et enseigne ;
- localisation ;
- type de magasin ;
- besoins de sourcing ;
- e-mail professionnel ;
- téléphone.

### Demandes de contact
- magasin émetteur ;
- fournisseur destinataire ;
- produit éventuel ;
- objet ;
- message ;
- quantité demandée ;
- statut ;
- horodatages.

## Mesures techniques déjà démontrables

- mots de passe stockés sous forme de hash et non en clair ;
- e-mail utilisateur unique ;
- rôles distincts magasin/fournisseur ;
- contrôles d'accès et propriété des ressources côté backend ;
- relations Prisma avec suppressions en cascade pour les profils et données associées ;
- secrets et configuration séparés du code source ;
- audit sécurité et tests API existants dans le projet.

## Principes de minimisation déjà cohérents avec le MVP

KERNO ne collecte pas de données de paiement, données bancaires, livraison, facturation, notation publique ou analytics avancés dans le MVP. Le périmètre de données reste limité au compte professionnel, aux profils, aux produits et à la mise en relation B2B.

## Points à formaliser avant de parler de conformité complète

Cette note ne déclare pas KERNO « conforme RGPD ». Les décisions suivantes doivent être définies explicitement avant une mise en production réelle :

1. finalité précise de chaque catégorie de données ;
2. base juridique retenue pour chaque traitement ;
3. durée de conservation des comptes, profils et demandes ;
4. procédure d'accès, rectification, opposition et suppression ;
5. gestion d'une demande de suppression de compte ;
6. politique de confidentialité accessible depuis l'interface ;
7. mentions légales et responsable de traitement ;
8. éventuels sous-traitants/hébergeurs et localisation des données ;
9. politique de journalisation et durée de conservation des logs ;
10. gestion des sauvegardes après suppression d'un compte.

## État actuel de l'interface

Le footer expose déjà des entrées « Mentions légales », « Confidentialité » et « Conditions d'utilisation », mais elles utilisent actuellement des liens `#`. Elles constituent donc des placeholders UX et non une preuve de politique publiée.

## Preuve RNCP à conserver

Pour le dossier RNCP, l'objectif est de démontrer :
- identification des données traitées ;
- minimisation du périmètre ;
- protections techniques ;
- compréhension des droits utilisateurs ;
- limites actuelles clairement reconnues ;
- plan d'action réaliste avant production.

## Statut RNCP

`PARTIEL — DOCUMENTÉ`

Le gap n'est plus l'absence totale de réflexion RGPD. Le prochain niveau consiste à définir les règles de conservation/suppression et à remplacer ou retirer les liens légaux placeholders avant une éventuelle production publique.
