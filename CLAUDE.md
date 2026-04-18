# CLAUDE.md

This file is the operational foundation for Claude Code. Read it at session start. Follow it exactly.

---

## What This Project Is

Reference architecture for Claude agents with MCP tools and CRM integration. Demonstrates three-layer memory, confirmation-gated writes, and immutable audit logging.

## Stack

| Layer | Technology |
|-------|-----------|
| Chat UI | Next.js 15 (App Router, streaming) |
| Agent Runtime | FastAPI + Anthropic SDK |
| Tool Layer | Model Context Protocol (MCP) server |
| Memory | Postgres (session + user + account) + pgvector |
| Audit | Immutable S3 (Object Lock) + Postgres mirror |
| CRM | HubSpot / Salesforce / Pipedrive (pluggable adapter) |
| LLM | Anthropic Claude 3.5 Sonnet (zero-retention) |

---

## Commands

| Command | Purpose |
|---------|---------|
| `/test` | Run tests |
| `/lint` | Run linter |
| `/dev` | Start local dev environment |
| `/audit` | Query the audit log |

---

## Conventions

- Every mutating tool routes through the confirmation guardrail - no silent CRM writes

- Three memory layers composed at prompt time (session + user + account)

- Every tool call logged to immutable audit bucket

- User-level data isolation - memory and audit scoped per user_id

- CRM adapter per backend - swapping CRMs is one file change, not an agent rewrite

- PII redacted before embedding into vector store

---

## Operational Rules

1. **Never hardcode secrets.** API keys, passwords, connection strings go in environment variables or secret managers.
2. **Follow existing patterns.** Read existing code before modifying. Match the style.
3. **Test before committing.** Run the test suite and linters before pushing.
4. **One concern per change.** Keep PRs focused on a single feature or fix.
