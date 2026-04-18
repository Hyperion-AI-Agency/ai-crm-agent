import { env } from "@/env";
import { defineRouting } from "next-intl/routing";

export const localesConfig: Record<string, { name: string; flag: string }> = {
  lt: { name: "Lietuviu", flag: "LT" },
  en: { name: "English", flag: "GB" },
};

const allLocales = env.NEXT_PUBLIC_ALL_LOCALES as string[];
const defaultLoc = (env.NEXT_PUBLIC_DEFAULT_LOCALE as string) ?? "lt";

export const routing = defineRouting({
  locales: allLocales as [string, ...string[]],
  defaultLocale: defaultLoc,
  localePrefix: "never",
});

export type Locale = (typeof routing.locales)[number];
export const locales = routing.locales;
export const defaultLocale = routing.defaultLocale;
