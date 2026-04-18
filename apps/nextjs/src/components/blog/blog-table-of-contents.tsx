"use client";

import { useEffect, useRef, useState } from "react";

export interface TocHeading {
  id: string;
  text: string;
  level: number;
}

interface BlogTableOfContentsProps {
  headings: TocHeading[];
  title?: string;
}

export function BlogTableOfContents({
  headings,
  title = "On this page",
}: BlogTableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const elements = headings
      .map(h => document.getElementById(h.id))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    observerRef.current = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0 && visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-80px 0px -60% 0px",
        threshold: 0,
      }
    );

    elements.forEach(el => observerRef.current?.observe(el));

    return () => {
      observerRef.current?.disconnect();
    };
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav>
      <div className="sticky top-32">
        <p className="text-foreground mb-3 text-sm font-semibold">{title}</p>
        <ul className="border-border/50 space-y-1 border-l">
          {headings.map(heading => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                onClick={e => {
                  e.preventDefault();
                  document.getElementById(heading.id)?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
                className={`-ml-px block border-l-2 py-1 text-sm transition-colors ${
                  heading.level === 3 ? "pl-6" : "pl-4"
                } ${
                  activeId === heading.id
                    ? "border-primary text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:border-border border-transparent"
                }`}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
