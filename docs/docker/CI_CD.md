# CI/CD deployment on `develop`

Each push to `develop` runs [`.github/workflows/deploy-develop.yml`](../../.github/workflows/deploy-develop.yml). The workflow builds one Docker image containing the compiled frontend and the Express API, publishes it to GitHub Container Registry (GHCR), then uses the `kerno-prod` self-hosted GitHub Actions runner to pull and restart it directly on the server.

The image is published under `ghcr.io/<owner>/kerno-mvp:develop` and also receives an immutable `sha-<commit>` tag. The deployment always uses the `develop` tag.

## One-time server setup

Install Docker Engine with the Docker Compose plugin, then create a deployment directory owned by the runner user. The workflow copies [`deployment/compose.production.yaml`](../../deployment/compose.production.yaml) there on every deployment. Copy [`deployment/.env.example`](../../deployment/.env.example) to `data/.env` and restrict it to the runner user.

```bash
mkdir -p /opt/kerno
mkdir -p /opt/kerno/data/{postgres,uploads,backups}
cd /opt/kerno
# Create data/.env from .env.example, then set its values.
```

Set strong PostgreSQL and JWT secrets in `/opt/kerno/data/.env`. Do not commit this file. The compose stack keeps PostgreSQL data under `/opt/kerno/data/postgres` and exposes the app only at `127.0.0.1:5000`; put Nginx, Caddy, or Traefik in front of it for HTTPS.

## GitHub runner requirements

The runner must be registered on this repository, run as the user that owns the deployment directory, and have access to the Docker socket. No SSH or GHCR personal-access-token secret is required: the workflow uses the short-lived repository `GITHUB_TOKEN` to publish and pull the image.

## Deployment behaviour

The image startup runs `prisma migrate deploy` before Express starts. As a result, only committed migrations are applied and the container does not generate schema changes in production. The GitHub Actions concurrency group prevents two `develop` deployments from running at the same time.
