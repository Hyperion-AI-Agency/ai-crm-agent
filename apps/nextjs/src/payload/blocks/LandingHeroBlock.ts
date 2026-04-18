import type { Block } from "payload";

export const LandingHeroBlock: Block = {
  slug: "landing-hero",
  labels: {
    singular: { lt: "Pagrindinis skyrius", en: "Landing Hero" },
    plural: { lt: "Pagrindiniai skyriai", en: "Landing Hero Blocks" },
  },
  fields: [
    { name: "badge", type: "text", localized: true },
    { name: "title", type: "text", required: true, localized: true },
    { name: "subtitle", type: "textarea", localized: true },
    { name: "ctaText", type: "text", localized: true },
    { name: "ctaLink", type: "text" },
  ],
};
