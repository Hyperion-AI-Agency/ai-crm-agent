import { ctaButtonField } from "@/payload/fields/cta-button";
import { sectionHeaderFields } from "@/payload/fields/section-header";
import type { Block, CollectionSlug } from "payload";

export const Blog4Block: Block = {
  slug: "blog-4",
  labels: {
    singular: { lt: "Tinklaraštis 4 — Horizontalios kortelės", en: "Blog 4 — Horizontal Cards" },
    plural: { lt: "Tinklaraštis 4", en: "Blog 4 Blocks" },
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
