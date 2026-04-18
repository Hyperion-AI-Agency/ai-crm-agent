import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { threads } from "@/server/db/schemas/threads-schema";
import { TRPCError } from "@trpc/server";
import { count, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";

export const threadsRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        cursor: z.number().default(0),
      })
    )
    .query(async ({ ctx, input }) =>
      ctx.db
        .select()
        .from(threads)
        .where(eq(threads.userId, ctx.session.user.id))
        .orderBy(desc(threads.modifiedAt))
        .limit(input.limit)
        .offset(input.cursor)
    ),

  count: protectedProcedure.query(async ({ ctx }) => {
    const [result] = await ctx.db
      .select({ count: count() })
      .from(threads)
      .where(eq(threads.userId, ctx.session.user.id));
    return result?.count ?? 0;
  }),

  create: protectedProcedure
    .input(z.object({ subject: z.string().min(1).max(512) }))
    .mutation(async ({ ctx, input }) => {
      const [thread] = await ctx.db
        .insert(threads)
        .values({ userId: ctx.session.user.id, subject: input.subject })
        .returning();
      if (!thread) throw new Error("Failed to create thread");
      return thread;
    }),

  touch: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(threads)
        .set({ modifiedAt: sql`now()` })
        .where(eq(threads.id, input.id));
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [thread] = await ctx.db.select().from(threads).where(eq(threads.id, input.id));
      if (!thread || thread.userId !== ctx.session.user.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return thread;
    }),

  rename: protectedProcedure
    .input(z.object({ id: z.string().uuid(), subject: z.string().min(1).max(512) }))
    .mutation(async ({ ctx, input }) => {
      const [updated] = await ctx.db
        .update(threads)
        .set({ subject: input.subject, modifiedAt: sql`now()` })
        .where(eq(threads.id, input.id))
        .returning();
      if (!updated || updated.userId !== ctx.session.user.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return updated;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [deleted] = await ctx.db.delete(threads).where(eq(threads.id, input.id)).returning();
      if (!deleted || deleted.userId !== ctx.session.user.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
    }),
});
