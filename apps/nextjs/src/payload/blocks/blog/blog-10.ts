import { ctaButtonField } from "@/payload/fields/cta-button";
import { sectionHeaderFields } from "@/payload/fields/section-header";
import type { Block, CollectionSlug } from "payload";

export const Blog10Block: Block = {
  slug: "blog-10",
  labels: {
    singular: { lt: "Tinklaraštis 10 — Tinklelis su efektais", en: "Blog 10 — Grid with Hover" },
    plural: { lt: "Tinklaraštis 10", en: "Blog 10 Blocks" },
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
