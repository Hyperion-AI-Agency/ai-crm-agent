import { userPerms } from "@/payload/utilities/permissions";
import { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  labels: {
    singular: { lt: "Medija", en: "Media" },
    plural: { lt: "Medija", en: "Media" },
  },
  access: {
    read: () => true,
    create: req => userPerms(req),
    update: req => userPerms(req),
    delete: req => userPerms(req),
  },
  upload: {
    staticDir: "media",
    formatOptions: {
      format: "webp",
    },
    mimeTypes: ["image/png", "image/jpg", "image/jpeg", "image/gif", "image/webp", "image/svg+xml"],
    adminThumbnail: ({ doc }) => `${process.env.R2_SERVER}/${(doc as any).filename}`,
  },
  admin: {
    useAsTitle: "title",
    group: { lt: "Turinys", en: "Content" },
    enableRichTextRelationship: true,
    defaultColumns: ["fileName", "altDescription", "thumbnailUrl", "title"],
  },

  fields: [
    {
      name: "title",
      label: { lt: "Pavadinimas", en: "Title" },
      type: "text",
    },
    {
      name: "altDescription",
      label: { lt: "Alternatyvus aprašymas", en: "Alt Description" },
      type: "text",
      maxLength: 150,
      admin: {
        components: {
          Description: undefined as any,
        },
      },
    },
    {
      name: "credit",
      label: { lt: "Autorinės teisės", en: "Credit" },
      type: "group",
      fields: [
        {
          name: "creator",
          label: { lt: "Autorius", en: "Creator" },
          type: "text",
          admin: {
            description: "Leave a name for who or what created or captured this image.",
          },
        },
        {
          name: "creatorType",
          label: { lt: "Autoriaus tipas", en: "Creator Type" },
          type: "select",
          options: [
            { value: "Person", label: { lt: "Asmuo", en: "Person" } },
            { value: "Organization", label: { lt: "Organizacija", en: "Organization" } },
          ],
          admin: {
            description: "Choose if the creator is an organization or a person.",
          },
        },
        {
          name: "creatorLink",
          label: { lt: "Autoriaus nuoroda", en: "Creator Link" },
          type: "text",
          admin: {
            description: `Link to the creator's website`,
          },
        },
      ],
    },
  ],
};
