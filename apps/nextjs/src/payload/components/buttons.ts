import deepMerge from "@/payload/utilities/deepMerge";
import { Field } from "payload";

type Button = (overrides?: Partial<Field>) => Field;
const buttons: Button = overrides =>
  deepMerge<Field, Partial<Field>>(
    {
      name: "buttons",
      interfaceName: "Button",
      type: "array",
      label: { lt: "CTA mygtukai", en: "CTA buttons" },
      admin: {
        initCollapsed: true,
      },
      maxRows: 2,
      labels: {
        singular: { lt: "Mygtukas", en: "Button" },
        plural: { lt: "Mygtukai", en: "Buttons" },
      },
      fields: [
        {
          name: "title",
          label: { lt: "Pavadinimas", en: "Title" },
          type: "text",
        },
        {
          name: "linkType",
          label: { lt: "Nuorodos tipas", en: "Link Type" },
          type: "radio",
          options: [
            { label: { lt: "Išorinė", en: "External" }, value: "External" },
            { label: { lt: "Vidinė", en: "Internal" }, value: "Internal" },
          ],
          defaultValue: "External",
        },
        {
          name: "link",
          label: { lt: "Nuoroda", en: "Link" },
          type: "text",
          admin: {
            condition: (data, siblingData) => {
              if ((siblingData as any).linkType === "External") {
                return true;
              } else {
                return false;
              }
            },
          },
        },
        {
          name: "internalLink",
          label: { lt: "Vidinė nuoroda", en: "Internal Link" },
          type: "relationship",
          relationTo: ["posts"],
          admin: {
            condition: (data, siblingData) => {
              if ((siblingData as any).linkType === "Internal") {
                return true;
              } else {
                return false;
              }
            },
          },
        },
        {
          name: "openInNewTab",
          label: { lt: "Atidaryti naujame lange", en: "Open in New Tab" },
          type: "checkbox",
          defaultValue: false,
          admin: {
            description: "Should this open in a new browser window/tab?",
          },
        },
        {
          name: "isPrimary",
          label: { lt: "Pagrindinis mygtukas", en: "Is Primary" },
          type: "checkbox",
        },
      ],
    },
    overrides
  );

export default buttons;
