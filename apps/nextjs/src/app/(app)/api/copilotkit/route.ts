import type { NextRequest } from "next/server";
import { env } from "@/env";
import { auth } from "@/server/auth/auth";
import {
  CopilotRuntime,
  copilotRuntimeNextJSAppRouterEndpoint,
  ExperimentalEmptyAdapter,
  LangGraphHttpAgent,
} from "@copilotkit/runtime";

import { DbAgentRunner } from "@/lib/copilotkit/db-agent-runner";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

const serviceAdapter = new ExperimentalEmptyAdapter();

export const POST = async (req: NextRequest) => {
  const tokenResponse = await auth.api.getToken({ headers: req.headers });
  const headers: Record<string, string> = tokenResponse.token
    ? { Authorization: `Bearer ${tokenResponse.token}` }
    : {};

  // Pass the UI locale to the backend so the agent responds in the correct language.
  const locale = req.cookies.get("NEXT_LOCALE")?.value ?? "en";
  headers["X-Locale"] = locale;

  const runtime = new CopilotRuntime({
    runner: new DbAgentRunner(),
    agents: {
      agent: new LangGraphHttpAgent({
        url: `${env.BACKEND_API_URL}/copilotkit/agent`,
        headers,
      }),
    },
  });

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};
