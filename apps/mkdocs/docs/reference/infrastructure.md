# Infrastructure Reference

## Production Architecture

```mermaid
graph TB
    Internet["Internet"]

    subgraph "Docker Compose (Production)"
        Traefik["traefik<br/>Reverse Proxy :80/:443"]
        App["app<br/>Next.js :3000"]
        API["api<br/>FastAPI :8000"]
        CeleryW["celery-worker<br/>Background tasks"]
        DB[("postgres :5433")]
        Redis[("redis :6379")]
    end

    Internet --> Traefik
    Traefik --> App
    Traefik --> API
    API --> DB
    API -->|"dispatch tasks"| Redis
    CeleryW -->|"consume tasks"| Redis
    CeleryW --> DB
```

## Local Development Architecture

```mermaid
graph LR
    subgraph "Docker (infra only)"
        DB[("postgres :5433")]
        Redis[("redis :6379")]
    end

    subgraph "Host machine (pnpm dev)"
        NextJS["Next.js :3000"]
        FastAPI["FastAPI :8000"]
        Celery["Celery Worker"]
    end

    NextJS --> FastAPI
    FastAPI --> DB
    Celery --> Redis
    Celery --> DB
```

### Prerequisites

- Node.js 20
- Python 3.12
- Docker (for PostgreSQL, Redis)

### Setup

```bash
pnpm install                    # Install all JS/TS deps
cd apps/api && poetry install   # Install Python deps
docker compose -f docker-compose.local.yml up -d  # Start infra services
pnpm db:migrate                 # Run all migrations
```

### Running

```bash
pnpm dev                        # Start all apps (Turbo)
```

Or individually:

```bash
# Frontend
cd apps/nextjs && pnpm dev

# Backend
cd apps/api && poetry run start

# Celery worker
cd apps/api && poetry run celery-worker
```

**Local Docker services** (`docker-compose.local.yml`):

| Service | Port | Purpose |
|---------|------|---------|
| redis | 6379 | Celery broker/backend |
| postgres | 5433 | Database (FastAPI) |

## Environment Variables

### Where env vars are configured

| App | Config File | Validation |
|-----|------------|------------|
| Frontend | `apps/nextjs/src/env.js` | `@t3-oss/env-nextjs` + Zod |
| Backend | `apps/api/api/settings.py` | Pydantic `BaseSettings` (`API_` prefix) |

### Required variables by service

| Service | Required Variables |
|---------|--------------------|
| api | `API_DATABASE_URL`, `API_SECRET_KEY` |
| celery-worker | `API_DATABASE_URL`, `API_CELERY_BROKER_URL`, `API_CELERY_RESULT_BACKEND` |

### Optional observability

| Variable | Purpose |
|----------|---------|
| `API_SENTRY_DSN` | Backend error tracking |
| `NEXT_PUBLIC_SENTRY_DSN` | Frontend error tracking |
| `NEXT_PUBLIC_POSTHOG_KEY` | Product analytics |
