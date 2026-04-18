"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import type { Page } from "@/types/payload-types";

type FAQBlockType = Extract<Page["layout"][number], { blockType: "faq" }>;

interface FAQBlockProps {
  block: FAQBlockType;
}

export function FAQBlock({ block }: FAQBlockProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-16">
      <div className="container mx-auto max-w-3xl px-4">
        {(block.title || block.subtitle) && (
          <div className="mb-12 text-center">
            {block.title && (
              <h2 className="text-foreground mb-4 text-3xl font-bold md:text-4xl">{block.title}</h2>
            )}
            {block.subtitle && <p className="text-muted-foreground text-lg">{block.subtitle}</p>}
          </div>
        )}
        <div className="divide-border divide-y">
          {block.items.map((item, index) => (
            <div key={item.id || index}>
              <button
                className="flex w-full items-center justify-between py-5 text-left"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="text-foreground pr-4 text-base font-medium">{item.question}</span>
                <ChevronDown
                  className={`text-muted-foreground h-5 w-5 flex-shrink-0 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <p className="text-muted-foreground pb-5 text-base leading-relaxed">
                  {item.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
