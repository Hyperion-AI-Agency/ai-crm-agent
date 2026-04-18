import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchPage } from "@/actions/fetch-page";
import { getLocale } from "next-intl/server";

import { pageMetadata } from "@/lib/seo/metadata";
import { BlocksRenderer } from "@/components/content/blocks-renderer";

export const dynamic = "force-dynamic";

interface CmsPageProps {
  params: Promise<{ locale: string; slug: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params, searchParams }: CmsPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const sp = await searchParams;
  const pageSlug = slug.join("/");
  const page = await fetchPage({ slug: pageSlug, locale, draft: Boolean(sp.isLivePreview) });

  if (!page) return {};

  return pageMetadata({
    locale,
    title: page.title,
    description: "",
    internalPath: `/${pageSlug}`,
  });
}

export default async function CmsPage({ params, searchParams }: CmsPageProps) {
  const { slug } = await params;
  const sp = await searchParams;
  const locale = await getLocale();
  const pageSlug = slug.join("/");

  const page = await fetchPage({ slug: pageSlug, locale, draft: Boolean(sp.isLivePreview) });

  if (!page) {
    notFound();
  }

  return (
    <main>
      <BlocksRenderer locale={locale} blocks={page.layout} searchParams={sp} />
    </main>
  );
}
