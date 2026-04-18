import type { Block, CollectionSlug } from "payload";

export const FeaturesBlock: Block = {
  slug: "features",
  labels: {
    singular: { lt: "Funkcijos", en: "Features" },
    plural: { lt: "Funkcijų blokai", en: "Features Blocks" },
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
      name: "features",
      label: { lt: "Funkcijos", en: "Features" },
      type: "array",
      required: true,
      minRows: 1,
      labels: {
        singular: { lt: "Funkcija", en: "Feature" },
        plural: { lt: "Funkcijos", en: "Features" },
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
          name: "icon",
          label: { lt: "Ikona", en: "Icon" },
          type: "upload",
          relationTo: "media" as CollectionSlug,
        },
      ],
    },
    {
      name: "columns",
      label: { lt: "Stulpeliai", en: "Columns" },
      type: "select",
      defaultValue: "3",
      options: [
        {
          label: { lt: "2 stulpeliai", en: "2 Columns" },
          value: "2",
        },
        {
          label: { lt: "3 stulpeliai", en: "3 Columns" },
          value: "3",
        },
        {
          label: { lt: "4 stulpeliai", en: "4 Columns" },
          value: "4",
        },
      ],
    },
  ],
};
