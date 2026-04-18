"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

const EXEMPT_SEGMENTS = ["/settings", "/subscription"];

export function SubscriptionGuard({
  hasSubscription,
  children,
}: {
  hasSubscription: boolean;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const isExempt = EXEMPT_SEGMENTS.some(seg => pathname.includes(seg));
  const shouldBlock = !hasSubscription && !isExempt;

  useEffect(() => {
    if (shouldBlock) {
      const locale = pathname.split("/")[1];
      router.replace(`/${locale}/subscription`);
    }
  }, [shouldBlock, pathname, router]);

  if (shouldBlock) return null;

  return <>{children}</>;
}
