"use client";

import { useState } from "react";
import type { Message } from "@copilotkit/shared";
import { Check, Copy, RefreshCw, ThumbsDown, ThumbsUp } from "lucide-react";
import { useTranslations } from "next-intl";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ChatMessageBubbleProps {
  message: Message;
  messages?: Message[];
  userName?: string;
  onRegenerate?: (messageId: string) => void;
  isLoading?: boolean;
  isLastAssistant?: boolean;
  onSuggestionClick?: (suggestion: string) => void;
}

export function ChatMessageBubble({
  message,
  onRegenerate,
  isLoading,
  isLastAssistant,
}: ChatMessageBubbleProps) {
  const t = useTranslations("dashboard.chat");
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleCopy = async () => {
    const text = typeof message.content === "string" ? message.content : "";
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const renderMessage = () => {
    switch (message.role) {
      case "system":
      case "developer":
      case "tool":
        return null;

      case "user": {
        if (!message.content) return null;
        const rawContent =
          typeof message.content === "string" ? message.content : "";
        return (
          <div className="flex w-full flex-col items-end gap-2">
            {rawContent && (
              <div className="max-w-[85%] rounded-2xl bg-secondary px-4 py-3 text-secondary-foreground shadow-sm sm:max-w-[80%]">
                <div className="text-base break-words whitespace-pre-wrap">
                  {rawContent}
                </div>
              </div>
            )}
          </div>
        );
      }

      case "assistant": {
        if (!message.content) return null;
        return (
          <div
            className="-mx-3 flex w-[calc(100%+1.5rem)] flex-col gap-1 rounded-xl px-3 pt-3 pb-1"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="text-foreground prose dark:prose-invert min-h-[1.5em] max-w-none text-[17px] leading-relaxed break-words [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
              <Markdown remarkPlugins={[remarkGfm]}>
                {typeof message.content === "string" ? message.content : ""}
              </Markdown>
            </div>
            <div
              className={`text-muted-foreground flex items-center gap-0.5 transition-opacity duration-200 ${
                !isLoading && (isHovered || isLastAssistant)
                  ? "opacity-100"
                  : "pointer-events-none opacity-0"
              }`}
            >
              <TooltipProvider delayDuration={400}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      aria-label="Regenerate"
                      onClick={() => onRegenerate?.(message.id)}
                    >
                      <RefreshCw className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t("regenerate")}</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      aria-label={copied ? "Copied" : "Copy"}
                      onClick={handleCopy}
                    >
                      {copied ? (
                        <Check className="size-4" />
                      ) : (
                        <Copy className="size-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {copied ? t("copied") : t("copy")}
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 ${feedback === "up" ? "text-foreground" : ""}`}
                      aria-label="Good response"
                      onClick={() =>
                        setFeedback((f) => (f === "up" ? null : "up"))
                      }
                    >
                      <ThumbsUp className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t("goodResponse")}</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 ${feedback === "down" ? "text-foreground" : ""}`}
                      aria-label="Bad response"
                      onClick={() =>
                        setFeedback((f) => (f === "down" ? null : "down"))
                      }
                    >
                      <ThumbsDown className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t("badResponse")}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return <>{renderMessage()}</>;
}
