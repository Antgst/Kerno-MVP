# Docker Local Development

This document explains the Docker setup used for Kerno local development.

## Scope

Docker is used first to provide a shared PostgreSQL service for local development.

The backend and frontend can still run locally with npm commands.

## Start services

```bash
docker compose up -d
```

## Check services

```bash
docker compose ps
```

## Read logs

```bash
docker compose logs
```

## Stop services

```bash
docker compose down
```

## Reset local database volume

```bash
docker compose down -v
```

Warning: this command deletes local PostgreSQL data stored in Docker volumes.

## PostgreSQL local values

```env
POSTGRES_USER=kerno_user
POSTGRES_PASSWORD=kerno_password
POSTGRES_DB=kerno_db
```

When the backend runs outside Docker, use:

```env
DATABASE_URL="postgresql://kerno_user:kerno_password@localhost:5432/kerno_db"
```

If the backend is dockerized later, the host may change to the Docker service name:

```env
DATABASE_URL="postgresql://kerno_user:kerno_password@postgres:5432/kerno_db"
```
