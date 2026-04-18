# CLAUDE.md — AI SaaS Template Development Workspace

This file is automatically loaded at the start of every Claude Code session. It provides the foundation for understanding and working in the AI SaaS Template codebase.

---

## What This Is

This is the **development workspace** for an **AI SaaS application** — a full-stack monorepo template with AI agent capabilities, CMS, authentication, and payments. All project documentation lives in `apps/mkdocs/` (MkDocs Material site).

## Mandatory Workflow

**Claude must NEVER jump straight to writing code for new tasks or features.** The workflow is always:

1. **`/prime`** — Load context (start of session)
2. **`/create-task [loose idea]`** — *(optional)* Turn rough ideas into a structured task document
3. **`/plan [requirements or task-path]`** — Create a detailed implementation plan and present it for review
4. **Review and approve** the plan (or request changes)
5. **`/implement [plan-path]`** — Only after plan approval, execute the plan

**This is non-negotiable.**

## Task Management (Linear MCP)

Tasks are managed in **Linear** via MCP server (configured in `.claude/.mcp.json`).

**When planning or starting work, Claude must:**
1. **Use the Linear MCP tools** to fetch task details before creating a plan
2. **Reference the Linear task number** in branch names: `PREFIX-123-short-description`
3. **Update task status** in Linear as work progresses

## Test-Driven Development (TDD)

**Tests must be written BEFORE implementation code.**

1. **Write the test first** — define expected behavior
2. **Run it** — confirm it fails (RED)
3. **Implement** — minimal code to pass (GREEN)
4. **Refactor** — clean up while keeping tests green

Backend tests: `apps/api/__tests__/` (pytest)
E2E tests: `apps/nextjs/e2e/` (Playwright)
Run all: `pnpm test` | Backend only: `poetry run pytest` | E2E: `pnpm test:e2e`

---

## Quick Reference

| What | Where |
|------|-------|
| Frontend app | `apps/nextjs/` (Next.js 15) |
| Backend API | `apps/api/` (FastAPI) |
| API modules | `apps/api/api/` (routes, models, schemas, crud) |
| Agent graph | `apps/api/agents/graph.py` |
| Agent tools | `apps/api/agents/tools.py` |
| Agent prompts | `apps/api/agents/prompts/` |
| Celery worker | `apps/api/worker/` |
| UI components | `packages/ui/` (shadcn/ui) |
| Analytics | `packages/analytics/` (PostHog) |
| Sentry | `packages/sentry/` (shared config + env) |
| API client | `packages/api-client/` (Orval-generated) |
| Email templates | `packages/email/` |
| DB schemas (frontend) | `apps/nextjs/src/server/db/schemas/` |
| DB models (backend) | `apps/api/api/*/models/` |
| Payload CMS blocks | `apps/nextjs/src/payload/blocks/` |
| Payload collections | `apps/nextjs/src/payload/collections/` |
| Block renderers | `apps/nextjs/src/components/content/blocks/` |
| Langfuse integration | `apps/api/api/deps/langfuse.py` |
| Translations | `apps/nextjs/src/lib/i18n/` |
| Env config (Next.js) | `apps/nextjs/src/env.ts` (t3-env) |
| Env config (FastAPI) | `apps/api/api/settings.py` (Pydantic) |
| E2E tests | `apps/nextjs/e2e/` (Playwright) |
| Backend unit tests | `apps/api/__tests__/` (pytest) |
| Documentation | `apps/mkdocs/` (MkDocs Material) |
| Storybook | `apps/storybook/` |
| Keycloak theme | `apps/keycloak-theme/` |
| Tooling | `tooling/` (typescript-config, prettier-config, eslint-config) |

## Auth & Subscription Flow

- **Authentication:** Better Auth (email/password + Google OAuth)
- **Subscription gating:** Protected layout checks for active subscriptions
  - No session → redirect to `/sign-in`
  - No active subscription → render `<Paywall />`
  - Active subscription → render dashboard
- **Payments:** Polar SDK (`@polar-sh/sdk` + `@polar-sh/better-auth`)

## Critical Gotchas

- **CORS + Credentials:** `allow_origins=["*"]` with `allow_credentials=True` is invalid per spec -- browsers silently reject cookies. Always use explicit origins when credentials are enabled.
- **Zod + Generated Types:** Use `satisfies z.ZodType<T>` to bind Zod schemas to Orval-generated types without erasing inference.
- **Playwright:** Always run from the app directory (not monorepo root) for correct `baseURL` resolution.
- **TanStack Query 401s:** Disable retries for 401 responses. Handle expired sessions globally via `QueryCache`/`MutationCache` `onError`.

## SOPs & Reference Documentation

Standard Operating Procedures live in `.claude/docs/sops/`. Pattern quick-references live in `.claude/docs/`. Claude reads these when building features or making architectural decisions.

### SOPs (Comprehensive Guides)

| SOP | What It Covers |
|-----|---------------|
| `backend-sop.md` | FastAPI + SQLAlchemy + Celery: settings, app factory, database models, schemas, generic CRUD, dependency injection, routes, auth (signed cookies), Redis, S3 storage, Celery tasks, SSE events, service layer, enums, migrations |
| `frontend-sop.md` | React + TanStack Router + shadcn/ui: project structure, routing, data fetching (TanStack Query), file upload, tables, dialogs/forms, SSE real-time, styling, type safety with Orval. **Note:** This template uses Next.js instead of Vite+TanStack Router - adapt routing patterns accordingly. |
| `infrastructure-sop.md` | Monorepo structure, Docker, CI/CD, Turborepo, pnpm workspaces, GitHub Actions, secrets management, git workflow |
| `claude-agent-sop.md` | Mandatory workflow for Claude, project initialization checklist, adding new features step-by-step, code quality rules |
| `design-patterns-sop.md` | When and how to use Facade, Strategy, Builder, Factory, Observer, Adapter, Template Method, Command patterns |
| `refactoring-sop.md` | Code smell detection and refactoring techniques: extract method, move features, simplify conditionals, React-specific refactoring |

### Quick References

| Doc | What It Covers |
|-----|---------------|
| `backend-patterns.md` | Short reference: async vs sync rules, DB engines, module structure, service pattern, settings, error handling, rate limiting, schema design |
| `frontend-patterns.md` | Short reference: file organization, API calls (Orval), code splitting, SSE/real-time, page transitions, styling conventions |

**Rule:** Before implementing a new feature, check the relevant SOP. Before refactoring, check `refactoring-sop.md`. When adding a backend domain, follow `backend-sop.md` sections 4-8.

---

## Git Workflow

- **Every task gets its own branch** with the Linear task number as prefix
- **Commit messages follow Conventional Commits** for semantic-release
- PR flow: feature branch → `dev` → `main`

## Key Commands

```bash
pnpm dev                    # Start all apps
pnpm build                  # Build everything
pnpm test                   # Run all tests
pnpm test:e2e               # Run E2E tests (Playwright)
pnpm db:migrate             # Run all DB migrations
pnpm run generate-api       # Regenerate FastAPI client
poetry run start            # Start FastAPI only
poetry run pytest           # Backend tests only
poetry run celery-worker    # Start Celery worker
```

---

## Maintaining This File

Whenever Claude makes changes to the workspace structure, commands, or conventions — update this file.
