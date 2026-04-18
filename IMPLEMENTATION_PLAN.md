# Implementation Plan

Phased build plan for production Claude agents with MCP tools and CRM integration.

---

## Problem Statement

Claude plus CRM chatbots usually fail in two predictable ways: they lose memory across sessions (users re-explain context constantly) or they write to CRM without proper review (surprise records). This plan ships in three two-week phases with a read-only chatbot by week 2 and full confirmation-gated writes by week 4.

---

## Phase 1: Foundation (week 1-2)

**Shipping:** Read-only chatbot answering CRM questions with session memory.

### Milestones

- [ ] Chat UI with streaming responses (Next.js App Router)
- [ ] Agent orchestrator with Claude tool-use loop (FastAPI + Anthropic SDK)
- [ ] MCP server with 3 read tools: `get_contact`, `search_contacts`, `get_history`
- [ ] Session memory via Postgres (last N conversation turns)
- [ ] One CRM backend integrated (HubSpot, Salesforce, or Pipedrive)
- [ ] Audit log for every tool call (S3 immutable + Postgres mirror)
- [ ] Integration tests for read flows
- [ ] Docker Compose for local dev

### Definition of done

A user asks "what's happening with Acme?" and the bot correctly reads contact + history from the CRM, answers the question, and every tool call is in the audit log. Session memory carries context across the same conversation.

---

## Phase 2: Memory + Writes (week 3-4)

**Shipping:** Full three-layer memory + confirmation-gated write support.

### Milestones

- [ ] User memory layer (preferences, last interactions per user)
- [ ] Account memory layer (company-wide context shared across users)
- [ ] Vector store for semantic recall (pgvector on existing Postgres)
- [ ] Write guardrail middleware that intercepts mutating tool calls
- [ ] Draft persistence in Postgres (proposed changes not yet committed)
- [ ] Confirmation drawer UI: user sees draft, approves or rejects, commit fires
- [ ] One write tool enabled: `log_activity` (lowest-risk write)
- [ ] Admin UI: view audit trail, search conversations, revoke draft

### Definition of done

A user says "log a call with Acme about renewal". The bot creates a draft, UI shows "log call with Acme: renewal topic?", user confirms, CRM fires. Audit log shows draft creation + user approval + CRM commit.

---

## Phase 3: Production Polish (week 5-6)

**Shipping:** Second CRM backend if needed, observability, deploy, handoff.

### Milestones

- [ ] Second CRM backend (if multi-CRM needed - just swap adapter, agent unchanged)
- [ ] Sentry error tracking (tool call errors, memory load failures, CRM API errors)
- [ ] Rate limiter on CRM API calls (per-user concurrency limits, exponential backoff on 429)
- [ ] Full runbook: hallucination response, conversation replay, user access revocation, draft cleanup
- [ ] Knowledge transfer session + recorded walkthrough
- [ ] Production deploy via GitHub Actions

### Definition of done

Team can run the agent in production, handle incidents from the runbook, and onboard a new internal user in under 5 minutes.

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Agent writes to CRM silently | Confirmation-gated flow. Every mutating tool creates a draft, user must approve, commit logs to audit. |
| Agent hallucinates CRM data | System prompt forbids answering without tool call. Strict tool schemas. Audit log shows usage - hallucinations caught in review. |
| PII in conversation history | Anthropic zero-retention flag. Memory redacts sensitive fields before embedding. User-level data isolation. |
| CRM API rate limits | MCP server caches recent reads (60s TTL), batches where possible, exponential backoff on 429. Per-user concurrency limits. |
| Audit log tampering | S3 Object Lock for immutability. Postgres mirror for query. Cannot delete or modify existing audit rows via app code. |

---

## What I Need From You

To move into Phase 1:

- **CRM you're on** (HubSpot / Salesforce / Pipedrive / other)
- **Top 5 reads + top 2 writes** you want the chatbot to cover
- **3-5 sample user scenarios** for testing
- **Current Claude setup details** (direct API, vendor, any existing MCP work)
- **Compliance requirements** (data residency, retention, redaction)
- **30-minute kickoff call** to tighten scope before code ships
