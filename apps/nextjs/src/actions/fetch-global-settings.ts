"use server";

import { unstable_cache } from "next/cache";
import { env } from "@/env";
import config from "@payload-config";
import { getPayload } from "payload";

export async function fetchGlobalSettings(locale: string) {
  return unstable_cache(
    async () => {
      const payload = await getPayload({ config });
      return await payload.findGlobal({
        slug: "global-settings",
        locale: locale as "lt" | "en",
        fallbackLocale: env.NEXT_PUBLIC_DEFAULT_LOCALE,
        depth: 1,
      });
    },
    [`global-settings-${locale}`],
    {
      tags: ["global_global-settings"],
      revalidate: 3600,
    }
  )();
}
