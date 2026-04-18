"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCopilotChatHeadless_c } from "@copilotkit/react-core";
import { useTranslations } from "next-intl";

import { useTrackEvent } from "@/hooks/use-track-event";

import { ChatInput } from "./chat-input";
import { ChatMessagesSkeleton } from "./chat-messages-skeleton";
import { ChatMessagesView } from "./chat-messages-view";
import { useChatAgent } from "./hooks/use-chat-agent";
import { ThreadHeader } from "./thread-header";

export interface ThreadChatProps {
  threadId: string;
}

export function ThreadChat({ threadId }: ThreadChatProps) {
  const t = useTranslations("dashboard.chat");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialMessage = searchParams.get("initialMessage");

  const { messages, sendMessage, isLoading, stopGeneration } = useCopilotChatHeadless_c();

  const [input, setInput] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialMessageSentRef = useRef(false);
  const pendingInitialRef = useRef<string | null>(null);
  const sendMessageRef = useRef(sendMessage);
  sendMessageRef.current = sendMessage;

  useChatAgent();
  const { trackEvent, POSTHOG_EVENTS } = useTrackEvent();

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      void sendMessage({
        id: Date.now().toString(),
        role: "user",
        content: suggestion,
      });
    },
    [sendMessage]
  );

  // Auto-scroll when user is near bottom
  useEffect(() => {
    const el = messagesEndRef.current?.parentElement?.parentElement;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 150;
    if (nearBottom) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  // Send pending message once then clear.
  useEffect(() => {
    if (initialMessageSentRef.current) return;

    const sessionKey = `pending-message-${threadId}`;
    const pending = sessionStorage.getItem(sessionKey) ?? initialMessage;
    if (!pending) return;
    initialMessageSentRef.current = true;
    sessionStorage.removeItem(sessionKey);
    void sendMessageRef.current({ id: crypto.randomUUID(), role: "user", content: pending });
    if (initialMessage) router.replace(pathname);
  }, [threadId, initialMessage, pathname, router]);

  const handleSend = useCallback(() => {
    const content = input.trim();
    if (!content || isLoading) return;

    trackEvent(POSTHOG_EVENTS.CHAT_MESSAGE_SENT, { thread_id: threadId });

    setInput("");
    setAttachedFiles([]);

    void sendMessageRef.current({
      id: Date.now().toString(),
      role: "user",
      content,
    });
  }, [input, isLoading, trackEvent, POSTHOG_EVENTS, threadId]);

  // Optimistic initial message display
  if (initialMessage) pendingInitialRef.current = initialMessage;
  if (messages.length > 0) pendingInitialRef.current = null;
  const pendingMessage = initialMessage ?? pendingInitialRef.current;
  const showOptimisticAndSkeleton = messages.length === 0 && pendingMessage;

  // Show stop button whenever the agent is processing (including tool calls)
  const lastRole =
    messages.length > 0 ? (messages[messages.length - 1] as { role?: string }).role : undefined;
  const isActivelyGenerating = isLoading && messages.length > 0;

  return (
    <div className="dark:bg-background flex h-full w-full flex-col bg-[#F7F7F7]">
      <ThreadHeader threadId={threadId} messages={messages} />
      <div className="flex-1 overflow-y-auto" style={{ overflowAnchor: "none" }}>
        <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
          {showOptimisticAndSkeleton ? (
            <>
              <div className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl bg-secondary px-4 py-3 text-secondary-foreground shadow-sm">
                  <div className="text-base break-words whitespace-pre-wrap">{pendingMessage}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="bg-foreground/60 absolute inline-flex h-2 w-2 animate-ping rounded-full opacity-75" />
                  <span className="bg-foreground/60 relative inline-flex h-2 w-2 rounded-full" />
                </span>
                <span className="text-foreground/80 text-base">{t("thinking")}</span>
              </div>
            </>
          ) : messages.length === 0 ? (
            <ChatMessagesSkeleton />
          ) : (
            <>
              <ChatMessagesView
                messages={messages}
                isLoading={isLoading}
                userName={undefined}
                isThinking={isLoading && messages.length > 0}
                onSuggestionClick={handleSuggestionClick}
              />
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="shrink-0">
        <ChatInput
          input={input}
          setInput={setInput}
          handleSend={handleSend}
          isLoading={isLoading}
          stopGeneration={isActivelyGenerating ? stopGeneration : undefined}
          disabled={messages.length === 0}
          attachedFiles={attachedFiles}
          onAttachedFileChange={setAttachedFiles}
          onVoiceMode={undefined}
        />
      </div>
    </div>
  );
}
