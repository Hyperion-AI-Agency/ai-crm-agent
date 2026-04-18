import type { Block } from "payload";

export const PricingBlock: Block = {
  slug: "pricing",
  labels: {
    singular: { lt: "Kainos", en: "Pricing" },
    plural: { lt: "Kainų blokai", en: "Pricing Blocks" },
  },
  fields: [
    { name: "title", type: "text", localized: true },
    { name: "subtitle", type: "textarea", localized: true },
  ],
};
