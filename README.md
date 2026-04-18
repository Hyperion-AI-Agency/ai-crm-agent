# AI SaaS Template

A full-stack AI SaaS monorepo template with Next.js, FastAPI, LangGraph agents, Payload CMS, authentication, and payments. Built on the [monorepo-base-template](https://github.com/Hyperion-AI-Agency/monorepo-base-template).

## Key Features

- **CopilotKit AG-UI** chat interface
- **LangGraph** agent with tool system
- **Better Auth** (email/password + Google OAuth)
- **Polar SDK** payments + subscription gating
- **Payload CMS** (pages, posts, blocks)
- **Celery** background workers
- **Langfuse** LLM observability
- **i18n** (next-intl)
- **Two PostgreSQL databases** (app + API)

## Getting Started

1. **Use this template** — Click "Use this template" on GitHub
2. **Clone your new repo** — `git clone <your-repo-url>`
3. **Install dependencies** — `pnpm install && cd apps/api && poetry install`
4. **Set up environment** — Copy `.env.example` to `.env` in `apps/nextjs/` and `apps/api/`
5. **Start infrastructure** — `docker compose -f docker-compose.local.yml up -d`
6. **Run migrations** — `pnpm db:migrate`
7. **Start developing** — `pnpm dev`

## Architecture

```
apps/
├── nextjs/       # Next.js 15 + Payload CMS + Better Auth + Polar
├── api/          # FastAPI + LangGraph + Celery
├── storybook/    # Component documentation
├── email/        # Email template dev server
├── mkdocs/       # Developer documentation
└── keycloak-theme/

packages/
├── ui/           # shadcn/ui components
├── analytics/    # PostHog
├── sentry/       # Error tracking
├── api-client/   # Generated API client
└── email/        # Email templates

tooling/
├── typescript-config/
├── prettier-config/
└── eslint-config/
```

## Syncing with Base Template

To pull updates from the base template:

1. Add the base as a remote: `git remote add base https://github.com/Hyperion-AI-Agency/monorepo-base-template.git`
2. Fetch: `git fetch base main`
3. Merge: `git merge base/main --allow-unrelated-histories`
4. Resolve conflicts and commit
