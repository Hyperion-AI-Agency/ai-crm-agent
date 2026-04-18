import type { CollectionConfig } from "payload";

export const Plans: CollectionConfig = {
  slug: "plans",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "polarProductId", "price", "recurringInterval", "isActive"],
  },
  access: {
    read: () => true, // Public read access
    create: ({ req }) => !!req.user, // Only authenticated users can create
    update: ({ req }) => !!req.user, // Only authenticated users can update
    delete: ({ req }) => !!req.user, // Only authenticated users can delete
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      localized: true, // Plan name can be different per locale
      admin: {
        description: "The name of the subscription plan (e.g., 'Pro', 'Starter')",
      },
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description: "URL-friendly identifier for the plan (e.g., 'pro', 'starter')",
      },
    },
    {
      name: "polarProductId",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description: "The Polar.sh product ID associated with this plan",
      },
    },
    {
      name: "description",
      type: "textarea",
      localized: true, // Description can be different per locale
      admin: {
        description: "A brief description of what this plan offers",
      },
    },
    {
      name: "price",
      type: "number",
      required: true,
      admin: {
        description: "Price in cents (e.g., 2900 for $29.00)",
        step: 1,
      },
    },
    {
      name: "currency",
      type: "select",
      required: true,
      defaultValue: "usd",
      options: [
        {
          label: "USD ($)",
          value: "usd",
        },
        {
          label: "EUR (€)",
          value: "eur",
        },
      ],
    },
    {
      name: "recurringInterval",
      type: "select",
      required: true,
      defaultValue: "month",
      options: [
        {
          label: "Monthly",
          value: "month",
        },
        {
          label: "Yearly",
          value: "year",
        },
      ],
      admin: {
        description: "Billing interval for this plan",
      },
    },
    {
      name: "features",
      type: "array",
      localized: true, // Features list can be different per locale
      fields: [
        {
          name: "feature",
          type: "text",
          required: true,
        },
      ],
      admin: {
        description: "List of features included in this plan",
      },
    },
    {
      name: "isPopular",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description: "Mark this plan as popular/best value",
      },
    },
    {
      name: "isActive",
      type: "checkbox",
      defaultValue: true,
      admin: {
        description: "Whether this plan is currently available for purchase",
      },
    },
    {
      name: "sortOrder",
      type: "number",
      defaultValue: 0,
      admin: {
        description: "Order in which plans should be displayed (lower numbers first)",
      },
    },
    {
      name: "ctaText",
      type: "text",
      localized: true,
      defaultValue: "Get Started",
      admin: {
        description: "Call-to-action button text",
      },
    },
  ],
  defaultSort: "sortOrder",
};
