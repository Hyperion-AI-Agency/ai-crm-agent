"use client";

import { useCoAgent } from "@copilotkit/react-core";
import { useLocale } from "next-intl";

const AGENT_NAME = "agent";

interface AgentState {
  language?: string;
}

export function useChatAgent() {
  const locale = useLocale();

  const { state } = useCoAgent<AgentState>({
    name: AGENT_NAME,
    initialState: { language: locale },
  });

  return { agentName: AGENT_NAME, agentState: state };
}
