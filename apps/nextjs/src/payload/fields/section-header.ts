import type { Field } from "payload";

export function sectionHeaderFields(options?: { titleRequired?: boolean }): Field[] {
  const { titleRequired = false } = options ?? {};

  return [
    {
      name: "badge",
      label: { lt: "Žymė", en: "Badge" },
      type: "text",
      localized: true,
      admin: {
        description: {
          lt: "Mažas tekstas virš pavadinimo (pvz. Naujausi straipsniai)",
          en: "Small text above the title (e.g. Latest Posts)",
        },
      },
    },
    {
      name: "title",
      label: { lt: "Pavadinimas", en: "Title" },
      type: "text",
      required: titleRequired,
      localized: true,
    },
    {
      name: "subtitle",
      label: { lt: "Paantraštė", en: "Subtitle" },
      type: "textarea",
      localized: true,
    },
  ];
}
