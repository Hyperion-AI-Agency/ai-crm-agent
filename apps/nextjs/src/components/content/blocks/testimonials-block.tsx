import Image from "next/image";

import type { Media, Page } from "@/types/payload-types";

type TestimonialsBlockType = Extract<Page["layout"][number], { blockType: "testimonials" }>;

interface TestimonialsBlockProps {
  block: TestimonialsBlockType;
}

export function TestimonialsBlock({ block }: TestimonialsBlockProps) {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {(block.title || block.subtitle) && (
          <div className="mb-12 text-center">
            {block.title && (
              <h2 className="text-foreground mb-4 text-3xl font-bold md:text-4xl">{block.title}</h2>
            )}
            {block.subtitle && <p className="text-muted-foreground text-lg">{block.subtitle}</p>}
          </div>
        )}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {block.testimonials.map((testimonial, index) => {
            const imageUrl =
              typeof testimonial.authorImage === "object" && testimonial.authorImage !== null
                ? (testimonial.authorImage as Media).url
                : null;

            return (
              <div key={testimonial.id || index} className="bg-card rounded-xl border p-6">
                <p className="text-muted-foreground mb-6 text-base leading-relaxed italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  {imageUrl && (
                    <Image
                      src={imageUrl}
                      alt={testimonial.authorName}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  )}
                  <div>
                    <div className="text-foreground text-sm font-medium">
                      {testimonial.authorName}
                    </div>
                    {testimonial.authorTitle && (
                      <div className="text-muted-foreground text-xs">{testimonial.authorTitle}</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
