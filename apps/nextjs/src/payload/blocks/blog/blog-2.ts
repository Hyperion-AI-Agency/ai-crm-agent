import { ctaButtonField } from "@/payload/fields/cta-button";
import { sectionHeaderFields } from "@/payload/fields/section-header";
import type { Block, CollectionSlug } from "payload";

export const Blog2Block: Block = {
  slug: "blog-2",
  labels: {
    singular: { lt: "Tinklaraštis 2 — Tinklelis", en: "Blog 2 — Grid" },
    plural: { lt: "Tinklaraštis 2", en: "Blog 2 Blocks" },
  },
  fields: [
    ...sectionHeaderFields(),
    {
      name: "posts",
      label: { lt: "Įrašai", en: "Posts" },
      type: "relationship",
      relationTo: "posts" as CollectionSlug,
      hasMany: true,
    },
    {
      name: "maxPosts",
      label: { lt: "Maks. įrašų", en: "Max Posts" },
      type: "number",
      defaultValue: 3,
      admin: { position: "sidebar" },
    },
    ...ctaButtonField("viewAll", { lt: "Žiūrėti visus", en: "View All" }),
  ],
};
