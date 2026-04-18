"use server";

import { env } from "@/env";
import config from "@payload-config";
import { getPayload } from "payload";

export async function fetchPage({
  slug,
  locale,
  draft = false,
}: {
  slug: string;
  locale: string;
  draft?: boolean;
}) {
  const payload = await getPayload({ config });
  const response = await payload.find({
    collection: "pages",
    ...(draft ? { draft: true } : {}),
    where: {
      slug: { equals: slug },
      ...(draft ? {} : { status: { equals: "published" } }),
    },
    locale: locale as "lt" | "en" | "all" | undefined,
    fallbackLocale: env.NEXT_PUBLIC_DEFAULT_LOCALE,
    depth: 2,
    limit: 1,
  });
  return response.docs[0] ?? null;
}
