"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BlogSearchBarProps {
  searchPlaceholder: string;
  sortByLabel: string;
  newestLabel: string;
  oldestLabel: string;
  mostPopularLabel: string;
}

export function BlogSearchBar({
  searchPlaceholder,
  sortByLabel,
  newestLabel,
  oldestLabel,
  mostPopularLabel,
}: BlogSearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");

  const currentSort = searchParams.get("sort") || "newest";

  useEffect(() => {
    setSearchValue(searchParams.get("search") || "");
  }, [searchParams]);

  const updateSearchParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`?${params.toString()}`);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateSearchParams("search", searchValue);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchValue]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative max-w-sm flex-1">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 w-full rounded-full border px-10 py-2.5 text-sm focus:ring-2 focus:outline-none"
        />
      </div>

      <Select value={currentSort} onValueChange={value => updateSearchParams("sort", value)}>
        <SelectTrigger className="w-full rounded-full sm:w-[160px]">
          <SelectValue placeholder={sortByLabel} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">{newestLabel}</SelectItem>
          <SelectItem value="oldest">{oldestLabel}</SelectItem>
          <SelectItem value="popular">{mostPopularLabel}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
