import type { Block } from "payload";

export const CTABlock: Block = {
  slug: "cta",
  labels: {
    singular: { lt: "Kvietimas veikti", en: "Call to Action" },
    plural: { lt: "CTA blokai", en: "Call to Action Blocks" },
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
      name: "description",
      label: { lt: "Aprašymas", en: "Description" },
      type: "textarea",
      localized: true,
    },
    {
      name: "buttonText",
      label: { lt: "Mygtuko tekstas", en: "Button Text" },
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "buttonLink",
      label: { lt: "Mygtuko nuoroda", en: "Button Link" },
      type: "text",
      required: true,
    },
    {
      name: "secondaryButtonText",
      label: { lt: "Antrinio mygtuko tekstas", en: "Secondary Button Text" },
      type: "text",
      localized: true,
    },
    {
      name: "secondaryButtonLink",
      label: { lt: "Antrinio mygtuko nuoroda", en: "Secondary Button Link" },
      type: "text",
    },
    {
      name: "backgroundColor",
      label: { lt: "Fono spalva", en: "Background Color" },
      type: "select",
      defaultValue: "default",
      options: [
        {
          label: { lt: "Numatytoji", en: "Default" },
          value: "default",
        },
        {
          label: { lt: "Pagrindinė", en: "Primary" },
          value: "primary",
        },
        {
          label: { lt: "Antrinė", en: "Secondary" },
          value: "secondary",
        },
      ],
    },
  ],
};
