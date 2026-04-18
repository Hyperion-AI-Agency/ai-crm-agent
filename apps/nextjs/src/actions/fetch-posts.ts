"use server";

import { unstable_cache } from "next/cache";
import { env } from "@/env";
import config from "@payload-config";
import { getPayload } from "payload";

import type { Post } from "@/types/payload-types";

interface FetchPostsParams {
  locale: string;
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sort?: string;
}

export async function fetchPosts({
  locale,
  page = 1,
  limit = 12,
  category,
  search,
  sort = "-date",
}: FetchPostsParams) {
  return unstable_cache(
    async () => {
      const payload = await getPayload({ config });

      const where: any = {
        status: {
          equals: "published",
        },
      };

      if (category) {
        const categoryResult = await payload.find({
          collection: "categories",
          where: { slug: { equals: category } },
          limit: 1,
          select: {},
        });
        if (categoryResult.docs.length > 0) {
          where["content.category"] = {
            in: [categoryResult.docs[0].id],
          };
        }
      }

      if (search) {
        where.or = [
          {
            title: {
              contains: search,
            },
          },
          {
            "content.description": {
              contains: search,
            },
          },
        ];
      }

      const posts = await payload.find({
        collection: "posts",
        where,
        locale: locale as "lt" | "en" | "all" | undefined,
        fallbackLocale: env.NEXT_PUBLIC_DEFAULT_LOCALE,
        depth: 3, // Increased depth to ensure media relationships are fully populated
        limit,
        page,
        sort,
      });

      return posts;
    },
    [`posts-${locale}-${page}-${limit}-${category || ""}-${search || ""}-${sort}`],
    {
      tags: ["posts", "blog"],
      revalidate: 3600,
    }
  )();
}
