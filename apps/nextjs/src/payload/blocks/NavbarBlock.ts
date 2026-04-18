import type { Block } from "payload";

export const NavbarBlock: Block = {
  slug: "navbar",
  labels: {
    singular: { lt: "Navigacija", en: "Navbar" },
    plural: { lt: "Navigacijos", en: "Navbars" },
  },
  fields: [
    {
      name: "links",
      type: "array",
      label: { en: "Navigation Links", lt: "Navigacijos nuorodos" },
      fields: [
        { name: "label", type: "text", required: true, localized: true },
        { name: "url", type: "text", required: true },
        { name: "openInNewTab", type: "checkbox", defaultValue: false },
      ],
    },
    {
      name: "ctaLabel",
      type: "text",
      label: { en: "CTA Button Label", lt: "CTA mygtuko tekstas" },
      localized: true,
    },
    {
      name: "ctaUrl",
      type: "text",
      label: { en: "CTA Button URL", lt: "CTA mygtuko nuoroda" },
    },
  ],
};
