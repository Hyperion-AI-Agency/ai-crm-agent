import { HTMLConverterFeature, lexicalEditor, lexicalHTML } from "@payloadcms/richtext-lexical";
import type { Block } from "payload";

export const TextBlock: Block = {
  slug: "text",
  labels: {
    singular: { lt: "Tekstas", en: "Text" },
    plural: { lt: "Teksto blokai", en: "Text Blocks" },
  },
  fields: [
    {
      name: "content",
      label: { lt: "Turinys", en: "Content" },
      type: "richText",
      required: true,
      localized: true,
      editor: lexicalEditor({ features: [HTMLConverterFeature()] }),
    },
    lexicalHTML("content", { name: "content_html" }),
    {
      name: "alignment",
      label: { lt: "Lygiavimas", en: "Alignment" },
      type: "select",
      defaultValue: "left",
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
      ],
    },
  ],
};
