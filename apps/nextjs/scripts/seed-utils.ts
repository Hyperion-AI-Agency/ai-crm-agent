/**
 * Shared utilities for seed scripts.
 *
 * - buildRichText()    — Lexical rich text builder
 * - matchArrayIds()    — copy IDs from source array items to target for Payload locale matching
 * - formatSlugStr()    — generate URL-safe slug from a string (handles Lithuanian chars)
 */
import "dotenv/config";

// ─── Slug Formatter ──────────────────────────────────────────────────────

const charMap: Record<string, string> = {
  ą: "a",
  č: "c",
  ę: "e",
  ė: "e",
  į: "i",
  š: "s",
  ų: "u",
  ū: "u",
  ž: "z",
  Ą: "a",
  Č: "c",
  Ę: "e",
  Ė: "e",
  Į: "i",
  Š: "s",
  Ų: "u",
  Ū: "u",
  Ž: "z",
};

export function formatSlugStr(val: string): string {
  return val
    .replace(/[ąčęėįšųūžĄČĘĖĮŠŲŪŽ]/g, ch => charMap[ch] || ch)
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "")
    .toLowerCase();
}

// ─── Rich Text Builder ────────────────────────────────────────────────────

type RichTextNode =
  | { type: "heading"; tag?: string; text: string }
  | { type: "paragraph"; text: string };

export interface LexicalRoot {
  root: {
    type: string;
    children: { type: string; version: number; [k: string]: unknown }[];
    direction: "ltr" | "rtl" | null;
    format: "" | "left" | "center" | "right" | "start" | "end" | "justify";
    indent: number;
    version: number;
  };
  [k: string]: unknown;
}

export function buildRichText(sections: RichTextNode[]): LexicalRoot {
  type LexicalChild = LexicalRoot["root"]["children"][number];
  const children: LexicalChild[] = sections.map<LexicalChild>(section => {
    if (section.type === "heading") {
      return {
        type: "heading",
        tag: section.tag ?? "h2",
        children: [{ type: "text", text: section.text, version: 1 }],
        direction: "ltr",
        format: "",
        indent: 0,
        version: 1,
      };
    }
    return {
      type: "paragraph",
      children: [{ type: "text", text: section.text, version: 1 }],
      direction: "ltr",
      format: "",
      indent: 0,
      version: 1,
    };
  });

  return {
    root: {
      type: "root",
      children,
      direction: "ltr",
      format: "",
      indent: 0,
      version: 1,
    },
  };
}

// ─── Array ID Matching ────────────────────────────────────────────────────

/**
 * Given a source array (with `id` fields from Payload) and a target array
 * (without IDs), copies the `id` from source[i] into target[i] so that
 * Payload can match localized fields within array items.
 *
 * For nested arrays (e.g. footer columns with links), pass `nestedKey`
 * to also match IDs in the nested array.
 */
export function matchArrayIds<T extends Record<string, any>>(
  source: T[],
  target: Record<string, any>[],
  nestedKey?: string
): Record<string, any>[] {
  return target.map((item, i) => {
    const sourceItem = source[i];
    const result = { ...item };

    if (sourceItem?.id) {
      result.id = sourceItem.id;
    }

    if (nestedKey && Array.isArray(item[nestedKey]) && Array.isArray(sourceItem?.[nestedKey])) {
      result[nestedKey] = (item[nestedKey] as Record<string, any>[]).map(
        (nested: Record<string, any>, j: number) => {
          const sourceNested = (sourceItem[nestedKey] as T[])?.[j];
          if (sourceNested?.id) {
            return { ...nested, id: sourceNested.id };
          }
          return nested;
        }
      );
    }

    return result;
  });
}
