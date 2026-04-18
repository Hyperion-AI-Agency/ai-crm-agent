import Link from "next/link";

import type { Page, Post } from "@/types/payload-types";
import { Button } from "@/components/ui/button";

import { RichTextRenderer } from "../rich-text-renderer";

type HeroBlockType =
  | Extract<Page["layout"][number], { blockType: "hero" }>
  | Extract<Post["content"][number], { blockType: "hero" }>;

interface HeroBlockProps {
  block: HeroBlockType;
}

export function HeroBlock({ block }: HeroBlockProps) {
  const bgImageUrl =
    typeof block.backgroundImage === "object" && block.backgroundImage !== null
      ? (block.backgroundImage as { url?: string }).url
      : null;

  return (
    <section
      className="relative flex items-center justify-center overflow-hidden px-4 pt-32 pb-8 md:pt-40"
      style={
        bgImageUrl
          ? {
              backgroundImage: `url(${bgImageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      {bgImageUrl && <div className="absolute inset-0 bg-black/40" />}
      <div className="relative z-10 container mx-auto text-center">
        <h1 className="mb-4 text-3xl font-bold md:text-4xl">{block.title}</h1>
        {block.subtitle && (
          <h2 className="text-muted-foreground mb-6 text-lg font-normal md:text-xl">
            {block.subtitle}
          </h2>
        )}
        {block.description && (
          <div className="prose prose-lg mx-auto mb-8 max-w-3xl">
            <RichTextRenderer content={block.description} />
          </div>
        )}
        {(block.ctaText || block.secondaryCtaText) && (
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            {block.ctaText && block.ctaLink && (
              <Button asChild size="lg">
                <Link href={block.ctaLink}>{block.ctaText}</Link>
              </Button>
            )}
            {block.secondaryCtaText && block.secondaryCtaLink && (
              <Button asChild variant="outline" size="lg">
                <Link href={block.secondaryCtaLink}>{block.secondaryCtaText}</Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
