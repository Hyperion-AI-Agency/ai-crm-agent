import Image from "next/image";

import type { Media, Page, Post } from "@/types/payload-types";

type FeaturesBlockType =
  | Extract<Page["layout"][number], { blockType: "features" }>
  | Extract<Post["content"][number], { blockType: "features" }>;

interface FeaturesBlockProps {
  block: FeaturesBlockType;
}

export function FeaturesBlock({ block }: FeaturesBlockProps) {
  const gridCols =
    block.columns === "2"
      ? "md:grid-cols-2"
      : block.columns === "4"
        ? "md:grid-cols-4"
        : "md:grid-cols-3";

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {(block.title || block.subtitle) && (
          <div className="mb-8 text-center">
            {block.title && <h2 className="mb-2 text-3xl font-bold">{block.title}</h2>}
            {block.subtitle && <p className="text-muted-foreground text-lg">{block.subtitle}</p>}
          </div>
        )}
        <div className={`grid gap-6 ${gridCols}`}>
          {block.features.map((feature, index) => {
            const iconUrl =
              typeof feature.icon === "object" && feature.icon !== null
                ? (feature.icon as Media).url
                : null;

            return (
              <div key={feature.id || index} className="rounded-lg border p-6">
                {iconUrl && (
                  <Image
                    src={iconUrl}
                    alt={feature.title}
                    width={48}
                    height={48}
                    className="mb-4"
                  />
                )}
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                {feature.description && (
                  <p className="text-muted-foreground">{feature.description}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
