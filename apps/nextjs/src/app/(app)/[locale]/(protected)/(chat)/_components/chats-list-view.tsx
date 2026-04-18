"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTRPC } from "@/server/trpc/trpc";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Loader2, Plus, Search } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/** Returns localized relative time for "Last message {{time}}". */
function formatLastMessageTime(
  date: Date,
  t: (key: string, values?: Record<string, unknown>) => string,
  locale: string
): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "";
  if (diffMin < 60)
    return diffMin === 1 ? t("timeMinute", { count: 1 }) : t("timeMinutes", { count: diffMin });
  if (diffHour < 24)
    return diffHour === 1 ? t("timeHour", { count: 1 }) : t("timeHours", { count: diffHour });
  if (diffDay < 7)
    return diffDay === 1 ? t("timeDay", { count: 1 }) : t("timeDays", { count: diffDay });
  return date.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

const PAGE_SIZE = 20;

/**
 * Chats list view: fetches threads from tRPC (paginated). New chat goes to /new.
 */
export function ChatsListView() {
  const t = useTranslations("dashboard.chat");
  const locale = useLocale();
  const [search, setSearch] = useState("");
  const trpc = useTRPC();
  const sentinelRef = useRef<HTMLDivElement>(null);

  const { data: totalCount } = useQuery(trpc.threads.count.queryOptions());

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isError,
    error,
    refetch,
  } = useInfiniteQuery(
    trpc.threads.list.infiniteQueryOptions(
      { limit: PAGE_SIZE },
      {
        getNextPageParam: (lastPage, allPages) =>
          lastPage.length === PAGE_SIZE ? allPages.length * PAGE_SIZE : undefined,
      }
    )
  );

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const threads = data ? data.pages.flat() : [];
  const isLoading = isFetching && threads.length === 0;

  const filteredThreads = filterThreadsBySearch(threads, search);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col overflow-hidden px-4 py-8">
      {/* Header: title + New chat */}
      <div className="flex shrink-0 items-center justify-between gap-4 pb-6">
        <h1 className="text-3xl font-semibold tracking-tight">
          {t("chatsTitle", { defaultMessage: "Chats" })}
        </h1>
        <Button
          asChild
          className="gap-1.5 bg-black text-white hover:bg-black/85 dark:bg-white dark:text-black dark:hover:bg-white/85"
        >
          <Link href="/new">
            <Plus className="h-4 w-4" />
            {t("newChat", { defaultMessage: "New chat" })}
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="shrink-0 pb-4">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
          <Input
            type="search"
            placeholder={t("searchPlaceholder", { defaultMessage: "Search your chats..." })}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="h-11 rounded-2xl pl-11"
            aria-label={t("searchPlaceholder", { defaultMessage: "Search your chats..." })}
          />
        </div>
      </div>

      {/* Count row */}
      {!isLoading && !isError && (totalCount ?? 0) > 0 && (
        <div className="text-muted-foreground shrink-0 border-b pb-2 text-sm">
          {t("chatsCount", { count: totalCount, defaultMessage: `${totalCount ?? 0} chats` })}
        </div>
      )}

      {/* List, loading, error, or empty state */}
      <div className="flex-1 overflow-y-auto">
        {isError && (
          <div className="text-destructive flex flex-col items-center justify-center gap-2 p-8 text-center text-sm">
            <p>{error.message || t("loadFailed", { defaultMessage: "Failed to load chats" })}</p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              {t("retry", { defaultMessage: "Retry" })}
            </Button>
          </div>
        )}

        {!isError && isLoading && (
          <div className="text-muted-foreground flex flex-1 items-center justify-center gap-2 p-8">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">{t("loading", { defaultMessage: "Loading..." })}</span>
          </div>
        )}

        {!isError && !isLoading && threads.length === 0 && (
          <div className="text-muted-foreground flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <p className="text-sm">
              {t("noThreadsYet", {
                defaultMessage: "No threads yet. Start a new chat to see them here.",
              })}
            </p>
          </div>
        )}

        {!isError && !isLoading && threads.length > 0 && (
          <>
            <ul className="divide-border divide-y">
              {filteredThreads.map(thread => (
                <li key={thread.id}>
                  <Link
                    href={`/chat/${thread.id}`}
                    className="hover:bg-muted/40 flex flex-col gap-1 px-2 py-4 transition-colors"
                  >
                    <span className="text-base leading-snug font-medium">{thread.subject}</span>
                    <span className="text-muted-foreground text-sm">
                      {(() => {
                        const timeStr = formatLastMessageTime(thread.modifiedAt, t, locale);
                        return timeStr === ""
                          ? t("lastMessageJustNow")
                          : t("lastMessage", { time: timeStr });
                      })()}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <div ref={sentinelRef} className="py-2">
              {isFetchingNextPage && (
                <div className="text-muted-foreground flex justify-center py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function filterThreadsBySearch(
  threads: { id: string; subject: string; modifiedAt: Date }[],
  q: string
): { id: string; subject: string; modifiedAt: Date }[] {
  if (!q.trim()) return threads;
  const lower = q.trim().toLowerCase();
  return threads.filter(t => t.subject.toLowerCase().includes(lower));
}
