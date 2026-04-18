import "@/styles/globals.css";
import "@/styles/payload-custom.css";

import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

import { defaultLocale } from "@/lib/i18n/routing";
import { AuthSidePanel } from "@/components/auth/auth-side-panel";
import { BackButton } from "@/components/navbar/back-button";
import { ThemeProvider } from "@/components/providers/provider";

// Force dynamic rendering - Payload admin auth layout
export const dynamic = "force-dynamic";

export default async function AuthLayout({ children }: { children: ReactNode }) {
  const messages = await getMessages({ locale: defaultLocale });

  return (
    <NextIntlClientProvider locale={defaultLocale} messages={messages}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange
      >
        <div className="bg-background relative flex min-h-screen text-base">
          {/* Side Panel - Desktop only */}
          <AuthSidePanel
            title="Admin Panel"
            description="This is the administrative authentication panel. Please sign in with your admin credentials to access the content management system."
            bgColor="red"
          />

          {/* Main Content */}
          <div className="flex flex-1 flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6">
              <BackButton />
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
              {children}
            </div>
          </div>
        </div>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
