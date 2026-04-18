"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface BlogLoadMoreProps {
  nextPage: number;
  search?: string;
  sort?: string;
  category?: string;
  label: string;
}

export function BlogLoadMore({ nextPage, search, sort, category, label }: BlogLoadMoreProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleLoadMore = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", nextPage.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="mt-16 text-center">
      <button
        onClick={handleLoadMore}
        className="border-foreground text-foreground hover:bg-foreground hover:text-background inline-flex items-center rounded-full border px-8 py-3 text-sm font-semibold transition-colors"
      >
        {label}
      </button>
    </div>
  );
}
