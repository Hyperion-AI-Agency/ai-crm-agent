import type { CollectionConfig } from "payload";

export const Subscriptions: CollectionConfig = {
  slug: "user_subscriptions",
  labels: {
    singular: { lt: "Prenumerata", en: "Subscription" },
    plural: { lt: "Prenumeratos", en: "Subscriptions" },
  },
  admin: {
    group: { lt: "Naudotojai", en: "Users" },
    useAsTitle: "id",
    defaultColumns: ["id", "userId", "status", "currentPeriodEnd", "amount", "currency"],
  },
  access: {
    read: ({ req }) => {
      // Users can read their own subscriptions, admins can read all
      if (req.user) {
        return {
          or: [
            {
              userId: {
                equals: req.user.id,
              },
            },
            {
              userId: {
                exists: false, // Allow reading subscriptions without userId (for admin)
              },
            },
          ],
        };
      }
      return false;
    },
    create: ({ req }) => !!req.user, // Only authenticated users can create
    update: ({ req }) => !!req.user, // Only authenticated users can update
    delete: ({ req }) => !!req.user, // Only authenticated users can delete
  },
  fields: [
    {
      name: "id",
      label: { lt: "Prenumeratos ID", en: "Subscription ID" },
      type: "text",
      required: true,
      unique: true,
      admin: {
        description: "Polar.sh subscription ID",
      },
    },
    {
      name: "userId",
      label: { lt: "Naudotojas", en: "User" },
      type: "relationship",
      relationTo: "users",
      admin: {
        description: "The user this subscription belongs to",
      },
    },
    {
      name: "amount",
      label: { lt: "Suma", en: "Amount" },
      type: "number",
      required: true,
      admin: {
        description: "Subscription amount in cents (e.g., 2900 for $29.00)",
        step: 1,
      },
    },
    {
      name: "currency",
      label: { lt: "Valiuta", en: "Currency" },
      type: "select",
      required: true,
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
      label: { lt: "Mokėjimo intervalas", en: "Billing Interval" },
      type: "select",
      required: true,
      options: [
        {
          label: { lt: "Kas mėnesį", en: "Monthly" },
          value: "month",
        },
        {
          label: { lt: "Kas metus", en: "Yearly" },
          value: "year",
        },
      ],
      admin: {
        description: "Billing interval for this subscription",
      },
    },
    {
      name: "status",
      label: { lt: "Būsena", en: "Status" },
      type: "select",
      required: true,
      options: [
        {
          label: { lt: "Aktyvi", en: "Active" },
          value: "active",
        },
        {
          label: { lt: "Atšaukta", en: "Canceled" },
          value: "canceled",
        },
        {
          label: { lt: "Vėluojantis mokėjimas", en: "Past Due" },
          value: "past_due",
        },
        {
          label: { lt: "Neapmokėta", en: "Unpaid" },
          value: "unpaid",
        },
        {
          label: { lt: "Bandomasis laikotarpis", en: "Trialing" },
          value: "trialing",
        },
        {
          label: { lt: "Neužbaigta", en: "Incomplete" },
          value: "incomplete",
        },
        {
          label: { lt: "Neužbaigta (pasibaigusi)", en: "Incomplete Expired" },
          value: "incomplete_expired",
        },
      ],
    },
    {
      name: "currentPeriodStart",
      label: { lt: "Dabartinio periodo pradžia", en: "Current Period Start" },
      type: "date",
      required: true,
      admin: {
        description: "Start date of the current billing period",
      },
    },
    {
      name: "currentPeriodEnd",
      label: { lt: "Dabartinio periodo pabaiga", en: "Current Period End" },
      type: "date",
      required: true,
      admin: {
        description: "End date of the current billing period",
      },
    },
    {
      name: "cancelAtPeriodEnd",
      label: { lt: "Atšaukti periodo pabaigoje", en: "Cancel at Period End" },
      type: "checkbox",
      defaultValue: false,
      admin: {
        description: "Whether the subscription will be canceled at the end of the current period",
      },
    },
    {
      name: "canceledAt",
      label: { lt: "Atšaukimo data", en: "Canceled At" },
      type: "date",
      admin: {
        description: "Date when the subscription was canceled",
      },
    },
    {
      name: "startedAt",
      label: { lt: "Pradžios data", en: "Started At" },
      type: "date",
      required: true,
      admin: {
        description: "Date when the subscription started",
      },
    },
    {
      name: "endsAt",
      label: { lt: "Pasibaigs", en: "Ends At" },
      type: "date",
      admin: {
        description: "Date when the subscription will end",
      },
    },
    {
      name: "endedAt",
      label: { lt: "Pasibaigė", en: "Ended At" },
      type: "date",
      admin: {
        description: "Date when the subscription ended",
      },
    },
    {
      name: "customerId",
      label: { lt: "Kliento ID", en: "Customer ID" },
      type: "text",
      required: true,
      admin: {
        description: "Polar.sh customer ID",
      },
    },
    {
      name: "productId",
      label: { lt: "Produkto ID", en: "Product ID" },
      type: "text",
      required: true,
      admin: {
        description: "Polar.sh product ID",
      },
    },
    {
      name: "discountId",
      label: { lt: "Nuolaidos ID", en: "Discount ID" },
      type: "text",
      admin: {
        description: "Polar.sh discount ID if applicable",
      },
    },
    {
      name: "checkoutId",
      label: { lt: "Apmokėjimo ID", en: "Checkout ID" },
      type: "text",
      required: true,
      admin: {
        description: "Polar.sh checkout ID",
      },
    },
    {
      name: "customerCancellationReason",
      label: { lt: "Atšaukimo priežastis", en: "Cancellation Reason" },
      type: "text",
      admin: {
        description: "Reason provided by customer for cancellation",
      },
    },
    {
      name: "customerCancellationComment",
      label: { lt: "Atšaukimo komentaras", en: "Cancellation Comment" },
      type: "textarea",
      admin: {
        description: "Additional comments from customer about cancellation",
      },
    },
    {
      name: "modifiedAt",
      label: { lt: "Paskutinis pakeitimas", en: "Modified At" },
      type: "date",
      admin: {
        description: "Date when the subscription was last modified",
      },
    },
    {
      name: "metadata",
      label: { lt: "Metaduomenys", en: "Metadata" },
      type: "text",
      admin: {
        description: "Additional metadata as JSON string",
      },
    },
    {
      name: "customFieldData",
      label: { lt: "Papildomi laukai", en: "Custom Field Data" },
      type: "text",
      admin: {
        description: "Custom field data as JSON string",
      },
    },
  ],
  defaultSort: "-createdAt",
};
