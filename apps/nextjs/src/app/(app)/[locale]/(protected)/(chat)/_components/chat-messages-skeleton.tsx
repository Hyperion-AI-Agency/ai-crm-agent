"use client";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const skeletonGray = "bg-gray-200 dark:bg-gray-700";

/**
 * Placeholder skeleton shown while chat messages are loading (e.g. thread opened, checkpoint loading).
 */
export function ChatMessagesSkeleton() {
  return (
    <div className="space-y-6">
      {/* Assistant message */}
      <div className="flex items-end gap-3">
        <Skeleton className={cn(skeletonGray, "size-8 shrink-0 rounded-full")} />
        <Skeleton className={cn(skeletonGray, "h-16 w-[280px] max-w-[80%] rounded-2xl")} />
      </div>
      {/* User message */}
      <div className="flex items-end justify-end gap-3">
        <Skeleton className={cn(skeletonGray, "h-12 w-[200px] max-w-[80%] rounded-2xl")} />
      </div>
      {/* Assistant message */}
      <div className="flex items-end gap-3">
        <Skeleton className={cn(skeletonGray, "size-8 shrink-0 rounded-full")} />
        <Skeleton className={cn(skeletonGray, "h-24 w-[320px] max-w-[80%] rounded-2xl")} />
      </div>
    </div>
  );
}
