import deepMerge from "@/payload/utilities/deepMerge";
import formatSlug from "@/payload/utilities/formatSlug";
import { Field } from "payload";

type Slug = (fieldToUse?: string, overrides?: Partial<Field>) => Field;

const slug: Slug = (fieldToUse = "title", overrides) =>
  deepMerge<Field, Partial<Field>>({
    name: "slug",
    label: { lt: "Nuorodos fragmentas", en: "Slug" },
    type: "text",
    unique: true,
    admin: {
      position: "sidebar",
    },
    hooks: {
      beforeValidate: [formatSlug(fieldToUse)],
    },
  });

export default slug;
