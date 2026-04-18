import type { PageTemplate as GeneratedPageTemplate } from "@/types/payload-types";

export type PageTemplate = GeneratedPageTemplate;

export function resolvePageTemplate(entity: unknown): string | PageTemplate | null {
  if (typeof entity !== "object" || entity === null) return null;
  const field = (entity as Record<string, unknown>).pageTemplate;
  if (typeof field === "string") return field;
  if (typeof field === "object" && field !== null && "id" in field) return field as PageTemplate;
  return null;
}
