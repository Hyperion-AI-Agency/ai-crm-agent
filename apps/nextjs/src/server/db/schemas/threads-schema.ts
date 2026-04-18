import { index, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const threads = pgTable(
  "threads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull(),
    subject: varchar("subject", { length: 512 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    modifiedAt: timestamp("modified_at", { withTimezone: true }).notNull().defaultNow(),
  },
  t => [
    index("threads_user_id_idx").on(t.userId),
    index("threads_modified_at_idx").on(t.modifiedAt),
  ]
);
