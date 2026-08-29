# Jeu d'essai représentatif RNCP5 — flux de demande KERNO

Date : 2026-08-29

## Pourquoi ce scénario

Le flux choisi représente la valeur métier centrale du MVP KERNO :

**un magasin identifie un produit fournisseur, envoie une demande B2B, la demande est persistée et devient consultable par les acteurs autorisés.**

Il traverse plusieurs couches et constitue donc une preuve utile pour CP4, CP5, CP6 et CP7.

## Chaîne technique

```text
Interface magasin
  → requestService.js
  → POST /api/requests
  → authentification / rôle STORE
  → requests.service.js
  → validations métier
  → Prisma ORM
  → PostgreSQL contact_requests
  → réponse JSON sécurisée
  → consultation des demandes envoyées/reçues
```

## Préconditions

Le jeu d'essai automatisé utilise la suite existante :

```text
backend/tests/test_kerno_api_comprehensive.py
```

La fixture `seeded` prépare :

- un utilisateur fournisseur ;
- un profil fournisseur ;
- un utilisateur magasin ;
- un profil magasin ;
- une catégorie ;
- un produit actif appartenant au fournisseur ;
- les sessions authentifiées nécessaires.

## Entrée représentative

Requête HTTP :

```http
POST /api/requests
```

Payload conceptuel :

```json
{
  "supplierId": "<supplier-id-existant>",
  "productId": "<product-id-actif-du-fournisseur>",
  "subject": "Quote request <run-id>",
  "message": "Can you send me your B2B pricing?",
  "requestedQuantity": "20 units"
}
```

La requête est envoyée avec la session authentifiée du magasin.

## Résultat attendu

- HTTP `201` ;
- réponse `success: true` ;
- création d'une `ContactRequest` ;
- `storeId` issu du profil du magasin connecté ;
- `supplierId` égal au fournisseur ciblé ;
- `productId` égal au produit actif sélectionné ;
- sujet et message normalisés ;
- statut initial `PENDING` ;
- demande récupérable dans les listes envoyées/reçues selon les permissions.

## Règles métier réellement exercées

Le service `backend/src/modules/requests/requests.service.js` vérifie notamment :

1. qu'un profil magasin existe pour l'utilisateur connecté ;
2. que `supplierId`, `subject` et `message` sont fournis ;
3. que le fournisseur existe ;
4. si un produit est indiqué, qu'il appartient au fournisseur et qu'il est actif ;
5. que la demande est persistée avec le statut `PENDING` ;
6. que seules des données de réponse explicitement sélectionnées sont renvoyées ;
7. que les consultations et changements de statut respectent la propriété de la demande.

## Exécution CI

Le workflow `Vérifications develop-V2` :

1. démarre PostgreSQL 16 ;
2. applique les migrations Prisma ;
3. démarre l'API KERNO sur le port 5001 ;
4. exécute le sous-ensemble `pytest` contenant les tests de demandes ;
5. produit un résultat JSON ;
6. archive ce résultat comme artifact `rncp-representative-test-results` pendant 30 jours.

Commande CI :

```bash
python -m pytest backend/tests/test_kerno_api_comprehensive.py -k "request" -q
```

## Format RNCP entrée / attendu / obtenu / écart

| Élément | Valeur |
| --- | --- |
| Entrée | magasin authentifié + fournisseur + produit actif + sujet + message + quantité |
| Attendu | création HTTP 201, demande persistée, statut PENDING, ownership correcte |
| Obtenu | renseigné automatiquement par la CI et le JSON d'artifact |
| Écart | 0 attendu si la CI est verte ; tout échec rend le workflow rouge |

## Limite

Ce jeu d'essai est un test API/intégration sur une base PostgreSQL réelle de CI. Il ne remplace pas un test navigateur complet de l'interface, mais il couvre le cœur du parcours métier et les couches serveur/données de manière reproductible.
