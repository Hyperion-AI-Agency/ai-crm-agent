/**
 * DbAgentRunner — a CopilotKit AgentRunner that persists thread history to Postgres.
 *
 * Mirrors InMemoryAgentRunner exactly, replacing the in-memory historicRuns array
 * with DB reads/writes. Run-state (isRunning, subjects, agent ref) stays in memory.
 */

import { db } from "@/server/db/drizzle";
import { copilotkit_runs } from "@/server/db/schemas/copilotkit-schema";
import type { AbstractAgent } from "@ag-ui/client";
import { compactEvents } from "@ag-ui/client";
import { EventType } from "@ag-ui/core";
import type { BaseEvent, RunStartedEvent } from "@ag-ui/core";
import { AgentRunner, finalizeRunEvents } from "@copilotkit/runtime/v2";
import type {
  AgentRunnerConnectRequest,
  AgentRunnerIsRunningRequest,
  AgentRunnerRunRequest,
  AgentRunnerStopRequest,
} from "@copilotkit/runtime/v2";
import { asc, eq } from "drizzle-orm";
import { ReplaySubject } from "rxjs";
import type { Observable } from "rxjs";

// ─── In-memory active-run state ──────────────────────────────────────────────

interface ActiveRun {
  isRunning: boolean;
  stopRequested: boolean;
  currentRunId: string | null;
  agent: AbstractAgent | null;
  subject: ReplaySubject<BaseEvent> | null;
  runSubject: ReplaySubject<BaseEvent> | null;
  currentEvents: BaseEvent[] | null;
}

const ACTIVE = new Map<string, ActiveRun>();

function getOrCreateActive(threadId: string): ActiveRun {
  let active = ACTIVE.get(threadId);
  if (!active) {
    active = {
      isRunning: false,
      stopRequested: false,
      currentRunId: null,
      agent: null,
      subject: null,
      runSubject: null,
      currentEvents: null,
    };
    ACTIVE.set(threadId, active);
  }
  return active;
}

// ─── DB helpers ───────────────────────────────────────────────────────────────

interface HistoricRun {
  threadId: string;
  runId: string;
  parentRunId: string | null;
  events: BaseEvent[];
  createdAt: number;
}

async function loadHistoricRuns(threadId: string): Promise<HistoricRun[]> {
  const rows = await db
    .select()
    .from(copilotkit_runs)
    .where(eq(copilotkit_runs.threadId, threadId))
    .orderBy(asc(copilotkit_runs.createdAt));
  return rows.map(r => ({
    threadId: r.threadId,
    runId: r.runId,
    parentRunId: r.parentRunId ?? null,
    events: r.events as BaseEvent[],
    createdAt: r.createdAt,
  }));
}

async function persistRun(run: HistoricRun): Promise<void> {
  await db
    .insert(copilotkit_runs)
    .values({
      runId: run.runId,
      threadId: run.threadId,
      parentRunId: run.parentRunId,
      events: run.events as object[],
      createdAt: run.createdAt,
    })
    .onConflictDoNothing();
}

// ─── DbAgentRunner ────────────────────────────────────────────────────────────

export class DbAgentRunner extends AgentRunner {
  run(request: AgentRunnerRunRequest): Observable<BaseEvent> {
    const { threadId } = request;
    const active = getOrCreateActive(threadId);

    if (active.isRunning) {
      throw new Error("Thread already running");
    }

    active.isRunning = true;
    active.currentRunId = request.input.runId;
    active.agent = request.agent;
    active.stopRequested = false;

    const seenMessageIds = new Set<string>();
    const currentRunEvents: BaseEvent[] = [];
    active.currentEvents = currentRunEvents;

    const nextSubject = new ReplaySubject<BaseEvent>(Infinity);
    const prevSubject = active.subject;
    active.subject = nextSubject;

    const runSubject = new ReplaySubject<BaseEvent>(Infinity);
    active.runSubject = runSubject;

    const runAgent = async () => {
      const historicRuns = await loadHistoricRuns(threadId);

      // Build set of message IDs already seen in past runs
      const historicMessageIds = new Set<string>();
      for (const run of historicRuns) {
        for (const event of run.events) {
          if ("messageId" in event && typeof event.messageId === "string") {
            historicMessageIds.add(event.messageId);
          }
          if (event.type === EventType.RUN_STARTED) {
            const runStarted = event as RunStartedEvent;
            for (const msg of runStarted.input?.messages ?? []) {
              historicMessageIds.add(msg.id);
            }
          }
        }
      }

      const parentRunId = historicRuns[historicRuns.length - 1]?.runId ?? null;

      const cleanup = () => {
        active.currentEvents = null;
        active.currentRunId = null;
        active.agent = null;
        active.runSubject = null;
        active.stopRequested = false;
        active.isRunning = false;
        runSubject.complete();
        nextSubject.complete();
      };

      try {
        await request.agent.runAgent(request.input, {
          onEvent: ({ event }: { event: BaseEvent }) => {
            let processed = event;
            if (event.type === EventType.RUN_STARTED) {
              const runStarted = event as RunStartedEvent;
              if (!runStarted.input) {
                processed = {
                  ...runStarted,
                  input: {
                    ...request.input,
                    messages: request.input.messages.filter(m => !historicMessageIds.has(m.id)),
                  },
                } as BaseEvent;
              }
            }
            runSubject.next(processed);
            nextSubject.next(processed);
            currentRunEvents.push(processed);
          },
          onNewMessage: ({ message }: { message: { id: string } }) => {
            seenMessageIds.add(message.id);
          },
          onRunStartedEvent: () => {
            for (const msg of request.input.messages) seenMessageIds.add(msg.id);
          },
        });

        const appended = finalizeRunEvents(currentRunEvents, {
          stopRequested: active.stopRequested,
        });
        for (const e of appended) {
          runSubject.next(e);
          nextSubject.next(e);
        }

        if (active.currentRunId) {
          await persistRun({
            threadId,
            runId: active.currentRunId,
            parentRunId,
            events: compactEvents(currentRunEvents),
            createdAt: Date.now(),
          });
        }

        cleanup();
      } catch (error) {
        const interruptionMessage = error instanceof Error ? error.message : String(error);

        const appended = finalizeRunEvents(currentRunEvents, {
          stopRequested: active.stopRequested,
          interruptionMessage,
        });
        for (const e of appended) {
          runSubject.next(e);
          nextSubject.next(e);
        }

        if (active.currentRunId && currentRunEvents.length > 0) {
          await persistRun({
            threadId,
            runId: active.currentRunId,
            parentRunId,
            events: compactEvents(currentRunEvents),
            createdAt: Date.now(),
          });
        }

        cleanup();
      }
    };

    if (prevSubject) {
      prevSubject.subscribe({
        next: e => nextSubject.next(e),
        error: err => nextSubject.error(err),
      });
    }

    void runAgent();
    return runSubject.asObservable();
  }

  connect(request: AgentRunnerConnectRequest): Observable<BaseEvent> {
    const { threadId } = request;
    const active = ACTIVE.get(threadId);
    const connectionSubject = new ReplaySubject<BaseEvent>(Infinity);

    void (async () => {
      const historicRuns = await loadHistoricRuns(threadId);

      if (historicRuns.length === 0 && !active?.isRunning) {
        connectionSubject.complete();
        return;
      }

      const allHistoric = historicRuns.flatMap(r => r.events);
      const compacted = compactEvents(allHistoric);
      const emittedMessageIds = new Set<string>();

      for (const event of compacted) {
        connectionSubject.next(event);
        if ("messageId" in event && typeof event.messageId === "string") {
          emittedMessageIds.add(event.messageId);
        }
      }

      if (active?.subject && (active.isRunning || active.stopRequested)) {
        active.subject.subscribe({
          next: event => {
            if ("messageId" in event && emittedMessageIds.has(event.messageId as string)) return;
            connectionSubject.next(event);
          },
          complete: () => connectionSubject.complete(),
          error: (err: unknown) => connectionSubject.error(err),
        });
      } else {
        connectionSubject.complete();
      }
    })();

    return connectionSubject.asObservable();
  }

  isRunning(request: AgentRunnerIsRunningRequest): Promise<boolean> {
    return Promise.resolve(ACTIVE.get(request.threadId)?.isRunning ?? false);
  }

  stop(request: AgentRunnerStopRequest): Promise<boolean | undefined> {
    const active = ACTIVE.get(request.threadId);
    if (!active?.isRunning || active.stopRequested) return Promise.resolve(false);

    active.stopRequested = true;
    active.isRunning = false;

    try {
      active.agent?.abortRun();
      return Promise.resolve(true);
    } catch (err) {
      console.error("Failed to abort agent run", err);
      active.stopRequested = false;
      active.isRunning = true;
      return Promise.resolve(false);
    }
  }
}
