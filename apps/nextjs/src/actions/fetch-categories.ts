"use server";

import { unstable_cache } from "next/cache";
import { env } from "@/env";
import config from "@payload-config";
import { getPayload } from "payload";

import type { Category } from "@/types/payload-types";

export async function fetchCategories(locale: string) {
  return unstable_cache(
    async () => {
      const payload = await getPayload({ config });
      const categories = await payload.find({
        collection: "categories",
        locale: locale as "lt" | "en" | "all" | undefined,
        fallbackLocale: env.NEXT_PUBLIC_DEFAULT_LOCALE,
        depth: 1,
        limit: 100,
        sort: "title",
      });
      return categories.docs as Category[];
    },
    [`categories-${locale}`],
    {
      tags: ["categories", "blog"],
      revalidate: 3600,
    }
  )();
}
