import Image from "next/image";

import type { Media, Post } from "@/types/payload-types";

interface BlogPostHeroImageProps {
  post: Post;
  featuredImage: Media | null;
}

export function BlogPostHeroImage({ post, featuredImage }: BlogPostHeroImageProps) {
  // Only render if there's an actual featured image
  if (!featuredImage || !featuredImage.url) {
    return null;
  }

  return (
    <div className="relative mb-12 aspect-video w-full overflow-hidden rounded-2xl">
      <Image
        src={featuredImage.url}
        alt={featuredImage.altDescription ?? post.title}
        fill
        className="object-cover"
        priority
      />
    </div>
  );
}
