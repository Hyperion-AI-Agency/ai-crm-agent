import type { Block, CollectionSlug } from "payload";

export const ImageBlock: Block = {
  slug: "image",
  labels: {
    singular: { lt: "Paveikslėlis", en: "Image" },
    plural: { lt: "Paveikslėlių blokai", en: "Image Blocks" },
  },
  fields: [
    {
      name: "image",
      label: { lt: "Paveikslėlis", en: "Image" },
      type: "upload",
      relationTo: "media" as CollectionSlug,
      required: true,
    },
    {
      name: "caption",
      label: { lt: "Aprašas", en: "Caption" },
      type: "text",
      localized: true,
    },
    {
      name: "alignment",
      label: { lt: "Lygiavimas", en: "Alignment" },
      type: "select",
      defaultValue: "center",
      options: [
        {
          label: { lt: "Kairė", en: "Left" },
          value: "left",
        },
        {
          label: { lt: "Centras", en: "Center" },
          value: "center",
        },
        {
          label: { lt: "Dešinė", en: "Right" },
          value: "right",
        },
        {
          label: { lt: "Visas plotis", en: "Full Width" },
          value: "full",
        },
      ],
    },
  ],
};
