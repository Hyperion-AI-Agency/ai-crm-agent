import type { Block } from "payload";

export const SiteFooterBlock: Block = {
  slug: "site-footer",
  labels: {
    singular: { lt: "Svetaines poraste", en: "Site Footer" },
    plural: { lt: "Svetaines porastes", en: "Site Footers" },
  },
  fields: [
    {
      name: "sections",
      type: "array",
      label: { en: "Link Sections", lt: "Nuorodų sekcijos" },
      fields: [
        {
          name: "title",
          type: "text",
          required: true,
          localized: true,
          label: { en: "Section Title", lt: "Sekcijos pavadinimas" },
        },
        {
          name: "links",
          type: "array",
          fields: [
            { name: "label", type: "text", required: true, localized: true },
            { name: "url", type: "text", required: true },
            { name: "openInNewTab", type: "checkbox", defaultValue: false },
          ],
        },
      ],
    },
  ],
};
