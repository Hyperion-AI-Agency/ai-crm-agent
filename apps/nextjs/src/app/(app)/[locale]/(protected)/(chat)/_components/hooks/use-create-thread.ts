"use client";

import { useTRPC, useTRPCClient } from "@/server/trpc/trpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateThread() {
  const trpc = useTRPC();
  const trpcClient = useTRPCClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars: { subject: string }) => trpcClient.threads.create.mutate(vars),
    onSuccess: newThread => {
      queryClient.setQueriesData<unknown>(trpc.threads.list.queryFilter(), (old: unknown) => {
        if (old == null) return old;
        if (typeof old === "object" && "pages" in (old as Record<string, unknown>)) {
          const inf = old as { pages: unknown[][]; pageParams: unknown[] };
          return { ...inf, pages: [[newThread, ...(inf.pages[0] ?? [])], ...inf.pages.slice(1)] };
        }
        if (Array.isArray(old)) return [newThread, ...old];
        return old;
      });
      void queryClient.invalidateQueries(trpc.threads.count.queryFilter());
    },
  });
}
