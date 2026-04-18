import type { Page, Post } from "@/types/payload-types";

import { RichTextRenderer } from "../rich-text-renderer";

type TextBlockType =
  | Extract<Page["layout"][number], { blockType: "text" }>
  | Extract<Post["content"][number], { blockType: "text" }>;

interface TextBlockProps {
  block: TextBlockType;
}

export function TextBlock({ block }: TextBlockProps) {
  const alignClass =
    block.alignment === "center"
      ? "text-center"
      : block.alignment === "right"
        ? "text-right"
        : "text-left";

  return (
    <section className="bg-background py-12">
      <div className="container mx-auto px-4">
        <div className={`prose prose-lg mx-auto max-w-4xl ${alignClass}`}>
          <RichTextRenderer content={block.content} />
        </div>
      </div>
    </section>
  );
}
