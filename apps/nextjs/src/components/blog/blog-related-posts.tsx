import Image from "next/image";
import Link from "next/link";

import type { Category, Media, Post } from "@/types/payload-types";

interface BlogRelatedPostsProps {
  posts: Post[];
  locale: string;
  title: string;
}

export function BlogRelatedPosts({ posts, locale, title }: BlogRelatedPostsProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="mb-10 text-2xl font-bold tracking-tight text-[#F5F5F3] md:text-3xl">
        {title}
      </h2>
      <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map(relatedPost => {
          const relatedImageRel = relatedPost.content?.image?.image;
          const relatedImage: Media | null =
            typeof relatedImageRel === "object" && relatedImageRel !== null
              ? (relatedImageRel as Media)
              : null;

          const categories = relatedPost.content?.category;
          const firstCategory: Category | null =
            Array.isArray(categories) && categories.length > 0
              ? typeof categories[0] === "object"
                ? (categories[0] as Category)
                : null
              : null;

          return (
            <Link
              key={relatedPost.id}
              href={`/blog/${relatedPost.slug}`}
              className="group flex flex-col"
            >
              <div className="relative mb-4 aspect-[3/2] w-full overflow-hidden rounded-2xl bg-white/10">
                {relatedImage ? (
                  <Image
                    src={relatedImage.url ?? ""}
                    alt={relatedImage.altDescription ?? relatedPost.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-5xl font-bold text-white/20 select-none">
                      {relatedPost.title.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              {firstCategory && (
                <p className="mb-2 text-sm text-[#F5F5F3]/50">{firstCategory.title}</p>
              )}
              <h3 className="mb-2 text-lg font-bold text-[#F5F5F3] transition-colors group-hover:text-[#F5F5F3]/80">
                {relatedPost.title}
              </h3>
              {relatedPost.content?.summary && (
                <p className="line-clamp-3 text-sm leading-relaxed text-[#F5F5F3]/60">
                  {relatedPost.content.summary}
                </p>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
