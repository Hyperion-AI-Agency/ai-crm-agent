"use server";

import { unstable_cache } from "next/cache";
import { env } from "@/env";
import config from "@payload-config";
import { getPayload } from "payload";

import type { Post } from "@/types/payload-types";

interface FetchPostParams {
  slug: string;
  locale: string;
  cache?: boolean;
}

export async function fetchPost({ slug, locale, cache = false }: FetchPostParams) {
  // Don't cache live previews
  if (!cache) {
    const payload = await getPayload({ config });
    const response = await payload.find({
      collection: "posts",
      draft: true,
      where: {
        slug: {
          equals: slug,
        },
      },
      locale: locale as "lt" | "en" | "all" | undefined,
      fallbackLocale: env.NEXT_PUBLIC_DEFAULT_LOCALE,
      depth: 2,
      limit: 1,
    });
    return response.docs[0] as Post | undefined;
  }

  return unstable_cache(
    async () => {
      const payload = await getPayload({ config });
      const response = await payload.find({
        collection: "posts",
        where: {
          slug: {
            equals: slug,
          },
          status: {
            equals: "published",
          },
        },
        locale: locale as "lt" | "en" | "all" | undefined,
        fallbackLocale: env.NEXT_PUBLIC_DEFAULT_LOCALE,
        depth: 2,
        limit: 1,
      });
      return response.docs[0] as Post | undefined;
    },
    [`post-${slug}-${locale}`],
    {
      tags: ["posts", "blog", `post-${slug}`],
      revalidate: 3600,
    }
  )();
}
