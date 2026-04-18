import { fetchPosts } from "@/actions/fetch-posts";

import type { Page, PageTemplate, Post } from "@/types/payload-types";
import { BlogIndexSection } from "@/components/blog/blog-index-section";
import Footer from "@/components/footer/footer";
import { NavbarWrapper } from "@/components/navbar/navbar-wrapper";
import { PricingSection } from "@/components/pricing/pricing-section";

import { Blog2 } from "./blocks/blog/blog-2";
import { Blog3 } from "./blocks/blog/blog-3";
import { Blog4 } from "./blocks/blog/blog-4";
import { Blog5 } from "./blocks/blog/blog-5";
import { Blog6 } from "./blocks/blog/blog-6";
import { Blog7 } from "./blocks/blog/blog-7";
import { Blog8 } from "./blocks/blog/blog-8";
import { Blog10 } from "./blocks/blog/blog-10";
import { CTABlock } from "./blocks/cta-block";
import { FAQBlock } from "./blocks/faq-block";
import { FeaturesBlock } from "./blocks/features-block";
import { HeroBlock } from "./blocks/hero-block";
import { ImageBlock } from "./blocks/image-block";
import { StatsBlock } from "./blocks/stats-block";
import { TestimonialsBlock } from "./blocks/testimonials-block";
import { TextBlock } from "./blocks/text-block";

type BlockType =
  | NonNullable<Page["layout"]>[number]
  | NonNullable<Post["content"]>[number]
  | NonNullable<PageTemplate["header"]>[number]
  | NonNullable<PageTemplate["footer"]>[number];

interface BlocksRendererProps {
  blocks: BlockType[] | null | undefined;
  locale?: string;
  searchParams?: Record<string, string | string[] | undefined>;
}

interface NavbarBlockLink {
  label?: string | null;
  url?: string | null;
  openInNewTab?: boolean | null;
  id?: string | null;
}

interface FooterBlockSection {
  title?: string | null;
  links?:
    | {
        label?: string | null;
        url?: string | null;
        openInNewTab?: boolean | null;
        id?: string | null;
      }[]
    | null;
  id?: string | null;
}

export async function BlocksRenderer({ blocks, locale, searchParams }: BlocksRendererProps) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  return (
    <>
      {blocks.map((block, index) => {
        switch (block.blockType) {
          // ─── Template blocks ───────────────────────────────────
          case "navbar":
            return (
              <NavbarWrapper
                key={block.id || index}
                links={"links" in block ? (block.links as NavbarBlockLink[]) : undefined}
                ctaLabel={"ctaLabel" in block ? (block.ctaLabel as string) : undefined}
                ctaUrl={"ctaUrl" in block ? (block.ctaUrl as string) : undefined}
              />
            );
          case "site-footer":
            return (
              <Footer
                key={block.id || index}
                sections={
                  "sections" in block ? (block.sections as FooterBlockSection[]) : undefined
                }
              />
            );

          // ─── Content blocks ────────────────────────────────────
          case "pricing":
            return (
              <PricingSection
                key={block.id || index}
                title={block.title}
                subtitle={block.subtitle}
              />
            );
          case "blog-index":
            return (
              <BlogIndexSection
                key={block.id || index}
                locale={locale ?? "en"}
                title={"title" in block ? (block.title as string) : undefined}
                subtitle={"subtitle" in block ? (block.subtitle as string) : undefined}
                searchParams={{
                  page: searchParams?.page as string | undefined,
                  search: searchParams?.search as string | undefined,
                  sort: searchParams?.sort as string | undefined,
                  category: searchParams?.category as string | undefined,
                }}
              />
            );

          // ─── Generic blocks ─────────────────────────────────────
          case "hero":
            return <HeroBlock key={block.id || index} block={block} />;
          case "text":
            return <TextBlock key={block.id || index} block={block} />;
          case "image":
            return <ImageBlock key={block.id || index} block={block} />;
          case "features":
            return <FeaturesBlock key={block.id || index} block={block} />;
          case "cta":
            return <CTABlock key={block.id || index} block={block} />;
          case "faq":
            return <FAQBlock key={block.id || index} block={block} />;
          case "stats":
            return <StatsBlock key={block.id || index} block={block} />;
          case "testimonials":
            return <TestimonialsBlock key={block.id || index} block={block} />;
          case "blog-2":
            return <Blog2 key={block.id || index} block={block} />;
          case "blog-3":
            return <Blog3 key={block.id || index} block={block} />;
          case "blog-4":
            return <Blog4 key={block.id || index} block={block} />;
          case "blog-5":
            return <Blog5 key={block.id || index} block={block} />;
          case "blog-6":
            return <Blog6 key={block.id || index} block={block} />;
          case "blog-7":
            return <Blog7 key={block.id || index} block={block} />;
          case "blog-8":
            return <Blog8 key={block.id || index} block={block} />;
          case "blog-10":
            return <Blog10 key={block.id || index} block={block} />;
          default:
            return null;
        }
      })}
    </>
  );
}
