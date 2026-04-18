import type { Block, CollectionSlug } from "payload";

export const HeroBlock: Block = {
  slug: "hero",
  labels: {
    singular: { lt: "Heroinis skyrius", en: "Hero" },
    plural: { lt: "Heroiniai skyriai", en: "Hero Blocks" },
  },
  fields: [
    {
      name: "title",
      label: { lt: "Pavadinimas", en: "Title" },
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "subtitle",
      label: { lt: "Paantraštė", en: "Subtitle" },
      type: "textarea",
      localized: true,
    },
    {
      name: "description",
      label: { lt: "Aprašymas", en: "Description" },
      type: "richText",
      localized: true,
    },
    {
      name: "backgroundImage",
      label: { lt: "Fono paveikslėlis", en: "Background Image" },
      type: "upload",
      relationTo: "media" as CollectionSlug,
    },
    {
      name: "ctaText",
      label: { lt: "CTA mygtuko tekstas", en: "CTA Text" },
      type: "text",
      localized: true,
    },
    {
      name: "ctaLink",
      label: { lt: "CTA nuoroda", en: "CTA Link" },
      type: "text",
    },
    {
      name: "secondaryCtaText",
      label: { lt: "Antrinio CTA tekstas", en: "Secondary CTA Text" },
      type: "text",
      localized: true,
    },
    {
      name: "secondaryCtaLink",
      label: { lt: "Antrinio CTA nuoroda", en: "Secondary CTA Link" },
      type: "text",
    },
  ],
};
