import type { Block } from "payload";

export const StatsBlock: Block = {
  slug: "stats",
  labels: {
    singular: { lt: "Statistika", en: "Stats / Metrics" },
    plural: { lt: "Statistikos blokai", en: "Stats Blocks" },
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
      name: "stats",
      label: { lt: "Statistika", en: "Stats" },
      type: "array",
      required: true,
      minRows: 1,
      labels: {
        singular: { lt: "Rodiklis", en: "Stat" },
        plural: { lt: "Rodikliai", en: "Stats" },
      },
      fields: [
        {
          name: "value",
          label: { lt: "Reikšmė", en: "Value" },
          type: "text",
          required: true,
          admin: {
            description: "The metric value (e.g., '3M+', '99%', '500+')",
          },
        },
        {
          name: "label",
          label: { lt: "Etiketė", en: "Label" },
          type: "text",
          required: true,
          localized: true,
          admin: {
            description: "Description of the metric",
          },
        },
      ],
    },
    {
      name: "backgroundColor",
      label: { lt: "Fono spalva", en: "Background Color" },
      type: "select",
      defaultValue: "default",
      options: [
        { label: { lt: "Numatytoji", en: "Default" }, value: "default" },
        { label: { lt: "Pagrindinė", en: "Primary" }, value: "primary" },
        { label: { lt: "Antrinė", en: "Secondary" }, value: "secondary" },
      ],
    },
  ],
};
