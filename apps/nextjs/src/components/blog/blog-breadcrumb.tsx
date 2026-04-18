import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BlogBreadcrumbProps {
  items: BreadcrumbItem[];
}

export function BlogBreadcrumb({ items }: BlogBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1.5">
            {index > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0" />}
            {item.href ? (
              <Link href={item.href} className="hover:text-foreground transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground max-w-[200px] truncate font-medium sm:max-w-none">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
