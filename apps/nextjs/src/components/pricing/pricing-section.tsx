import { Suspense } from "react";

import { PlansGrid } from "./plans-grid";
import { PlansLoading } from "./plans-loading";

// import { PricingBillingToggle } from "./pricing-billing-toggle";

interface PricingSectionProps {
  title?: string;
  subtitle?: string;
}

export function PricingSection({ title = "Plans", subtitle }: PricingSectionProps) {
  return (
    <section id="pricing" className="bg-muted/50 w-full py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="relative mx-auto w-full max-w-5xl">
          {/* Header */}
          <div className="animate-fade-in-up mb-8 flex w-full flex-col items-center gap-2 text-center md:mb-12">
            <h2 className="text-foreground text-3xl font-semibold md:text-4xl lg:text-5xl">
              {title}
            </h2>
            {subtitle && (
              <p className="text-muted-foreground mt-2 max-w-2xl text-base leading-relaxed md:text-lg">
                {subtitle}
              </p>
            )}
          </div>

          {/* Billing Toggle */}
          {/* <PricingBillingToggle /> */}

          {/* Plans with Suspense */}
          <div className="animate-fade-in-up [animation-delay:150ms]">
            <Suspense fallback={<PlansLoading />}>
              <PlansGrid />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}
