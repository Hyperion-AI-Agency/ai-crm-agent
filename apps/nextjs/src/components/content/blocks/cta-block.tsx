import Link from "next/link";

import type { Page, Post } from "@/types/payload-types";
import { Button } from "@/components/ui/button";

type CTABlockType =
  | Extract<Page["layout"][number], { blockType: "cta" }>
  | Extract<Post["content"][number], { blockType: "cta" }>;

interface CTABlockProps {
  block: CTABlockType;
}

export function CTABlock({ block }: CTABlockProps) {
  const bgClass =
    block.backgroundColor === "primary"
      ? "bg-primary text-primary-foreground"
      : block.backgroundColor === "secondary"
        ? "bg-secondary text-secondary-foreground"
        : "bg-muted";

  return (
    <section className={`py-12 ${bgClass}`}>
      <div className="container mx-auto px-4 text-center">
        <h2 className="mb-4 text-3xl font-bold">{block.title}</h2>
        {block.description && <p className="mb-6 text-lg">{block.description}</p>}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="lg">
            <Link href={block.buttonLink}>{block.buttonText}</Link>
          </Button>
          {block.secondaryButtonText && block.secondaryButtonLink && (
            <Button asChild variant="outline" size="lg">
              <Link href={block.secondaryButtonLink}>{block.secondaryButtonText}</Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
