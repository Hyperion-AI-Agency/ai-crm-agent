import { ctaButtonField } from "@/payload/fields/cta-button";
import { sectionHeaderFields } from "@/payload/fields/section-header";
import type { Block, CollectionSlug } from "payload";

export const Blog7Block: Block = {
  slug: "blog-7",
  labels: {
    singular: { lt: "Tinklaraštis 7 — Tamsus tinklelis", en: "Blog 7 — Dark Grid" },
    plural: { lt: "Tinklaraštis 7", en: "Blog 7 Blocks" },
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
