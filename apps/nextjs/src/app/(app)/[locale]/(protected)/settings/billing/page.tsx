import { headers } from "next/headers";
import { auth } from "@/server/auth/auth";
import type { CustomerStateSubscription } from "@polar-sh/sdk/models/components/customerstatesubscription.js";

import { SettingsBillingSection } from "../_components/settings-billing-section";
import { SettingsSubscriptionCard } from "../_components/settings-subscription-card";

export default async function SettingsBillingPage() {
  const headersList = await headers();

  await auth.api.getSession({ headers: headersList });

  let activeSubscription: CustomerStateSubscription | undefined;
  try {
    const state = await auth.api.state({ headers: headersList });
    activeSubscription = state.activeSubscriptions?.[0];
  } catch (error) {
    console.warn("Failed to fetch customer state:", error);
  }

  return (
    <div className="divide-border divide-y">
      <div className="pb-6">
        <SettingsSubscriptionCard subscription={activeSubscription} />
      </div>
      <div className="py-6">
        <SettingsBillingSection />
      </div>
    </div>
  );
}
