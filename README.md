# Production Claude Agents with MCP + CRM - Reference Architecture

Reference architecture for teams building Claude-powered chatbots that read and write CRM data safely. Demonstrates the pattern that works in production: MCP tools for CRM integration, three layers of memory, confirmation-gated writes, immutable audit log.

Built by [Vitalijus Alsauskas / HyperionAI](https://www.linkedin.com/in/vitalijus-hyperion/) as a public reference for firms extending Claude into CRM-aware chatbot territory.

---

## Why this exists

Claude + CRM chatbots usually fail in two predictable ways:
- **Memory gap:** the bot remembers this conversation but nothing from last week, so users re-explain context every session
- **Silent writes:** the bot mutates CRM records without review, users find surprise entries

This reference shows the pattern that works:

1. **MCP tools** - expose CRM capabilities via Model Context Protocol. Swap CRMs without touching the agent.
2. **Three memory layers** - session (current conversation), user (preferences, recent interactions), account (company-wide context). Composed at prompt time so no one layer has to hold everything.
3. **Confirmation-gated writes** - every mutating tool goes through a guardrail. Agent drafts, user approves, commit fires. Nothing silently changes.
4. **Immutable audit log** - every tool call + commit logged to append-only S3 with before/after. Regulatory-grade.
5. **Isolation per user** - one user cannot see another's memory or audit trail.

---

## Documentation

| Document | Purpose |
|----------|---------|
| [docs/architecture.md](docs/architecture.md) | Layered architecture + component responsibilities |
| [docs/architecture.svg](docs/architecture.svg) | Architecture diagram (rendered) |
| [docs/flow.svg](docs/flow.svg) | Conversation flow: read path + confirmation-gated write path |
| [DESIGN_DOC.pdf](DESIGN_DOC.pdf) | Branded design doc with reasoning, tool choices, risks |
| [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) | Phase-by-phase build plan with milestones and risks |
| [CLAUDE.md](CLAUDE.md) | Operational rules for Claude Code working in this codebase |

---

## Stack

| Layer | Technology |
|-------|-----------|
| Chat UI | Next.js 15 (App Router, streaming) |
| Agent Runtime | FastAPI + Anthropic SDK |
| Tool Layer | Model Context Protocol (MCP) server in Python |
| Memory | Postgres (session + user + account) + pgvector (long-term semantic) |
| Audit Log | Immutable S3 bucket (Object Lock) + Postgres mirror |
| CRM | HubSpot / Salesforce / Pipedrive (adapter per backend) |
| LLM | Anthropic Claude 3.5 Sonnet (zero-retention) |
| Observability | Sentry |

---

## Quick Start (local dev)

```bash
pnpm install
docker compose -f docker-compose.local.yml up -d
cd apps/api && poetry install && poetry run alembic upgrade head && cd ../..
pnpm dev
```

---

## Who this is for

**Firms extending an existing Claude setup** into CRM-aware chatbot capabilities (not greenfield - if you're starting from scratch, the foundations are here too).

**Developers hired to build a Claude+CRM chatbot** - fork this repo, the MCP + memory + guardrail pattern is the hardest part and it's already figured out.

**Technical reviewers** - skim the architecture and flow diagrams to see what production-ready Claude + CRM looks like.

---

## About

Built by Vitalijus Alsauskas. Ex-IBM (4 years, Fortune 500 clients including AskProcurement, a chatbot integrating Dun & Bradstreet data for procurement teams). Claude Code and MCP are my daily setup - currently running Claude in production on Adboard (Next.js + Supabase + Claude API with OAuth into Meta, Google, Shopify) and Fit7D (FastAPI + Claude dialogue platform).

If you're building this and want a second set of eyes, I offer a free 30-minute scoping call - reach out via LinkedIn or [vitalijus.io](https://vitalijus.io).

- GitHub: https://github.com/Vitals9367
- LinkedIn: https://www.linkedin.com/in/vitalijus-hyperion/

---

## License

MIT. Fork, adapt, ship.
