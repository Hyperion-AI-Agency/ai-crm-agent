"use client";

import { useState } from "react";
import type { PlanItem } from "@/actions/fetch-all-plans";
import { authClient } from "@/server/auth/auth-client";
import { Info, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

interface PricingPlanCardProps {
  plan: PlanItem;
  isCurrentPlan?: boolean;
}

export function PricingPlanCard({ plan, isCurrentPlan = false }: PricingPlanCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("dashboard.pricing");

  const handlePlanClick = async () => {
    setIsLoading(true);
    try {
      await authClient.checkout({
        products: [plan.productKey],
      });
    } catch (error) {
      toast.error(t("checkoutError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`relative flex flex-col rounded-xl border p-4 shadow-sm md:p-6 ${
        isCurrentPlan ? "border-primary bg-blue-50" : "bg-background border-gray-200"
      }`}
    >
      {isCurrentPlan && (
        <div className="bg-primary text-primary-foreground absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-semibold">
          {t("currentPlan")}
        </div>
      )}
      {/* Plan Name */}
      <h3 className="text-foreground mb-1 text-xl font-semibold md:text-2xl">{plan.name}</h3>

      {/* Description */}
      <p className="text-foreground/70 mb-3 text-sm md:text-base">{plan.description}</p>

      {/* Price */}
      <div className="mb-3">
        <div className="flex items-baseline gap-2">
          <span className="text-foreground text-3xl font-semibold md:text-4xl">€{plan.price}</span>
        </div>
      </div>

      {/* CTA Button */}
      <Button
        variant="outline"
        onClick={handlePlanClick}
        disabled={isLoading || isCurrentPlan}
        className={`mb-4 w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 outline-none hover:scale-[1.02] hover:shadow-md focus:outline-none disabled:opacity-50 ${
          isCurrentPlan
            ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
            : "border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t("loading")}
          </>
        ) : isCurrentPlan ? (
          t("currentPlan")
        ) : (
          plan.cta
        )}
      </Button>

      {/* Features List */}
      <ul className="flex flex-col gap-2">
        {plan.features?.map((featureItem, index) => {
          const feature = typeof featureItem === "string" ? featureItem : featureItem.feature;
          return (
            <li key={index} className="text-foreground/70 flex items-start gap-2 text-sm">
              <span className="mt-0.5 text-green-600">✓</span>
              <span>{feature}</span>
              {feature.includes("kvotos") && <Info className="text-foreground/40 ml-1 h-4 w-4" />}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
