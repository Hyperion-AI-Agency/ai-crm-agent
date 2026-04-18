import Image from "next/image";
import Link from "next/link";

import type { Category, Media, Post } from "@/types/payload-types";
import type { Locale } from "@/lib/i18n/routing";

interface BlogPostCardProps {
  post: Post;
  locale: Locale;
}

export function BlogPostCard({ post, locale }: BlogPostCardProps) {
  const featuredRel = post.content?.image?.image;
  const featuredImage: Media | null =
    typeof featuredRel === "object" && featuredRel !== null ? (featuredRel as Media) : null;
  const excerpt = post.content?.summary || post.content?.description || "";

  const categories = post.content?.category;
  const firstCategory: Category | null =
    Array.isArray(categories) && categories.length > 0
      ? typeof categories[0] === "object"
        ? (categories[0] as Category)
        : null
      : null;

  return (
    <Link href={`/blog/${post.slug}`} className="group flex flex-col">
      {/* Featured Image */}
      <div className="bg-muted relative mb-4 aspect-[3/2] w-full overflow-hidden rounded-2xl">
        {featuredImage ? (
          <Image
            src={featuredImage.url || ""}
            alt={featuredImage.altDescription ?? post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="from-muted to-muted/50 flex h-full w-full items-center justify-center bg-gradient-to-br">
            <span className="text-muted-foreground/30 text-5xl font-bold select-none">
              {post.title.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Category */}
      {firstCategory && <p className="text-muted-foreground mb-2 text-sm">{firstCategory.title}</p>}

      {/* Title */}
      <h2 className="text-foreground group-hover:text-primary mb-2 text-lg font-bold transition-colors md:text-xl">
        {post.title}
      </h2>

      {/* Excerpt */}
      {excerpt && (
        <p className="text-muted-foreground line-clamp-3 flex-1 text-sm leading-relaxed">
          {excerpt}
        </p>
      )}
    </Link>
  );
}
