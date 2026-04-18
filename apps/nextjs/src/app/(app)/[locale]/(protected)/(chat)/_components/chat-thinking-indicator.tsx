"use client";

import { useTranslations } from "next-intl";

export function ChatThinkingIndicator() {
  const t = useTranslations("dashboard.chat");

  return (
    <div className="flex justify-start">
      <div className="text-foreground/80 flex items-center space-x-2 text-base">
        <span className="relative flex h-2 w-2">
          <span className="bg-foreground/60 absolute inline-flex h-2 w-2 animate-ping rounded-full opacity-75"></span>
          <span className="bg-foreground/60 relative inline-flex h-2 w-2 rounded-full"></span>
        </span>
        <span>{t("thinking")}</span>
      </div>
    </div>
  );
}
