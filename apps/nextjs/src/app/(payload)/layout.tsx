import { ReactNode } from "react";
import { headers } from "next/headers";

/**
 * Payload admin and API routes must not be statically generated at build time
 * (they require DB/config). Calling headers() opts this segment into dynamic rendering.
 */
export const dynamic = "force-dynamic";

export default async function PayloadLayout({ children }: { children: ReactNode }) {
  // Force dynamic rendering by calling headers()
  await headers();
  return <>{children}</>;
}
