import { revalidateGlobalSettings } from "@/payload/collections/hooks/revalidateGlobalSettings";
import { userPerms } from "@/payload/utilities/permissions";
import { GlobalConfig } from "payload";

export const GlobalSettings: GlobalConfig = {
  slug: "global-settings",
  admin: {
    group: { lt: "Globalūs", en: "Globals" },
  },
  access: {
    read: () => true,
    update: req => userPerms(req),
  },
  fields: [
    {
      name: "businessName",
      type: "text",
      admin: {
        description:
          "Changes the name in some places, including the copyright information in the footer.",
      },
    },
    {
      name: "domain",
      type: "text",
      admin: {
        description:
          "Sets the base URL of your site. (ex. https://example.com - include https://).",
      },
    },
    {
      name: "googleTagManagerCode",
      type: "text",
      admin: {
        description: "GTM-XXXXXXX",
      },
    },
    {
      name: "contactInfo",
      type: "group",
      label: { en: "Contact Information", lt: "Kontaktine informacija" },
      fields: [
        { name: "email", type: "email" },
        {
          name: "phone",
          type: "text",
          admin: { description: "Phone number, e.g. +15551234567" },
        },
        { name: "address", type: "text", localized: true },
      ],
    },
    {
      name: "socialLinks",
      type: "array",
      label: { en: "Social Links", lt: "Socialiniai tinklai" },
      fields: [
        {
          name: "platform",
          type: "select",
          required: true,
          options: ["facebook", "twitter", "instagram", "linkedin", "youtube", "github", "tiktok"],
        },
        { name: "url", type: "text", required: true },
      ],
    },
    {
      name: "logo",
      type: "group",
      label: { en: "Logo", lt: "Logotipas" },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "light",
              label: { en: "Light Logo", lt: "Sviesus logotipas" },
              type: "upload",
              relationTo: "media",
            },
            {
              name: "dark",
              label: { en: "Dark Logo", lt: "Tamsus logotipas" },
              type: "upload",
              relationTo: "media",
            },
          ],
        },
        {
          name: "alt",
          label: { en: "Alt Text", lt: "Alternatyvus tekstas" },
          type: "text",
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateGlobalSettings],
  },
};

export default GlobalSettings;
