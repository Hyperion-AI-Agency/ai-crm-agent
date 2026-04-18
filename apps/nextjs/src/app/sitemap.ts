import type { MetadataRoute } from "next";
import { env } from "@/env";
import config from "@payload-config";
import { getPayload } from "payload";

import { locales } from "@/lib/i18n/routing";

// Prevent static generation during build — sitemap queries the DB
export const dynamic = "force-dynamic";

/** Build a sitemap entry for a given internal path with both locale variants. */
function localizedEntry(
  baseUrl: string,
  internalPath: string,
  opts: {
    lastModified?: string | Date;
    changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority?: number;
  }
): MetadataRoute.Sitemap[number][] {
  return locales.map(locale => {
    const languages: Record<string, string> = {};
    for (const loc of locales) {
      languages[loc] = `${baseUrl}${internalPath}`;
    }

    return {
      url: `${baseUrl}${internalPath}`,
      lastModified: opts.lastModified ?? new Date(),
      changeFrequency: opts.changeFrequency,
      priority: opts.priority,
      alternates: { languages },
    };
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = env.NEXT_PUBLIC_APP_URL;
  const payload = await getPayload({ config });

  const posts = await payload.find({
    collection: "posts",
    where: { status: { equals: "published" } },
    limit: 1000,
    sort: "-date",
  });

  const categories = await payload.find({
    collection: "categories",
    limit: 100,
  });

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    ...localizedEntry(baseUrl, "/", { changeFrequency: "daily", priority: 1 }),
    ...localizedEntry(baseUrl, "/blog", { changeFrequency: "daily", priority: 0.8 }),
    ...localizedEntry(baseUrl, "/privacy-policy", { changeFrequency: "monthly", priority: 0.3 }),
    ...localizedEntry(baseUrl, "/terms-of-service", { changeFrequency: "monthly", priority: 0.3 }),
  ];

  // Blog posts
  const postEntries: MetadataRoute.Sitemap = posts.docs.flatMap(post =>
    localizedEntry(baseUrl, `/blog/${post.slug}`, {
      lastModified: post.updatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    })
  );

  // Categories
  const categoryEntries: MetadataRoute.Sitemap = categories.docs.flatMap(category =>
    localizedEntry(baseUrl, `/blog/category/${(category as any).slug}`, {
      lastModified: category.updatedAt,
      changeFrequency: "monthly",
      priority: 0.5,
    })
  );

  return [...staticPages, ...postEntries, ...categoryEntries];
}
