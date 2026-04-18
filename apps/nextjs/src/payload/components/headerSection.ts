import deepMerge from "@/payload/utilities/deepMerge";
import { Field } from "payload";

type HeaderSection = (overrides?: Partial<Field>) => Field;
const headerSection: HeaderSection = overrides =>
  deepMerge<Field, Partial<Field>>(
    {
      name: "headerSection",
      type: "group",
      label: { lt: "Antraštės sekcija", en: "Header Section" },
      fields: [
        {
          name: "headerText",
          label: { lt: "Antraštės tekstas", en: "Header Text" },
          type: "text",
        },
        {
          name: "headerLevel",
          label: { lt: "Antraštės lygis", en: "Header Level" },
          type: "select",
          options: ["h2", "h3", "h4", "h5", "h6"],
          defaultValue: "h2",
          admin: {
            isClearable: false,
          },
        },
        {
          name: "anchor",
          label: { lt: "Žymė", en: "Anchor" },
          type: "text",
        },
      ],
      interfaceName: "HeaderSectionProps",
    },
    overrides
  );

export default headerSection;
