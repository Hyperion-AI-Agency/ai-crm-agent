import { headers } from "next/headers";
import Link from "next/link";
import { fetchAllPlans } from "@/actions/fetch-all-plans";
import { auth } from "@/server/auth/auth";
import { getLocale, getTranslations } from "next-intl/server";

import { PricingPlanCard } from "@/components/pricing/pricing-plan-card";

interface PlansGridProps {
  locale?: string;
}

export async function PlansGrid({ locale: localeProp }: PlansGridProps) {
  const locale = localeProp ?? (await getLocale());
  const plans = await fetchAllPlans(locale);
  const t = await getTranslations({ locale, namespace: "dashboard.pricing" });

  // Get customer state with error handling
  let activeSubscriptions: Array<{ productId: string }> = [];
  try {
    const state = await auth.api.state({
      headers: await headers(),
    });
    activeSubscriptions = state.activeSubscriptions || [];
  } catch (error) {
    // Customer might not exist in Polar yet or there's an API error
    // Continue without highlighting current plan
    console.warn("Failed to fetch customer state for plans grid:", JSON.stringify(error, null, 2));
  }

  return (
    <>
      {/* Plans Grid */}
      <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
        {plans.map(plan => {
          const isCurrentPlan = activeSubscriptions.some(
            subscription => subscription.productId === plan.productKey
          );
          return <PricingPlanCard key={plan.key} plan={plan} isCurrentPlan={isCurrentPlan} />;
        })}
      </div>

      {/* Contact Link */}
      <div className="mt-12 text-center">
        <p className="text-sm text-gray-600 md:text-base">
          {t("cantFindPlan")}{" "}
          <Link
            href="mailto:profailingo.mokymai@gmail.com"
            className="text-primary font-semibold hover:underline"
          >
            {t("contactUs")}
          </Link>
        </p>
      </div>
    </>
  );
}
