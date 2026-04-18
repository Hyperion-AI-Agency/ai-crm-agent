import { Suspense } from "react";
import { fetchCategories } from "@/actions/fetch-categories";
import { getTranslations } from "next-intl/server";

import { BlogCategoryFilter } from "./blog-category-filter";
import { BlogPostsGrid } from "./blog-posts-grid";
import { BlogPostsLoading } from "./blog-posts-loading";
import { BlogSearchBar } from "./blog-search-bar";

interface BlogIndexSectionProps {
  locale: string;
  title?: string | null;
  subtitle?: string | null;
  searchParams?: {
    page?: string;
    search?: string;
    sort?: string;
    category?: string;
  };
}

export async function BlogIndexSection({
  locale,
  title,
  subtitle,
  searchParams,
}: BlogIndexSectionProps) {
  const t = await getTranslations({ locale, namespace: "common" });
  const categories = await fetchCategories(locale);

  const currentPage = searchParams?.page ? parseInt(searchParams.page, 10) : 1;
  const sortValue = searchParams?.sort || "newest";

  const activeCategory = searchParams?.category
    ? categories.find(c => c.slug === searchParams.category)
    : null;

  // Heading: category title → CMS block title → fallback
  const heading = activeCategory?.title ?? title ?? t("blog");

  // Subtitle: category description → CMS block subtitle → fallback
  let subtitleText: string | null = null;
  if (activeCategory?.content?.description) {
    const desc = activeCategory.content.description;
    const firstChild = (
      desc as { root?: { children?: { text?: string; children?: { text?: string }[] }[] } }
    )?.root?.children?.[0];
    subtitleText = firstChild?.text ?? firstChild?.children?.[0]?.text ?? null;
  } else {
    subtitleText = subtitle ?? t("blogSubtitle");
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Header */}
      <section className="pt-32 pb-8 md:pt-40">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-foreground mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              {heading}
            </h1>
            {subtitleText && (
              <p className="text-muted-foreground text-base md:text-lg">{subtitleText}</p>
            )}
          </div>
        </div>
      </section>

      {/* Category Filter Pills + Search */}
      <section className="border-border/50 border-b pb-6">
        <div className="container mx-auto px-4">
          <BlogCategoryFilter
            categories={categories}
            currentCategory={searchParams?.category}
            allLabel={t("all")}
          />
          <div className="mt-6">
            <BlogSearchBar
              searchPlaceholder={t("searchArticles")}
              sortByLabel={t("sortBy")}
              newestLabel={t("newest")}
              oldestLabel={t("oldest")}
              mostPopularLabel={t("mostPopular")}
            />
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <Suspense fallback={<BlogPostsLoading />}>
            <BlogPostsGrid
              locale={locale}
              page={currentPage}
              search={searchParams?.search}
              sort={sortValue}
              category={searchParams?.category}
              loadMoreLabel={t("loadMore")}
            />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
