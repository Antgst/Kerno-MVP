# Installation PostgreSQL et première migration Prisma

Ce guide explique les étapes à suivre pour configurer PostgreSQL en local, préparer l’environnement backend, puis lancer la première migration Prisma du projet.

> Ce guide est prévu pour les nouveaux arrivants qui viennent de cloner le projet et qui travaillent sous **WSL Ubuntu/Debian**, sans Docker.

---

## 1. Se placer dans le projet

Depuis le terminal WSL, aller dans le dossier du projet :

```bash
cd Kerno-MVP
```

Puis aller dans le backend :

```bash
cd backend
```

---

## 2. Installer PostgreSQL dans WSL

Mettre à jour les paquets :

```bash
sudo apt update
```

Installer PostgreSQL et ses outils complémentaires :

```bash
sudo apt install postgresql postgresql-contrib
```

---

## 3. Démarrer PostgreSQL

Démarrer le service PostgreSQL :

```bash
sudo service postgresql start
```

Vérifier que PostgreSQL est bien lancé :

```bash
sudo service postgresql status
```

Si le service est actif, vous pouvez continuer.

---

## 4. Créer l’utilisateur et la base de données

Se connecter à PostgreSQL avec l’utilisateur administrateur local :

```bash
sudo -u postgres psql
```

Dans le terminal PostgreSQL, exécuter les commandes suivantes :

```sql
CREATE USER kerno_user WITH PASSWORD 'kerno_password';
CREATE DATABASE kerno_db OWNER kerno_user;
GRANT ALL PRIVILEGES ON DATABASE kerno_db TO kerno_user;
ALTER USER kerno_user CREATEDB;
\q
```

### Pourquoi `CREATEDB` ?

Prisma Migrate utilise une **shadow database** pendant la commande `prisma migrate dev`.

Sans le droit `CREATEDB`, vous risquez d’avoir cette erreur :

```text
Error: P3014
Prisma Migrate could not create the shadow database.
ERROR: permission denied to create database
```

La commande suivante règle ce problème :

```sql
ALTER USER kerno_user CREATEDB;
```

---

## 5. Créer le fichier `.env`

Dans le dossier `backend`, copier le fichier d’exemple :

```bash
cp .env.example .env
```

Ouvrir le fichier `.env` et vérifier qu’il contient bien :

```env
PORT=5000
DATABASE_URL="postgresql://kerno_user:kerno_password@localhost:5432/kerno_db?schema=public"
JWT_SECRET="replace_with_local_secret"
NODE_ENV="development"
```

> Important : le fichier utilisé par le backend doit s’appeler `.env`, pas `.env.example`.

---

## 6. Installer les dépendances Node.js

Toujours dans le dossier `backend` :

```bash
npm install
```

---

## 7. Vérifier la configuration Prisma

Vérifier que Prisma lit correctement le schéma :

```bash
npx prisma validate
```

Si la commande ne retourne pas d’erreur, continuer.

---

## 8. Générer le client Prisma

```bash
npx prisma generate
```

---

## 9. Lancer la première migration Prisma

Créer et appliquer la première migration :

```bash
npx prisma migrate dev --name init
```

Cette commande va :

- lire le fichier `prisma/schema.prisma`
- créer une migration dans `prisma/migrations`
- appliquer cette migration à la base `kerno_db`
- générer le client Prisma

---

## 10. Vérifier avec Prisma Studio

Lancer Prisma Studio :

```bash
npx prisma studio
```

Par défaut, Prisma Studio est disponible sur :

```text
http://localhost:5555
```

Si vous êtes sous WSL et que la page ne s’ouvre pas correctement, essayez aussi :

```text
http://127.0.0.1:5555
```

---

## 11. Problèmes fréquents

### PostgreSQL n’est pas lancé

Erreur possible :

```text
Can't reach database server at localhost:5432
```

Solution :

```bash
sudo service postgresql start
```

---

### L’utilisateur n’a pas le droit de créer la shadow database

Erreur possible :

```text
Error: P3014
permission denied to create database
```

Solution :

```bash
sudo -u postgres psql
```

Puis :

```sql
ALTER USER kerno_user CREATEDB;
\q
```

Relancer ensuite :

```bash
npx prisma migrate dev --name init
```

---

### Le fichier `.env` n’existe pas

Erreur possible :

```text
Environment variable not found: DATABASE_URL
```

Solution :

```bash
cp .env.example .env
```

Puis vérifier le contenu de `.env`.

---

### Prisma Studio affiche une erreur `ERR_STREAM_UNABLE_TO_PIPE`

Fermer Prisma Studio avec :

```bash
Ctrl + C
```

Puis relancer :

```bash
npx prisma studio --port 5555
```

Si besoin, nettoyer le cache Prisma :

```bash
rm -rf ~/.cache/prisma
rm -rf node_modules/.prisma
npx prisma generate
npx prisma studio --port 5555
```

---

## 12. Commandes utiles à retenir

Démarrer PostgreSQL :

```bash
sudo service postgresql start
```

Se connecter à PostgreSQL en admin :

```bash
sudo -u postgres psql
```

Valider le schéma Prisma :

```bash
npx prisma validate
```

Appliquer les migrations :

```bash
npx prisma migrate dev
```

Ouvrir Prisma Studio :

```bash
npx prisma studio
```

---

## Résumé rapide

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo service postgresql start

sudo -u postgres psql
```

Puis dans PostgreSQL :

```sql
CREATE USER kerno_user WITH PASSWORD 'kerno_password';
CREATE DATABASE kerno_db OWNER kerno_user;
GRANT ALL PRIVILEGES ON DATABASE kerno_db TO kerno_user;
ALTER USER kerno_user CREATEDB;
\q
```

Puis dans le backend :

```bash
cd backend
cp .env.example .env
npm install
npx prisma validate
npx prisma generate
npx prisma migrate dev --name init
npx prisma studio
```
