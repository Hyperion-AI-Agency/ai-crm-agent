import type { Block } from "payload";

export const WhatIsBlock: Block = {
  slug: "what-is",
  labels: {
    singular: { lt: "Kam skirta", en: "What Is" },
    plural: { lt: "Kam skirta blokai", en: "What Is Blocks" },
  },
  fields: [
    { name: "title", type: "text", localized: true },
    { name: "description", type: "textarea", localized: true },
    {
      name: "cards",
      type: "array",
      labels: {
        singular: { lt: "Kortelė", en: "Card" },
        plural: { lt: "Kortelės", en: "Cards" },
      },
      fields: [
        { name: "badge", type: "text", localized: true },
        { name: "title", type: "text", localized: true },
        { name: "titleHighlight", type: "text", localized: true },
        { name: "description", type: "textarea", localized: true },
        {
          name: "benefits",
          type: "array",
          labels: {
            singular: { lt: "Nauda", en: "Benefit" },
            plural: { lt: "Naudos", en: "Benefits" },
          },
          fields: [
            { name: "title", type: "text", required: true, localized: true },
            { name: "description", type: "textarea", localized: true },
          ],
        },
      ],
    },
  ],
};
