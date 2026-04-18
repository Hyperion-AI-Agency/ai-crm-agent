import { env } from "@/env";
import ContentWithMedia from "@/payload/blocks/ContentWithMedia/config";
import { revalidatePosts } from "@/payload/collections/hooks/revalidatePosts";
import image from "@/payload/components/image";
import slug from "@/payload/components/slug";
import { adminPerms, userPerms } from "@/payload/utilities/permissions";
import {
  BlocksFeature,
  FixedToolbarFeature,
  HTMLConverterFeature,
  lexicalEditor,
  lexicalHTML,
} from "@payloadcms/richtext-lexical";
import { CollectionConfig } from "payload";

export const Posts: CollectionConfig = {
  slug: "posts",
  labels: {
    singular: { lt: "Įrašas", en: "Post" },
    plural: { lt: "Įrašai", en: "Posts" },
  },
  versions: {
    drafts: {
      autosave: {
        interval: 300,
      },
    },
  },
  admin: {
    useAsTitle: "title",
    group: { lt: "Įrašai", en: "Posts" },
    defaultColumns: ["title", "slug", "date", "featured"],
    livePreview: { url: ({ data }) => `${env.NEXT_PUBLIC_APP_URL}/blog/${(data as any).slug}` },
  },
  access: {
    read: req => userPerms(req),
    create: req => userPerms(req),
    update: req => userPerms(req),
    delete: req => userPerms(req),
  },
  fields: [
    {
      name: "title",
      label: { lt: "Pavadinimas", en: "Title" },
      type: "text",
      required: true,
      localized: true,
    },
    {
      ...slug("title"),
      localized: true,
    },
    {
      name: "status",
      label: { lt: "Būsena", en: "Status" },
      type: "select",
      options: [
        { label: { lt: "Juodraštis", en: "Draft" }, value: "draft" },
        { label: { lt: "Paskelbtas", en: "Published" }, value: "published" },
      ],
      defaultValue: "published",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      label: { lt: "Rekomenduojamas įrašas?", en: "Feature this post?" },
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "date",
      label: { lt: "Data", en: "Date" },
      type: "date",
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
          displayFormat: "MMM dd, yyyy hh:mm a",
        },
        position: "sidebar",
      },
      hooks: {
        beforeChange: [
          ({ value, operation }) => {
            // Set to current date if not provided and it's a create operation
            if (operation === "create" && !value) {
              return new Date().toISOString();
            }
            return value;
          },
        ],
      },
    },
    {
      name: "link",
      type: "text",
      admin: {
        readOnly: true,
        position: "sidebar",
      },
      required: false,
      hooks: {
        beforeChange: [
          async ({ data, operation, value }) => {
            // Don't override if value is already set
            if (value) return value;
            // Only set link if slug exists
            if (data && (data as any).slug) {
              return `${env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || ""}/blog/${(data as any).slug}`;
            }
            return undefined;
          },
        ],
      },
    },
    {
      name: "content",
      label: { lt: "Turinys", en: "Content" },
      type: "group",
      fields: [
        {
          name: "description",
          label: { lt: "Aprašymas", en: "Description" },
          type: "textarea",
          maxLength: 300,
          localized: true,
        },
        {
          name: "summary",
          label: { lt: "Santrauka", en: "Summary" },
          type: "textarea",
          maxLength: 280,
          localized: true,
        },
        {
          name: "richText",
          label: { lt: "Tekstas", en: "Rich Text" },
          type: "richText",
          localized: true,
          editor: lexicalEditor({
            features: ({ defaultFeatures }) => [
              ...defaultFeatures.filter(
                feature =>
                  !["superscript", "subscript", "indent", "align", "inlineCode"].includes(
                    feature.key
                  )
              ),
              FixedToolbarFeature(),
              BlocksFeature({
                blocks: [ContentWithMedia],
              }),
              HTMLConverterFeature({}),
            ],
          }),
        },
        {
          type: "row",
          fields: [
            {
              type: "relationship",
              name: "authors",
              label: { lt: "Autoriai", en: "Authors" },
              relationTo: "users",
              hasMany: true,
              admin: {
                width: "50%",
              },
            },
            {
              type: "relationship",
              name: "category",
              label: { lt: "Kategorija", en: "Category" },
              relationTo: "categories",
              hasMany: true,
              maxRows: 2,
              admin: {
                width: "50%",
              },
            },
          ],
        },
        {
          type: "group",
          name: "media",
          fields: [
            {
              type: "row",
              fields: [
                {
                  type: "checkbox",
                  name: "includeAudio",
                  label: { lt: "Pridėti garso nuorodą?", en: "Include an audio link?" },
                  defaultValue: false,
                  admin: { width: "50%" },
                },
                {
                  type: "checkbox",
                  name: "includeVideo",
                  label: { lt: "Pridėti vaizdo įrašą?", en: "Include a video?" },
                  defaultValue: false,
                  admin: { width: "50%" },
                },
              ],
            },
            {
              type: "text",
              name: "audio",
              label: { lt: "Garso nuoroda", en: "Audio" },
              admin: {
                description: "Include a direct link to podcast audio.",
                condition: (data, siblingData) => {
                  if ((siblingData as any).includeAudio) {
                    return true;
                  } else {
                    return false;
                  }
                },
              },
            },
            {
              type: "row",
              fields: [
                {
                  type: "radio",
                  name: "videoHost",
                  label: { lt: "Kur talpinamas vaizdo įrašas?", en: "Where is the video hosted?" },
                  options: [
                    { value: "youtube", label: "YouTube" },
                    { value: "vimeo", label: "Vimeo" },
                  ],
                  defaultValue: "youtube",
                },
                {
                  type: "text",
                  name: "youtube",
                  label: { lt: "YouTube nuoroda", en: "YouTube Link" },
                  admin: {
                    description: 'Use the "youtu.be" share link',
                    condition: (data, siblingData) => {
                      if ((siblingData as any).videoHost === "youtube") {
                        return true;
                      } else {
                        return false;
                      }
                    },
                    width: "100%",
                  },
                },
                {
                  type: "text",
                  name: "vimeo",
                  label: { lt: "Vimeo nuoroda", en: "Vimeo Link" },
                  admin: {
                    description: 'Only include the numbers after the "vimeo" portion of the link',
                    condition: (data, siblingData) => {
                      if ((siblingData as any).videoHost === "vimeo") {
                        return true;
                      } else {
                        return false;
                      }
                    },
                    width: "100%",
                  },
                },
              ],
              admin: {
                condition: (data, siblingData) => {
                  if ((siblingData as any).includeVideo) {
                    return true;
                  } else {
                    return false;
                  }
                },
              },
            },
          ],
        },
        image(),
        lexicalHTML("richText", { name: "richText_html" }),
      ],
    },
  ],
  hooks: {
    afterChange: [revalidatePosts],
  },
};
