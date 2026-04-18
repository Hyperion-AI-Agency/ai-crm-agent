"use server";

import config from "@payload-config";
import { getLocale } from "next-intl/server";
import type { CollectionSlug, TypedLocale } from "payload";
import { getPayload } from "payload";

import type { PageTemplate } from "@/types/page-template";

const SLUG = "page-templates" as CollectionSlug;

export async function fetchPageTemplate(nameOrId: string): Promise<PageTemplate | null> {
  const payload = await getPayload({ config });
  const locale = (await getLocale()) as TypedLocale;

  const byName = await payload.find({
    collection: SLUG,
    where: { name: { equals: nameOrId } },
    depth: 2,
    limit: 1,
    locale,
  });
  if (byName.docs[0]) return byName.docs[0] as PageTemplate;

  try {
    const byId = await payload.findByID({ collection: SLUG, id: nameOrId, depth: 2, locale });
    return (byId as PageTemplate) ?? null;
  } catch {
    return null;
  }
}
