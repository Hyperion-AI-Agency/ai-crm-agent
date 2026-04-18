import { env } from "@/env";
import { Blog2Block } from "@/payload/blocks/blog/blog-2";
import { Blog3Block } from "@/payload/blocks/blog/blog-3";
import { Blog4Block } from "@/payload/blocks/blog/blog-4";
import { Blog5Block } from "@/payload/blocks/blog/blog-5";
import { Blog6Block } from "@/payload/blocks/blog/blog-6";
import { Blog7Block } from "@/payload/blocks/blog/blog-7";
import { Blog8Block } from "@/payload/blocks/blog/blog-8";
import { Blog10Block } from "@/payload/blocks/blog/blog-10";
import { BlogIndexBlock } from "@/payload/blocks/BlogIndexBlock";
import { BlogSectionBlock } from "@/payload/blocks/BlogSectionBlock";
import ContentWithMedia from "@/payload/blocks/ContentWithMedia/config";
import { CTABlock } from "@/payload/blocks/CTABlock";
import { FAQBlock } from "@/payload/blocks/FAQBlock";
import { FeaturesBlock } from "@/payload/blocks/FeaturesBlock";
import { FinalCTABlock } from "@/payload/blocks/FinalCTABlock";
import { HeroBlock } from "@/payload/blocks/HeroBlock";
import { ImageBlock } from "@/payload/blocks/ImageBlock";
import { LandingHeroBlock } from "@/payload/blocks/LandingHeroBlock";
import { MechanismBlock } from "@/payload/blocks/MechanismBlock";
import { PricingBlock } from "@/payload/blocks/PricingBlock";
import { StatsBlock } from "@/payload/blocks/StatsBlock";
import { TestimonialsBlock } from "@/payload/blocks/TestimonialsBlock";
import { TextBlock } from "@/payload/blocks/TextBlock";
import { WhatIsBlock } from "@/payload/blocks/WhatIsBlock";
import { revalidatePages } from "@/payload/collections/hooks/revalidatePages";
import slug from "@/payload/components/slug";
import { userPerms } from "@/payload/utilities/permissions";
import { CollectionConfig } from "payload";

export const Pages: CollectionConfig = {
  slug: "pages",
  labels: {
    singular: { lt: "Puslapis", en: "Page" },
    plural: { lt: "Puslapiai", en: "Pages" },
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
    group: { lt: "Turinys", en: "Content" },
    defaultColumns: ["title", "slug", "status", "updatedAt"],
    livePreview: {
      url: ({ data, locale }) =>
        `${env.NEXT_PUBLIC_APP_URL}/${locale.code}/${(data as Record<string, unknown>).slug}?isLivePreview=true`,
    },
  },
  access: {
    read: () => true,
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
      name: "pageTemplate",
      label: { lt: "Puslapio šablonas", en: "Page Template" },
      type: "relationship",
      relationTo: "page-templates",
      admin: {
        position: "sidebar",
        description: {
          lt: "Pasirinkite šabloną antraštei ir poraštei",
          en: "Select a template for header and footer",
        },
      },
    },
    {
      name: "layout",
      label: { lt: "Puslapio sekcijos", en: "Page Sections" },
      type: "blocks",
      blocks: [
        LandingHeroBlock,
        WhatIsBlock,
        MechanismBlock,
        PricingBlock,
        BlogSectionBlock,
        BlogIndexBlock,
        FinalCTABlock,
        HeroBlock,
        TextBlock,
        ImageBlock,
        CTABlock,
        FeaturesBlock,
        ContentWithMedia,
        TestimonialsBlock,
        StatsBlock,
        FAQBlock,
        Blog2Block,
        Blog3Block,
        Blog4Block,
        Blog5Block,
        Blog6Block,
        Blog7Block,
        Blog8Block,
        Blog10Block,
      ],
    },
  ],
  hooks: {
    afterChange: [revalidatePages],
  },
};
