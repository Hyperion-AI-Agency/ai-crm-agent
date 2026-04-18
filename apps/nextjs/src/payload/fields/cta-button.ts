import type { Field } from "payload";

export function ctaButtonField(
  prefix: string = "cta",
  label: { lt: string; en: string } = { lt: "CTA mygtukas", en: "CTA Button" }
): Field[] {
  return [
    {
      name: `${prefix}Text`,
      label: { lt: `${label.lt} tekstas`, en: `${label.en} Text` },
      type: "text",
      localized: true,
    },
    {
      name: `${prefix}Link`,
      label: { lt: `${label.lt} nuoroda`, en: `${label.en} Link` },
      type: "text",
    },
  ];
}
