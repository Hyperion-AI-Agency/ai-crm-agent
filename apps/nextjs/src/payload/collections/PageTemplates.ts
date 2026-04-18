import { Blog2Block } from "@/payload/blocks/blog/blog-2";
import { Blog3Block } from "@/payload/blocks/blog/blog-3";
import { Blog4Block } from "@/payload/blocks/blog/blog-4";
import { Blog5Block } from "@/payload/blocks/blog/blog-5";
import { Blog6Block } from "@/payload/blocks/blog/blog-6";
import { Blog7Block } from "@/payload/blocks/blog/blog-7";
import { Blog8Block } from "@/payload/blocks/blog/blog-8";
import { Blog10Block } from "@/payload/blocks/blog/blog-10";
import ContentWithMedia from "@/payload/blocks/ContentWithMedia/config";
import { CTABlock } from "@/payload/blocks/CTABlock";
import { FAQBlock } from "@/payload/blocks/FAQBlock";
import { FeaturesBlock } from "@/payload/blocks/FeaturesBlock";
import { HeroBlock } from "@/payload/blocks/HeroBlock";
import { ImageBlock } from "@/payload/blocks/ImageBlock";
import { NavbarBlock } from "@/payload/blocks/NavbarBlock";
import { SiteFooterBlock } from "@/payload/blocks/SiteFooterBlock";
import { StatsBlock } from "@/payload/blocks/StatsBlock";
import { TestimonialsBlock } from "@/payload/blocks/TestimonialsBlock";
import { TextBlock } from "@/payload/blocks/TextBlock";
import { revalidatePageTemplates } from "@/payload/collections/hooks/revalidatePageTemplates";
import { userPerms } from "@/payload/utilities/permissions";
import type { CollectionConfig } from "payload";

const allBlocks = [
  NavbarBlock,
  SiteFooterBlock,
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
];

export const PageTemplates: CollectionConfig = {
  slug: "page-templates",
  labels: {
    singular: { lt: "Puslapio sablonas", en: "Page Template" },
    plural: { lt: "Puslapiu sablonai", en: "Page Templates" },
  },
  admin: {
    useAsTitle: "name",
    group: { lt: "Sablonai", en: "Templates" },
    description: {
      lt: "Sablonai veikia kaip isdestymo apvalkalai: antrastes blokai -> puslapio turinys -> porastes blokai",
      en: "Templates work as layout wrappers: header blocks -> page content -> footer blocks",
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
      name: "name",
      label: { lt: "Pavadinimas", en: "Name" },
      type: "text",
      required: true,
    },
    {
      name: "header",
      label: { lt: "Antraste (virs turinio)", en: "Header (above content)" },
      type: "blocks",
      blocks: allBlocks,
    },
    {
      name: "footer",
      label: { lt: "Poraste (po turiniu)", en: "Footer (below content)" },
      type: "blocks",
      blocks: allBlocks,
    },
  ],
  hooks: {
    afterChange: [revalidatePageTemplates],
  },
};
