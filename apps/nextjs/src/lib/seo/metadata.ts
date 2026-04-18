import type { Metadata } from "next";
import { env } from "@/env";

import { locales } from "@/lib/i18n/routing";

const OG_LOCALE_MAP: Record<string, string> = {
  en: "en_US",
  lt: "lt_LT",
};

interface PageMetadataOptions {
  locale: string;
  title: string;
  description: string;
  /** Internal path without locale prefix, e.g. "/blog" or "/blog/my-post" */
  internalPath: string;
  ogType?: "website" | "article";
  ogImage?: string;
  publishedTime?: string;
}

/**
 * Build a complete Metadata object for a page with canonical, hreflang alternates,
 * OpenGraph, and Twitter card.
 */
export function pageMetadata({
  locale,
  title,
  description,
  internalPath,
  ogType = "website",
  ogImage,
  publishedTime,
}: PageMetadataOptions): Metadata {
  const baseUrl = env.NEXT_PUBLIC_APP_URL;
  const canonicalUrl = `${baseUrl}${internalPath}`;

  const languages: Record<string, string> = {};
  for (const loc of locales) {
    languages[loc] = `${baseUrl}${internalPath}`;
  }

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "App",
      locale: OG_LOCALE_MAP[locale] ?? "en_US",
      type: ogType,
      ...(ogImage && { images: [{ url: ogImage }] }),
      ...(publishedTime && { publishedTime }),
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title,
      description,
    },
  };
}

/**
 * Build root layout metadata with title template and metadataBase.
 */
export function rootLayoutMetadata(locale: string, name: string, description: string): Metadata {
  const baseUrl = env.NEXT_PUBLIC_APP_URL;

  return {
    title: {
      default: name,
      template: `%s | ${name}`,
    },
    description,
    metadataBase: new URL(baseUrl),
    icons: {
      icon: [
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      ],
      apple: "/apple-touch-icon.png",
    },
    manifest: "/site.webmanifest",
    openGraph: {
      siteName: name,
      locale: OG_LOCALE_MAP[locale] ?? "en_US",
      type: "website",
    },
  };
}
