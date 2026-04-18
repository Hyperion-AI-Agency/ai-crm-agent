import { userPerms } from "@/payload/utilities/permissions";
import type { GlobalConfig } from "payload";

export const Plans: GlobalConfig = {
  slug: "plans",
  label: { lt: "Planai", en: "Plans" },
  access: {
    read: () => true, // Public read access
  },
  admin: {
    group: { lt: "Globalūs", en: "Globals" },
    description: "Manage pricing plans displayed on the landing page and paywall",
  },
  fields: [
    {
      name: "plans",
      type: "array",
      label: { lt: "Kainodaros planai", en: "Pricing Plans" },
      minRows: 1,
      labels: {
        singular: { lt: "Planas", en: "Plan" },
        plural: { lt: "Planai", en: "Plans" },
      },
      fields: [
        {
          name: "key",
          label: { lt: "Raktas", en: "Key" },
          type: "text",
          required: true,
          unique: true,
          admin: {
            description: "Internal identifier (e.g., 'quick-scan', 'team-fit')",
          },
        },
        {
          name: "name",
          label: { lt: "Pavadinimas", en: "Name" },
          type: "text",
          required: true,
          localized: true,
          admin: {
            description: "Plan name (e.g., 'Starter', 'Pro')",
          },
        },
        {
          name: "description",
          label: { lt: "Aprašymas", en: "Description" },
          type: "textarea",
          required: true,
          localized: true,
          admin: {
            description: "Plan description",
          },
        },
        {
          name: "price",
          label: { lt: "Kaina", en: "Price" },
          type: "number",
          required: true,
          admin: {
            description: "Price in euros (e.g., 29 for €29)",
            step: 1,
          },
        },
        {
          name: "cta",
          label: { lt: "CTA mygtuko tekstas", en: "CTA Text" },
          type: "text",
          required: true,
          localized: true,
          defaultValue: "Get Started",
          admin: {
            description: "Call-to-action button text",
          },
        },
        {
          name: "features",
          label: { lt: "Funkcijos", en: "Features" },
          type: "array",
          required: true,
          localized: true,
          minRows: 1,
          labels: {
            singular: { lt: "Funkcija", en: "Feature" },
            plural: { lt: "Funkcijos", en: "Features" },
          },
          fields: [
            {
              name: "feature",
              label: { lt: "Funkcija", en: "Feature" },
              type: "text",
              required: true,
            },
          ],
          admin: {
            description: "List of features included in this plan",
          },
        },
        {
          name: "productKey",
          label: { lt: "Produkto raktas", en: "Product Key" },
          type: "text",
          required: true,
          admin: {
            description:
              "Polar.sh product ID (UUID) for checkout integration and subscription matching",
          },
        },
        {
          name: "isActive",
          label: { lt: "Aktyvus", en: "Is Active" },
          type: "checkbox",
          defaultValue: true,
          admin: {
            description: "Whether this plan is currently available",
          },
        },
        {
          name: "sortOrder",
          label: { lt: "Rikiavimo tvarka", en: "Sort Order" },
          type: "number",
          defaultValue: 0,
          admin: {
            description: "Display order (lower numbers first)",
          },
        },
      ],
    },
  ],
};
