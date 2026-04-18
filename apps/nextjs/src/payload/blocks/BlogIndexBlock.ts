import type { Block } from "payload";

export const BlogIndexBlock: Block = {
  slug: "blog-index",
  labels: {
    singular: { lt: "Tinklarascio rodykle", en: "Blog Index" },
    plural: { lt: "Tinklarascio rodykles", en: "Blog Indexes" },
  },
  fields: [
    {
      name: "title",
      label: { lt: "Pavadinimas", en: "Title" },
      type: "text",
      localized: true,
    },
    {
      name: "subtitle",
      label: { lt: "Paantraste", en: "Subtitle" },
      type: "text",
      localized: true,
    },
    {
      name: "postsPerPage",
      label: { lt: "Irasu per puslapi", en: "Posts per page" },
      type: "number",
      defaultValue: 9,
    },
  ],
};
