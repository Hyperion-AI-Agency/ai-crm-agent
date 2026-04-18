import type { Block } from "payload";

export const BlogSectionBlock: Block = {
  slug: "blog-section",
  labels: {
    singular: { lt: "Tinklaraščio skyrius", en: "Blog Section" },
    plural: { lt: "Tinklaraščio skyriai", en: "Blog Section Blocks" },
  },
  fields: [
    { name: "title", type: "text", localized: true },
    { name: "subtitle", type: "textarea", localized: true },
    { name: "ctaText", type: "text", localized: true },
    {
      name: "postsLimit",
      type: "number",
      defaultValue: 3,
      admin: { description: "Number of recent posts to show" },
    },
  ],
};
