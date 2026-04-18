"use server";

import { env } from "@/env";
import config from "@payload-config";
import { getLocale } from "next-intl/server";
import { getPayload } from "payload";

import type { Plan } from "@/types/payload-types";

export type PlanItem = NonNullable<Plan["plans"]>[number];

export async function fetchAllPlans(localeParam?: string): Promise<PlanItem[]> {
  const payload = await getPayload({ config });
  const locale = localeParam ?? (await getLocale());

  const plansData = (await payload.findGlobal({
    slug: "plans",
    locale: locale as "lt" | "en" | "all" | undefined,
    fallbackLocale: env.NEXT_PUBLIC_DEFAULT_LOCALE,
    depth: 2,
  })) as Plan | null;

  if (!plansData?.plans) {
    return [];
  }

  // Sort plans by sortOrder, then filter active ones
  const sortedPlans = [...plansData.plans]
    .filter(plan => plan.isActive !== false)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  return sortedPlans;
}
