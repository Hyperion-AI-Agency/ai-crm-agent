import type { Metadata } from "next";

import { Toaster } from "@/components/ui/sonner";
import { CookieManagerProvider } from "@/components/providers/cookie-manager";
import { ThemeProvider } from "@/components/providers/provider";

import "@/styles/globals.css";

import { notFound } from "next/navigation";
import { TRPCReactProvider } from "@/server/trpc/client";
import { Analytics } from "@vercel/analytics/next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";

import { routing } from "@/lib/i18n/routing";
import { rootLayoutMetadata } from "@/lib/seo/metadata";
import { AnalyticsProvider } from "@/components/providers/posthog-provider";

// Force dynamic rendering for all routes - prevents DB calls during build
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return rootLayoutMetadata(locale, t("name"), t("description"));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Readonly<Props>) {
  const { locale } = await params;

  // Validate locale - if not a valid locale, return 404
  if (!routing.locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider attribute="class" forcedTheme="light" disableTransitionOnChange>
            <AnalyticsProvider>
              <CookieManagerProvider>
                <TRPCReactProvider>{children}</TRPCReactProvider>
              </CookieManagerProvider>
            </AnalyticsProvider>
            <Toaster />
            <Analytics />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
