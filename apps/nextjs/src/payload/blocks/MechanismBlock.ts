import type { Block } from "payload";

export const MechanismBlock: Block = {
  slug: "mechanism",
  labels: {
    singular: { lt: "Kaip veikia", en: "How It Works" },
    plural: { lt: "Kaip veikia blokai", en: "How It Works Blocks" },
  },
  fields: [
    { name: "title", type: "text", localized: true },
    { name: "description", type: "textarea", localized: true },
    {
      name: "steps",
      type: "array",
      labels: {
        singular: { lt: "Žingsnis", en: "Step" },
        plural: { lt: "Žingsniai", en: "Steps" },
      },
      fields: [
        { name: "title", type: "text", required: true, localized: true },
        { name: "description", type: "textarea", required: true, localized: true },
      ],
    },
    { name: "ctaText", type: "text", localized: true },
    { name: "ctaLink", type: "text" },
  ],
};
