# Architecture

This document describes the architecture for production Claude agents that read and write CRM data safely.

Two views:

- **Structural** - layered architecture in [architecture.svg](architecture.svg)
- **Dynamic** - conversation + write-confirmation flow in [flow.svg](flow.svg)

---

## Structural View

![Architecture](architecture.svg)

Source: [`architecture.d2`](architecture.d2)

### Layers

| Layer | Role | Tech |
|-------|------|------|
| Users | Who interacts | Internal team (sales, CS, ops), Admins |
| Chat Surface | Browser-facing UI | Next.js + React streaming |
| Agent Runtime | Claude orchestration + memory + guardrails | FastAPI + Anthropic SDK |
| MCP Server | CRM actions exposed as agent tools | Python MCP server |
| Data | Memory, audit, drafts | Postgres, vector store, immutable audit log |
| External | Claude API, CRM API, Sentry | Managed services |

### Component Responsibilities

**Chat Surface**
- Chat UI with streaming responses
- Confirmation drawer for write actions - user sees draft, approves or edits, then commit fires
- Audit view showing every prior conversation + tool call for a given user

**Agent Runtime**
- Orchestrator: the Claude tool-use loop (prompt → tool call → result → next prompt)
- Memory Manager: three layers - session (current conversation), user (per-user preferences, last interactions), account (company-wide context across multiple users)
- Write Guardrails: intercepts any mutating tool call, persists a draft row, returns a confirmation prompt. Write commits only after explicit user approval.

**MCP Server**
- Exposes CRM capabilities as Model Context Protocol tools
- Read tools (`get_contact`, `search_contacts`, `get_history`) return immediately
- Write tools (`update_stage`, `log_activity` - if intrusive) route through guardrails by default
- Every tool invocation logged to the audit bucket with full input + result

**Data**
- Postgres holds conversation history, memory layers, draft records, user preferences
- Vector store holds long-term semantic memory ("similar past conversations with this account")
- Immutable audit log records every tool call + every commit with before/after snapshots

---

## Dynamic View

![Flow](flow.svg)

Source: [`flow.d2`](flow.d2)

### Read flow (steps 1-23)

User asks "What's happening with Acme?". Agent loads conversation + user + account memory, sends prompt + MCP tool schema to Claude. Claude decides to call `search_contacts`, then `get_history`. Each tool call hits the CRM API and logs to audit. Claude composes a final answer, agent streams it back to the UI. Nothing mutated.

### Write flow (steps 24-36)

User asks the agent to "mark Acme as closed-won". Claude returns a tool call for `update_stage`. The agent detects a mutating tool and routes through the guardrail: creates a draft row in Postgres, returns a confirmation prompt to the UI. Only after the user explicitly confirms does the commit hit the CRM. The audit log records the commit with user ID, timestamp, and before/after values.

---

## Key Design Decisions

### Why MCP instead of custom function calling?

MCP (Model Context Protocol) gives a clean contract between the agent and the CRM adapter. Swapping HubSpot for Salesforce is a change to the MCP server, not the agent. The agent code never knows which CRM it's talking to.

### Why three memory layers instead of one?

Session memory alone is not enough - users stop re-explaining every session. User memory alone misses account-wide context (team members share accounts). Account memory alone misses the user's personal style. Three layers composed at prompt time solve all three without stuffing everything into every context.

### Why confirmation-gated writes?

Claude is excellent at reading data and drafting actions. It is occasionally wrong about what the user meant to mutate. Draft-then-confirm means the user sees exactly what would change before it changes. Aligns with how humans already work: in most CRMs you can preview before save.

### Why immutable audit log?

Compliance + trust. If a chat-driven write ever causes a regression ("why did Acme move to closed-won?"), the audit log has the exact conversation that led to it, with before/after values. Regulators and managers both want this.

### Why Postgres for memory instead of a vector-only store?

Structured memory (last 10 turns, user preferences, draft records) is relational. Vector store is layered on top for semantic recall ("find conversations similar to this one"), not for primary storage. Most writes are simple row inserts - a vector store would be the wrong tool for that job.
