"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTRPC, useTRPCClient } from "@/server/trpc/trpc";
import type { Message } from "@copilotkit/shared";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronDown, Download, Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

interface ThreadHeaderProps {
  threadId: string;
  messages: Message[];
}

export function ThreadHeader({ threadId, messages }: ThreadHeaderProps) {
  const t = useTranslations("dashboard.chat");
  const router = useRouter();
  const trpc = useTRPC();
  const trpcClient = useTRPCClient();
  const queryClient = useQueryClient();

  const [subject, setSubject] = useState("");
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    void trpcClient.threads.getById.query({ id: threadId }).then(thread => {
      setSubject(thread.subject);
      setRenameValue(thread.subject);
    });
  }, [threadId, trpcClient]);

  const handleRenameOpen = () => {
    setRenameValue(subject);
    setRenameOpen(true);
  };

  /** Optimistically update all threads.list queries (sidebar + recents page). */
  const updateThreadsCache = (
    updater: (threads: Record<string, unknown>[]) => Record<string, unknown>[]
  ) => {
    queryClient.setQueriesData<unknown>(trpc.threads.list.queryFilter(), (old: unknown) => {
      if (old == null) return old;
      // Infinite query shape: { pages: T[][], pageParams: ... }
      if (typeof old === "object" && "pages" in (old as Record<string, unknown>)) {
        const inf = old as { pages: Record<string, unknown>[][]; pageParams: unknown[] };
        const flat = inf.pages.flat();
        const updated = updater(flat);
        // Re-chunk into pages of original sizes
        const pages: Record<string, unknown>[][] = [];
        let offset = 0;
        for (const page of inf.pages) {
          pages.push(updated.slice(offset, offset + page.length));
          offset += page.length;
        }
        if (offset < updated.length) pages.push(updated.slice(offset));
        return { ...inf, pages };
      }
      // Regular query shape: T[]
      if (Array.isArray(old)) return updater(old as Record<string, unknown>[]);
      return old;
    });
  };

  const handleRename = async () => {
    const trimmed = renameValue.trim();
    if (!trimmed || trimmed === subject) {
      setRenameOpen(false);
      return;
    }
    setIsRenaming(true);
    try {
      await trpcClient.threads.rename.mutate({ id: threadId, subject: trimmed });
      setSubject(trimmed);
      updateThreadsCache(threads =>
        threads.map(th => (th.id === threadId ? { ...th, subject: trimmed } : th))
      );
      toast.success(t("threadRenameSuccess"));
      setRenameOpen(false);
    } catch {
      toast.error(t("threadRenameFailed"));
    } finally {
      setIsRenaming(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await trpcClient.threads.delete.mutate({ id: threadId });
      updateThreadsCache(threads => threads.filter(th => th.id !== threadId));
      void queryClient.invalidateQueries(trpc.threads.count.queryFilter());
      toast.success(t("threadDeleteSuccess"));
      router.push("/new");
    } catch {
      toast.error(t("threadDeleteFailed"));
      setIsDeleting(false);
      setDeleteOpen(false);
    }
  };

  const handleExport = () => {
    const lines = messages
      .filter(m => m.role === "user" || m.role === "assistant")
      .map(m => {
        const role = m.role === "user" ? "You" : "Assistant";
        const content = typeof m.content === "string" ? m.content : "";
        return `${role}:\n${content}`;
      });
    const text = lines.join("\n\n---\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${subject.replace(/[^a-z0-9]/gi, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="dark:border-border flex h-[52px] shrink-0 items-center border-b border-[#E2E8F0] px-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="dark:text-foreground flex max-w-xs items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-[#2C3E50] transition-colors hover:bg-black/5 lg:max-w-md dark:hover:bg-white/10"
            >
              <span className="truncate">{subject}</span>
              <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-60" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem onClick={handleRenameOpen} className="gap-2">
              <Pencil className="h-4 w-4" />
              {t("threadRename")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExport} className="gap-2">
              <Download className="h-4 w-4" />
              {t("threadExport")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setDeleteOpen(true)} className="gap-2">
              <Trash2 className="h-4 w-4" />
              {t("threadDelete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Rename dialog */}
      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{t("threadRenameTitle")}</DialogTitle>
          </DialogHeader>
          <Input
            value={renameValue}
            onChange={e => setRenameValue(e.target.value)}
            placeholder={t("threadRenamePlaceholder")}
            onKeyDown={e => {
              if (e.key === "Enter") void handleRename();
            }}
            autoFocus
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameOpen(false)} disabled={isRenaming}>
              {t("cancel")}
            </Button>
            <Button
              onClick={() => void handleRename()}
              disabled={isRenaming || !renameValue.trim()}
            >
              {t("confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{t("threadDeleteTitle")}</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground text-sm">{t("threadDeleteMessage")}</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)} disabled={isDeleting}>
              {t("cancel")}
            </Button>
            <Button variant="destructive" onClick={() => void handleDelete()} disabled={isDeleting}>
              {t("threadDelete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
