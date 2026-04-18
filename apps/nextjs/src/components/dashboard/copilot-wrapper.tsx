"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { env } from "@/env";
import { CopilotKit } from "@copilotkit/react-core";

interface Props {
  children: ReactNode;
  threadId?: string;
}

export function DashboardCopilotWrapper({ children, threadId }: Props) {
  return (
    <CopilotKit
      runtimeUrl="/api/copilotkit"
      publicApiKey={env.NEXT_PUBLIC_COPILOTKIT_PUBLIC_LICENSE_KEY}
      agent="agent"
      threadId={threadId}
      showDevConsole={env.NEXT_PUBLIC_NODE_ENV === "development"}
    >
      {children}
    </CopilotKit>
  );
}
