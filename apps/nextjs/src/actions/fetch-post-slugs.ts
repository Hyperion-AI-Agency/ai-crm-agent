"use server";

import { unstable_cache } from "next/cache";
import { env } from "@/env";
import config from "@payload-config";
import { getPayload } from "payload";

interface FetchPostSlugsParams {
  locale?: string;
}

export async function fetchPostSlugs({ locale }: FetchPostSlugsParams = {}) {
  const loc = locale ?? env.NEXT_PUBLIC_DEFAULT_LOCALE;
  return unstable_cache(
    async () => {
      const payload = await getPayload({ config });
      const response = await payload.find({
        collection: "posts",
        where: {
          status: {
            equals: "published",
          },
        },
        locale: loc as "lt" | "en" | "all" | undefined,
        limit: 1000,
        select: {
          slug: true,
        },
      });
      return response.docs.map(post => (typeof post.slug === "string" ? post.slug : ""));
    },
    [`all-posts-slugs-${loc}`],
    {
      tags: ["posts", "blog"],
      revalidate: 3600,
    }
  )();
}
