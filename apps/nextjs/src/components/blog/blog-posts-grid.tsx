import { fetchPosts } from "@/actions/fetch-posts";

import type { Locale } from "@/lib/i18n/routing";
import { BlogLoadMore } from "@/components/blog/blog-load-more";
import { BlogPostCard } from "@/components/blog/blog-post-card";

interface BlogPostsGridProps {
  locale: Locale;
  page: number;
  search?: string;
  sort: string;
  category?: string;
  loadMoreLabel: string;
}

export async function BlogPostsGrid({
  locale,
  page,
  search,
  sort,
  category,
  loadMoreLabel,
}: BlogPostsGridProps) {
  const sortMap: Record<string, string> = {
    newest: "-date",
    oldest: "date",
    popular: "-date",
  };

  const postsResult = await fetchPosts({
    locale,
    page,
    limit: 9,
    category: category || undefined,
    search: search || undefined,
    sort: sortMap[sort] || "-date",
  });

  if (postsResult.docs.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted-foreground text-lg">No blog posts found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {postsResult.docs.map(post => (
          <BlogPostCard key={post.id} post={post} locale={locale} />
        ))}
      </div>

      {/* Load More */}
      {postsResult.hasNextPage && postsResult.nextPage && (
        <BlogLoadMore
          nextPage={postsResult.nextPage}
          search={search}
          sort={sort}
          category={category}
          label={loadMoreLabel}
        />
      )}
    </>
  );
}
