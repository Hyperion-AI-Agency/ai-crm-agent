import Image from "next/image";

import type { Media, Page, Post } from "@/types/payload-types";

type ImageBlockType =
  | Extract<Page["layout"][number], { blockType: "image" }>
  | Extract<Post["content"][number], { blockType: "image" }>;

interface ImageBlockProps {
  block: ImageBlockType;
}

export function ImageBlock({ block }: ImageBlockProps) {
  const imageUrl =
    typeof block.image === "object" && block.image !== null
      ? (block.image as Media).url
      : typeof block.image === "string"
        ? block.image
        : null;

  const imageAlt =
    typeof block.image === "object" && block.image !== null
      ? (block.image as Media).alt || block.caption || ""
      : block.caption || "";

  if (!imageUrl) return null;

  const containerClass =
    block.alignment === "full"
      ? "w-full"
      : block.alignment === "left"
        ? "w-full md:w-1/2"
        : block.alignment === "right"
          ? "w-full md:w-1/2 md:ml-auto"
          : "mx-auto w-full max-w-4xl";

  return (
    <figure className={containerClass}>
      <Image src={imageUrl} alt={imageAlt} width={1200} height={600} className="rounded-lg" />
      {block.caption && (
        <figcaption className="text-muted-foreground mt-2 text-center text-sm">
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}
