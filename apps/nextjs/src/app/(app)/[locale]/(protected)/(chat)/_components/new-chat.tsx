"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";

import { useTrackEvent } from "@/hooks/use-track-event";

import { ChatInput } from "./chat-input";
import { truncateSubject } from "./chat-utils";
import { useChatAgent } from "./hooks/use-chat-agent";
import { useCreateThread } from "./hooks/use-create-thread";

export function NewChat() {
  const t = useTranslations("dashboard.chat");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMessage = searchParams.get("initialMessage");

  const [input, setInput] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const createThread = useCreateThread();
  const { trackEvent, POSTHOG_EVENTS } = useTrackEvent();

  useChatAgent();

  // Pre-fill input from ?initialMessage
  useEffect(() => {
    if (initialMessage) setInput(initialMessage);
  }, [initialMessage]);

  const handleSend = useCallback(() => {
    const content = input.trim();
    if (!content || createThread.isPending) return;

    trackEvent(POSTHOG_EVENTS.CHAT_CONVERSATION_STARTED);

    const filesToProcess = [...attachedFiles];
    setAttachedFiles([]);

    void (async () => {
      const thread = await createThread.mutateAsync({ subject: truncateSubject(content) });
      sessionStorage.setItem(`pending-message-${thread.id}`, content);
      router.replace(`/${locale}/chat/${thread.id}`);
    })();
  }, [input, locale, router, createThread, trackEvent, POSTHOG_EVENTS]);

  return (
    <div className="relative h-full w-full">
      <div className="dark:bg-background flex h-full w-full flex-col justify-center overflow-y-auto bg-[#F7F7F7]">
        {/* Greeting */}
        <motion.div
          className="flex justify-center px-4 pt-8 pb-2"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <h1 className="dark:text-foreground text-foreground font-serif text-2xl font-medium tracking-tight md:text-3xl">
            {t("newChatTitle")}
          </h1>
        </motion.div>

        {/* Input */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.08, ease: "easeOut" }}
        >
          <ChatInput
            input={input}
            setInput={setInput}
            handleSend={handleSend}
            isLoading={createThread.isPending}
            placeholder={t("inputPlaceholderWrite")}
            showDisclaimer={false}
            attachedFiles={attachedFiles}
            onAttachedFileChange={setAttachedFiles}
          />
        </motion.div>

      </div>
    </div>
  );
}
