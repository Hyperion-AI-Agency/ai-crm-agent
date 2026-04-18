import slug from "@/payload/components/slug";
import { userPerms } from "@/payload/utilities/permissions";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { CollectionConfig } from "payload";

export const Categories: CollectionConfig = {
  slug: "categories",
  labels: {
    singular: { lt: "Kategorija", en: "Category" },
    plural: { lt: "Kategorijos", en: "Categories" },
  },
  admin: {
    useAsTitle: "title",
    group: { lt: "Įrašai", en: "Posts" },
  },
  access: {
    read: () => true,
    create: req => userPerms(req),
    update: req => userPerms(req),
    delete: req => userPerms(req),
  },
  fields: [
    {
      name: "title",
      label: { lt: "Pavadinimas", en: "Title" },
      type: "text",
      required: true,
      localized: true,
    },
    slug(),
    {
      type: "tabs",
      tabs: [
        {
          name: "content",
          label: { lt: "Kategorija", en: "Category" },
          fields: [
            {
              name: "description",
              label: { lt: "Aprašymas", en: "Description" },
              type: "richText",
              localized: true,
              editor: lexicalEditor({
                features: ({ defaultFeatures }) => [...defaultFeatures],
              }),
            },
          ],
        },
        {
          label: { lt: "Susiję dokumentai", en: "Related Docs" },
          fields: [
            {
              name: "relatedDocs",
              type: "join",
              on: "content.category",
              collection: "posts",
            },
          ],
        },
      ],
    },
  ],
};
