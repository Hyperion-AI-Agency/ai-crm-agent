"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { env } from "@/env";
import { RefreshRouteOnSave as PayloadLivePreview } from "@payloadcms/live-preview-react";

export const RefreshRouteOnSave: React.FC = () => {
  const router = useRouter();

  return (
    <PayloadLivePreview refresh={() => router.refresh()} serverURL={env.NEXT_PUBLIC_PAYLOAD_URL} />
  );
};
