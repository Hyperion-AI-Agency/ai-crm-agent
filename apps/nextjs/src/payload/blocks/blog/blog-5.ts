import { ctaButtonField } from "@/payload/fields/cta-button";
import { sectionHeaderFields } from "@/payload/fields/section-header";
import type { Block, CollectionSlug } from "payload";

export const Blog5Block: Block = {
  slug: "blog-5",
  labels: {
    singular: { lt: "Tinklaraštis 5 — Minimalus sąrašas", en: "Blog 5 — Minimal List" },
    plural: { lt: "Tinklaraštis 5", en: "Blog 5 Blocks" },
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
      defaultValue: 5,
      admin: { position: "sidebar" },
    },
    ...ctaButtonField("viewAll", { lt: "Žiūrėti visus", en: "View All" }),
  ],
};
