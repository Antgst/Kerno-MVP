# Notes de sécurité d'authentification

Ce document consigne les décisions de sécurité liées à l'authentification pour le MVP KERNO, ainsi que les améliorations à envisager avant tout déploiement officiel en production.

## Décision actuelle pour le MVP

Pour le MVP actuel, la longueur minimale du mot de passe est fixée à 8 caractères.

Il s'agit d'une décision volontaire pour le MVP, et non d'un standard de sécurité définitif pour la production.

L'objectif actuel du périmètre d'authentification du MVP est de mettre en place un premier parcours d'authentification fonctionnel avec :

* l'inscription des utilisateurs ;
* la connexion des utilisateurs ;
* le hachage des mots de passe avant stockage ;
* des réponses utilisateur sécurisées ;
* une réponse d'authentification basée sur JWT ;
* une validation de base ;
* une gestion de base des erreurs d'authentification.

Le MVP n'a pas pour objectif de mettre en œuvre dès maintenant une politique d'authentification complète de niveau production.

## Référence OWASP

Le parcours d'authentification devra à terme être revu au regard des recommandations OWASP sur l'authentification.

OWASP souligne que la robustesse d'un mot de passe ne doit pas reposer uniquement sur des règles de complexité, comme l'obligation d'utiliser des majuscules, des chiffres ou des caractères spéciaux.

Points importants liés à OWASP à envisager plus tard :

* imposer une longueur minimale de mot de passe ;
* autoriser les mots de passe longs et les phrases de passe ;
* éviter de tronquer silencieusement les mots de passe ;
* éviter les règles de composition de mot de passe inutiles ;
* bloquer les mots de passe courants ou déjà compromis ;
* envisager un indicateur de robustesse du mot de passe ;
* ajouter des protections contre les attaques automatisées ;
* envisager l'authentification multifacteur pour renforcer la protection des comptes.

OWASP indique également que les attentes en matière de mot de passe doivent être plus strictes lorsque l'authentification multifacteur n'est pas activée.

## Protections actuelles

L'implémentation actuelle de l'authentification du MVP inclut :

* les mots de passe sont hachés avant d'être stockés ;
* les mots de passe bruts ne sont jamais stockés ;
* les hachages de mots de passe ne sont jamais renvoyés dans les réponses API ;
* les erreurs de connexion utilisent un message générique en cas d'identifiants invalides ;
* les rôles acceptés sont limités à `SUPPLIER` et `STORE` ;
* un jeton JWT est renvoyé après une inscription ou une connexion réussie.

## Renforcement de sécurité futur

Avant une V2, un lancement bêta ou un déploiement officiel en production, le système d'authentification devra être revu et renforcé.

Améliorations recommandées :

* augmenter la longueur minimale du mot de passe à 12 ou 15 caractères ;
* ajouter des contrôles contre les mots de passe faibles ou compromis ;
* ajouter une limitation du débit des connexions ;
* ajouter un ralentissement temporaire après plusieurs tentatives de connexion échouées ;
* envisager des règles de verrouillage de compte en cas d'activité suspecte ;
* améliorer la stratégie d'expiration des JWT ;
* envisager des jetons de rafraîchissement si le produit a besoin de sessions longues ;
* envisager des cookies sécurisés HTTP-only au lieu du stockage des jetons côté client ;
* ajouter une vérification d'adresse e-mail si nécessaire ;
* ajouter un parcours de réinitialisation du mot de passe ;
* ajouter une réauthentification pour les actions sensibles ;
* ajouter des journaux et une supervision de l'authentification ;
* envisager l'authentification multifacteur pour les comptes sensibles ou les futurs comptes administrateurs.

## Note sur l'authentification multifacteur

L'authentification multifacteur n'est pas incluse dans le MVP actuel.

Elle devra être reconsidérée avant un véritable lancement en production, en particulier si le produit inclut plus tard :

* des comptes administrateurs ;
* des données financières fournisseurs ;
* des informations sensibles sur les magasins ;
* des abonnements payants ;
* des paramètres de compte ayant un impact métier ;
* l'accès à des factures, paiements ou documents commerciaux.

## Hors périmètre du MVP actuel

Les fonctionnalités suivantes sont volontairement laissées pour des itérations ultérieures :

* OAuth ;
* la réinitialisation du mot de passe ;
* la vérification d'adresse e-mail ;
* la rotation des jetons de rafraîchissement ;
* l'authentification multifacteur ;
* le contrôle d'accès avancé basé sur les rôles ;
* la limitation du débit des connexions ;
* le verrouillage de compte ;
* les contrôles de mots de passe compromis ;
* une politique de sécurité complète pour la production.

## Synthèse de la décision

La règle actuelle de longueur minimale de 8 caractères pour le mot de passe est acceptable pour la phase d'apprentissage et de validation du MVP.

Elle devra être réexaminée avant tout déploiement public sérieux.
