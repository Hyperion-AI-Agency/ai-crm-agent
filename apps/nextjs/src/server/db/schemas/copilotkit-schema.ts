import { bigint, jsonb, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { threads } from "./threads-schema";

/**
 * Stores compacted CopilotKit agent run events per thread.
 * Used by DbAgentRunner to persist thread history across server restarts.
 */
export const copilotkit_runs = pgTable("copilotkit_runs", {
  runId: text("run_id").primaryKey(),
  threadId: uuid("thread_id")
    .notNull()
    .references(() => threads.id, { onDelete: "cascade" }),
  parentRunId: text("parent_run_id"),
  // Compacted BaseEvent[] for the run — stored as JSONB for efficient querying
  events: jsonb("events").notNull().$type<object[]>(),
  createdAt: bigint("created_at", { mode: "number" }).notNull(),
});
