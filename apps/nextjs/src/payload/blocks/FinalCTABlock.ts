import type { Block } from "payload";

export const FinalCTABlock: Block = {
  slug: "final-cta",
  labels: {
    singular: { lt: "Galutinis CTA", en: "Final CTA" },
    plural: { lt: "Galutiniai CTA blokai", en: "Final CTA Blocks" },
  },
  fields: [
    { name: "title", type: "text", required: true, localized: true },
    { name: "description", type: "textarea", localized: true },
    { name: "buttonText", type: "text", required: true, localized: true },
    { name: "buttonLink", type: "text", required: true },
    {
      name: "variant",
      type: "select",
      defaultValue: "card",
      options: [
        { label: "Card", value: "card" },
        { label: "Full Width", value: "full" },
      ],
    },
  ],
};
