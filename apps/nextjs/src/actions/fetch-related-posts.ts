"use server";

import { unstable_cache } from "next/cache";
import { env } from "@/env";
import config from "@payload-config";
import { getPayload } from "payload";

import type { Post } from "@/types/payload-types";

interface FetchRelatedPostsParams {
  slug: string;
  locale: string;
  limit?: number;
}

export async function fetchRelatedPosts({
  slug,
  locale,
  limit = 3,
}: FetchRelatedPostsParams): Promise<Post[]> {
  return unstable_cache(
    async () => {
      const payload = await getPayload({ config });
      const response = await payload.find({
        collection: "posts",
        where: {
          status: {
            equals: "published",
          },
          slug: {
            not_equals: slug,
          },
        },
        locale: locale as "lt" | "en" | "all" | undefined,
        fallbackLocale: env.NEXT_PUBLIC_DEFAULT_LOCALE,
        depth: 2,
        limit,
        sort: "-date",
      });
      return response.docs as Post[];
    },
    [`related-posts-${slug}-${locale}-${limit}`],
    {
      tags: ["posts", "blog"],
      revalidate: 3600,
    }
  )();
}
