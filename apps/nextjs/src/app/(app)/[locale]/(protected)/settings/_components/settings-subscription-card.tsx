"use client";

import { authClient } from "@/server/auth/auth-client";
import type { CustomerStateSubscription } from "@polar-sh/sdk/models/components/customerstatesubscription.js";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

interface SettingsSubscriptionCardProps {
  subscription?: CustomerStateSubscription;
}

export function SettingsSubscriptionCard({ subscription }: SettingsSubscriptionCardProps) {
  const t = useTranslations("dashboard.settings.subscription");

  const handleManageSubscription = async () => {
    try {
      await authClient.customer.portal();
    } catch (error) {
      console.error("Failed to open customer portal:", error);
      toast.error(t("managementFailed"));
    }
  };

  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return t("unknown");
    try {
      const date = typeof dateString === "string" ? new Date(dateString) : dateString;
      return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return t("unknown");
    }
  };

  const planName = subscription?.product?.name ?? t("title");
  const interval =
    subscription?.recurringInterval === "month"
      ? t("price.month")
      : subscription?.recurringInterval === "year"
        ? t("price.year")
        : null;

  return (
    <div className="flex items-start justify-between gap-6 py-2">
      <div className="flex items-start gap-4">
        <div className="bg-muted flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground h-6 w-6"
          >
            <path d="M12 2a7 7 0 0 1 7 7c0 4-3 6-3 9H8c0-3-3-5-3-9a7 7 0 0 1 7-7z" />
            <path d="M9 17h6" />
            <path d="M9 21h6" />
          </svg>
        </div>
        <div>
          <p className="text-base font-semibold">{planName}</p>
          {interval && <p className="text-muted-foreground text-sm capitalize">{interval}</p>}
          {subscription?.currentPeriodEnd && (
            <p className="text-muted-foreground text-sm">
              {t("renews.autoRenew", {
                date: formatDate(subscription.currentPeriodEnd),
                defaultMessage: `Your subscription will auto renew on ${formatDate(subscription.currentPeriodEnd)}.`,
              })}
            </p>
          )}
          {!subscription && <p className="text-muted-foreground text-sm">{t("noSubscription")}</p>}
        </div>
      </div>
      <Button variant="outline" onClick={handleManageSubscription} className="shrink-0">
        {t("manageButton")}
      </Button>
    </div>
  );
}
