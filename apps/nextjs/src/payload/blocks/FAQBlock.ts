import type { Block } from "payload";

export const FAQBlock: Block = {
  slug: "faq",
  labels: {
    singular: { lt: "DUK", en: "FAQ" },
    plural: { lt: "DUK blokai", en: "FAQ Blocks" },
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
      label: { lt: "Paantraštė", en: "Subtitle" },
      type: "textarea",
      localized: true,
    },
    {
      name: "items",
      label: { lt: "Klausimai", en: "Items" },
      type: "array",
      required: true,
      minRows: 1,
      labels: {
        singular: { lt: "Klausimas", en: "Item" },
        plural: { lt: "Klausimai", en: "Items" },
      },
      fields: [
        {
          name: "question",
          label: { lt: "Klausimas", en: "Question" },
          type: "text",
          required: true,
          localized: true,
        },
        {
          name: "answer",
          label: { lt: "Atsakymas", en: "Answer" },
          type: "textarea",
          required: true,
          localized: true,
        },
      ],
    },
  ],
};
