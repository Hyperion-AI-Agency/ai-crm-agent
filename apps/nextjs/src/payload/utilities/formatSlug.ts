import { FieldHook } from "payload";

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

const format = (val: string): string =>
  val
    .replace(/[ąčęėįšųūžĄČĘĖĮŠŲŪŽ]/g, ch => charMap[ch] || ch)
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "")
    .toLowerCase();

const formatSlug =
  (fallback: string): FieldHook =>
  ({ value, originalDoc, data }) => {
    if (typeof value === "string") {
      return format(value);
    }
    const fallbackData =
      (data && (data as any)[fallback]) || (originalDoc && (originalDoc as any)[fallback]);

    if (fallbackData && typeof fallbackData === "string") {
      return format(fallbackData);
    }

    return value;
  };

export default formatSlug;
