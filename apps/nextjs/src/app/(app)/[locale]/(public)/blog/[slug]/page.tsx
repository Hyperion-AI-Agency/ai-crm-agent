import type { FC } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchPost } from "@/actions/fetch-post";
import { fetchRelatedPosts } from "@/actions/fetch-related-posts";
import { getLocale, getTranslations } from "next-intl/server";

import type { Category, Media } from "@/types/payload-types";
import { extractHeadingsFromHtml, injectHeadingIds } from "@/lib/blog-utils";
import { pageMetadata } from "@/lib/seo/metadata";
import { BlogBreadcrumb } from "@/components/blog/blog-breadcrumb";
import { BlogPostHeroImage } from "@/components/blog/blog-post-hero-image";
import { BlogRelatedPosts } from "@/components/blog/blog-related-posts";
import { BlogTableOfContents } from "@/components/blog/blog-table-of-contents";

export const dynamic = "force-dynamic";

type BlogPageProps = {
  params: Promise<{ slug: string; locale: string }>;
  searchParams: Promise<{
    isLivePreview?: string;
  }>;
};

export const generateMetadata = async ({
  params,
  searchParams,
}: BlogPageProps): Promise<Metadata> => {
  const { slug } = await params;
  const { isLivePreview } = await searchParams;
  const locale = await getLocale();
  const post = await fetchPost({
    slug,
    locale,
    cache: Boolean(isLivePreview),
  });

  if (!post) {
    return { title: "Blog Post Not Found" };
  }

  const metaTitle = post.meta?.title || post.title || "Blog Post";
  const metaDescription = post.meta?.description || post.content?.summary || "";
  const imageRel = post.content?.image?.image;
  const ogImage =
    typeof imageRel === "object" && imageRel !== null
      ? ((imageRel as Media).url ?? undefined)
      : undefined;

  return pageMetadata({
    locale,
    title: metaTitle,
    description: metaDescription,
    internalPath: `/blog/${slug}`,
    ogType: "article",
    publishedTime: post.date || undefined,
    ogImage,
  });
};

const BlogPage: FC<BlogPageProps> = async ({ params, searchParams }) => {
  const { slug } = await params;
  const { isLivePreview } = await searchParams;
  const locale = await getLocale();
  const post = await fetchPost({
    slug,
    locale,
    cache: Boolean(isLivePreview),
  });

  if (!post) {
    notFound();
  }

  const featuredImageRel = post.content?.image?.image;
  const featuredImage: Media | null =
    typeof featuredImageRel === "object" && featuredImageRel !== null
      ? (featuredImageRel as Media)
      : null;

  const publishedDate = post.date
    ? new Date(post.date).toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const categories = post.content?.category;
  const firstCategory: Category | null =
    Array.isArray(categories) && categories.length > 0
      ? typeof categories[0] === "object"
        ? (categories[0] as Category)
        : null
      : null;

  const rawHtml = post.content?.richText_html;
  const headings = typeof rawHtml === "string" ? extractHeadingsFromHtml(rawHtml) : [];
  const processedHtml =
    typeof rawHtml === "string" && rawHtml.length > 0 ? injectHeadingIds(rawHtml) : null;

  const relatedPosts = await fetchRelatedPosts({ slug, locale, limit: 3 });
  const t = await getTranslations({ locale, namespace: "common" });

  const breadcrumbItems = [
    { label: t("home"), href: "/" },
    { label: t("blog"), href: "/blog" },
    { label: post.title || "" },
  ];

  return (
    <>
      <div className="container mx-auto max-w-6xl px-4 pt-28 md:pt-36">
        <BlogBreadcrumb items={breadcrumbItems} />

        <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-10">
          {/* TOC Sidebar */}
          <aside className="hidden lg:block">
            <BlogTableOfContents headings={headings} title={t("onThisPage")} />
          </aside>

          {/* Article */}
          <article className="max-w-3xl min-w-0">
            <div className="mb-4 flex items-center gap-3">
              {firstCategory && (
                <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">
                  {firstCategory.title}
                </span>
              )}
              {publishedDate && (
                <time dateTime={post.date || undefined} className="text-muted-foreground text-sm">
                  {publishedDate}
                </time>
              )}
            </div>

            <h1 className="text-foreground mb-6 text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">
              {post.title}
            </h1>

            {post.content?.summary && (
              <p className="text-muted-foreground mb-8 text-lg leading-relaxed md:text-xl">
                {post.content.summary}
              </p>
            )}

            {featuredImage && (
              <div className="mb-12">
                <BlogPostHeroImage post={post} featuredImage={featuredImage} />
              </div>
            )}

            {processedHtml && (
              <div
                className="prose prose-lg dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-ul:text-muted-foreground prose-ol:text-muted-foreground prose-li:text-muted-foreground prose-img:rounded-2xl mb-16 max-w-none"
                dangerouslySetInnerHTML={{ __html: processedHtml }}
              />
            )}
          </article>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="bg-[#2D2A26] py-16">
          <div className="container mx-auto px-4">
            <BlogRelatedPosts posts={relatedPosts} locale={locale} title={t("recommendedForYou")} />
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="bg-primary/5 py-16 text-center">
        <div className="container mx-auto max-w-2xl px-4">
          <h2 className="text-foreground mb-4 text-2xl font-bold">{t("blogCta.title")}</h2>
          <p className="text-muted-foreground mb-6">{t("blogCta.description")}</p>
          <a
            href="/sign-up"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-block rounded-lg px-6 py-3 font-medium"
          >
            {t("blogCta.buttonText")}
          </a>
        </div>
      </section>
    </>
  );
};

export default BlogPage;
