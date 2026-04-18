import type { Page } from "@/types/payload-types";

type StatsBlockType = Extract<Page["layout"][number], { blockType: "stats" }>;

interface StatsBlockProps {
  block: StatsBlockType;
}

export function StatsBlock({ block }: StatsBlockProps) {
  const bgClass =
    block.backgroundColor === "primary"
      ? "bg-primary text-primary-foreground"
      : block.backgroundColor === "secondary"
        ? "bg-secondary text-secondary-foreground"
        : "bg-muted";

  return (
    <section className={`py-16 ${bgClass}`}>
      <div className="container mx-auto px-4">
        {(block.title || block.subtitle) && (
          <div className="mb-12 text-center">
            {block.title && <h2 className="mb-4 text-3xl font-bold md:text-4xl">{block.title}</h2>}
            {block.subtitle && <p className="text-lg opacity-80">{block.subtitle}</p>}
          </div>
        )}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {block.stats.map((stat, index) => (
            <div key={stat.id || index} className="text-center">
              <div className="mb-2 text-3xl font-bold md:text-4xl">{stat.value}</div>
              <div className="text-sm opacity-70">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
