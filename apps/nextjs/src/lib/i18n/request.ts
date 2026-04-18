import { getRequestConfig } from "next-intl/server";

import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale)) {
    locale = routing.defaultLocale;
  }
  return {
    locale,
    messages: {
      metadata: (await import(`@/lib/i18n/messages/${locale}/metadata.json`)).default,
      common: (await import(`@/lib/i18n/messages/${locale}/common.json`)).default,
      auth: (await import(`@/lib/i18n/messages/${locale}/auth.json`)).default,
      dashboard: (await import(`@/lib/i18n/messages/${locale}/dashboard.json`)).default,
      chat: (await import(`@/lib/i18n/messages/${locale}/chat.json`)).default,
      userView: (await import(`@/lib/i18n/messages/${locale}/userView.json`)).default,
    },
  };
});
