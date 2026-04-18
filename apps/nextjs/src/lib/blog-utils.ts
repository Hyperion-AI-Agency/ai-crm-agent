import type { TocHeading } from "@/components/blog/blog-table-of-contents";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function extractHeadingsFromHtml(html: string): TocHeading[] {
  const headings: TocHeading[] = [];
  const regex = /<h([23])[^>]*>([\s\S]*?)<\/h[23]>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1]!, 10);
    const text = match[2]!.replace(/<[^>]+>/g, "").trim();
    if (text) {
      headings.push({ id: slugify(text), text, level });
    }
  }
  return headings;
}

export function injectHeadingIds(html: string): string {
  return html.replace(/<h([23])([^>]*)>([\s\S]*?)<\/h[23]>/gi, (fullMatch, level, attrs, inner) => {
    const text = (inner as string).replace(/<[^>]+>/g, "").trim();
    const id = slugify(text);
    if ((attrs as string).includes("id=")) return fullMatch;
    return `<h${level}${attrs} id="${id}">${inner}</h${level}>`;
  });
}
