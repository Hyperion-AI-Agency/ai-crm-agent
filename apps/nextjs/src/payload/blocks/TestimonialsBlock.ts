import type { Block, CollectionSlug } from "payload";

export const TestimonialsBlock: Block = {
  slug: "testimonials",
  labels: {
    singular: { lt: "Atsiliepimai", en: "Testimonials" },
    plural: { lt: "Atsiliepimų blokai", en: "Testimonials Blocks" },
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
      name: "testimonials",
      label: { lt: "Atsiliepimai", en: "Testimonials" },
      type: "array",
      required: true,
      minRows: 1,
      labels: {
        singular: { lt: "Atsiliepimas", en: "Testimonial" },
        plural: { lt: "Atsiliepimai", en: "Testimonials" },
      },
      fields: [
        {
          name: "quote",
          label: { lt: "Citata", en: "Quote" },
          type: "textarea",
          required: true,
          localized: true,
        },
        {
          name: "authorName",
          label: { lt: "Autoriaus vardas", en: "Author Name" },
          type: "text",
          required: true,
        },
        {
          name: "authorTitle",
          label: { lt: "Autoriaus pareigos", en: "Author Title" },
          type: "text",
          localized: true,
        },
        {
          name: "authorImage",
          label: { lt: "Autoriaus nuotrauka", en: "Author Image" },
          type: "upload",
          relationTo: "media" as CollectionSlug,
        },
      ],
    },
  ],
};
