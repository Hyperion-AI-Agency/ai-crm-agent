import { Suspense } from "react";
import { getTranslations } from "next-intl/server";

import { PlansGrid } from "@/components/pricing/plans-grid";
import { PlansLoading } from "@/components/pricing/plans-loading";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function SubscriptionPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "dashboard.pricing" });

  return (
    <div className="flex flex-1 flex-col items-center overflow-auto px-4 py-12">
      <div className="w-full max-w-5xl">
        <div className="mb-8 flex w-full flex-col items-center gap-2 text-center md:mb-12">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl dark:text-white">
            {t("title")}
          </h2>
        </div>

        <Suspense fallback={<PlansLoading />}>
          <PlansGrid locale={locale} />
        </Suspense>
      </div>
    </div>
  );
}
