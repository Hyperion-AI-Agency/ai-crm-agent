"use client";

import type { Message } from "@copilotkit/shared";
import { useTranslations } from "next-intl";

import { ChatMessageBubble } from "./chat-message-bubble";
import { ChatThinkingIndicator } from "./chat-thinking-indicator";

interface ChatMessagesViewProps {
  messages: Message[];
  isLoading: boolean;
  isThinking?: boolean;
  userName?: string;
  onSuggestionClick?: (suggestion: string) => void;
}

type AssistantMessageWithToolCalls = Message & {
  toolCalls?: { id: string; type: "function"; function: { name: string; arguments: string } }[];
};

const TOOL_STATUS_KEYS: Record<string, string> = {
  generate_profile: "toolGeneratingProfile",
  web_search: "toolSearchingWeb",
};

/** Find the active tool call when the agent is executing a tool call. */
function getActiveToolCall(messages: Message[]): { name: string; args: string } | undefined {
  // Walk backwards to find the last assistant message with toolCalls
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (msg?.role === "assistant") {
      const assistantMsg = msg as AssistantMessageWithToolCalls;
      if (assistantMsg.toolCalls?.length) {
        const last = assistantMsg.toolCalls[assistantMsg.toolCalls.length - 1];
        return last ? { name: last.function.name, args: last.function.arguments } : undefined;
      }
      return undefined;
    }
    // If there's a non-tool message before we find an assistant, stop
    if (msg?.role === "user") return undefined;
  }
  return undefined;
}

export function ChatMessagesView({
  messages,
  isLoading,
  isThinking,
  userName,
  onSuggestionClick,
}: ChatMessagesViewProps) {
  const t = useTranslations("dashboard.chat");
  // Find the last assistant message with actual content (skip empty tool-call-only messages)
  const lastAssistant = [...messages].reverse().find(m => m.role === "assistant" && m.content);

  // Show tool status when loading and agent is executing a tool call
  const lastMessage = messages.length > 0 ? messages[messages.length - 1] : undefined;
  const lastMsgHasToolCalls =
    lastMessage?.role === "assistant" &&
    !!(lastMessage as AssistantMessageWithToolCalls).toolCalls?.length;

  // Also detect when present_profile is streaming (assistant msg after a tool msg with profile data)
  const secondLastMessage = messages.length > 1 ? messages[messages.length - 2] : undefined;
  const isPresentingProfile =
    isLoading &&
    lastMessage?.role === "assistant" &&
    !lastMessage.content &&
    secondLastMessage?.role === "tool";

  const isToolRunning =
    isLoading && (lastMessage?.role === "tool" || lastMsgHasToolCalls || isPresentingProfile);
  const activeToolCall = isToolRunning ? getActiveToolCall(messages) : undefined;
  const toolStatusKey = activeToolCall
    ? (TOOL_STATUS_KEYS[activeToolCall.name] ?? "toolAnalysing")
    : isPresentingProfile
      ? "toolGeneratingProfile"
      : "toolAnalysing";

  // Extract search query for web_search tool
  let searchQuery: string | undefined;
  if (activeToolCall?.name === "web_search") {
    try {
      searchQuery = (JSON.parse(activeToolCall.args) as { query?: string }).query;
    } catch {
      /* ignore parse errors */
    }
  }

  return (
    <>
      {messages.map(message => (
        <ChatMessageBubble
          key={message.id}
          message={message}
          messages={messages}
          userName={userName}
          isLoading={isLoading}
          isLastAssistant={message.role === "assistant" && message.id === lastAssistant?.id}
          onSuggestionClick={onSuggestionClick}
        />
      ))}

      {isToolRunning && (
        <div className="flex items-center gap-2 py-2">
          <span className="relative flex h-2 w-2">
            <span className="bg-foreground/60 absolute inline-flex h-2 w-2 animate-ping rounded-full opacity-75" />
            <span className="bg-foreground/60 relative inline-flex h-2 w-2 rounded-full" />
          </span>
          <span className="text-foreground/80 text-base">
            {t(toolStatusKey)}
            {searchQuery && (
              <span className="text-muted-foreground ml-1 italic">&ldquo;{searchQuery}&rdquo;</span>
            )}
          </span>
        </div>
      )}

      {isThinking && !isToolRunning && <ChatThinkingIndicator />}
    </>
  );
}
