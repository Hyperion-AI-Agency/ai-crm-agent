"use client";

import { useRouter, useSearchParams } from "next/navigation";

import type { Category } from "@/types/payload-types";

interface BlogCategoryFilterProps {
  categories: Category[];
  currentCategory?: string;
  allLabel: string;
}

export function BlogCategoryFilter({
  categories,
  currentCategory,
  allLabel,
}: BlogCategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCategoryChange = (categorySlug?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categorySlug) {
      params.set("category", categorySlug);
    } else {
      params.delete("category");
    }
    params.delete("page");
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => handleCategoryChange()}
        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
          !currentCategory
            ? "bg-foreground text-background"
            : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
        }`}
      >
        {allLabel}
      </button>
      {categories.map(category => (
        <button
          key={category.id}
          onClick={() => handleCategoryChange(category.slug)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            currentCategory === category.slug
              ? "bg-foreground text-background"
              : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
          }`}
        >
          {category.title}
        </button>
      ))}
    </div>
  );
}
