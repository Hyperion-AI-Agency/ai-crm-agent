"use client";

import { AudioLines, Mic, Plus, Send, Square } from "lucide-react";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ChatInputFieldProps {
  input: string;
  setInput: (value: string) => void;
  handleSend: () => void;
  isLoading: boolean;
  stopGeneration?: () => void;
  placeholder: string;
  showMicButton?: boolean;
  combineSendAndDictate?: boolean;
  autoFocus?: boolean;
}

export function ChatInputField({
  input,
  setInput,
  handleSend,
  isLoading,
  stopGeneration,
  placeholder,
  showMicButton = true,
  combineSendAndDictate = false,
  autoFocus = false,
}: ChatInputFieldProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-input bg-background relative flex items-center rounded-2xl border px-4 py-3 shadow-sm transition-shadow focus-within:shadow-md">
      <div className="flex w-full items-center gap-3">
        {/* Plus icon */}
        <div className="border-muted-foreground/30 flex h-5 w-5 items-center justify-center rounded-full border">
          <Plus className="text-muted-foreground h-3 w-3" />
        </div>

        {/* Input field */}
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={placeholder}
          disabled={isLoading}
          className="placeholder:text-muted-foreground flex-1 bg-transparent outline-none placeholder:opacity-50"
          autoFocus={autoFocus}
        />

        {/* Voice icons and Send button */}
        <div className="flex items-center gap-2">
          <TooltipProvider>
            {showMicButton && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-foreground p-1 transition-colors"
                  >
                    <Mic className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Voice input</p>
                </TooltipContent>
              </Tooltip>
            )}

            {combineSendAndDictate ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  {isLoading && stopGeneration ? (
                    <button
                      onClick={stopGeneration}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-lg p-1 transition-colors"
                    >
                      <Square className="h-4 w-4" />
                    </button>
                  ) : input.trim() ? (
                    <button
                      onClick={handleSend}
                      disabled={!input.trim()}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg p-1 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="bg-muted text-muted-foreground hover:bg-muted/80 rounded-lg p-1 transition-colors"
                    >
                      <AudioLines className="h-4 w-4" />
                    </button>
                  )}
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {isLoading && stopGeneration
                      ? "Stop generation"
                      : input.trim()
                        ? "Send message"
                        : "Dictate"}
                  </p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="text-muted-foreground hover:text-foreground p-1 transition-colors"
                    >
                      <AudioLines className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Dictate</p>
                  </TooltipContent>
                </Tooltip>

                {/* Send/Stop button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    {isLoading && stopGeneration ? (
                      <button
                        onClick={stopGeneration}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-lg p-1 transition-colors"
                      >
                        <Square className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        onClick={handleSend}
                        disabled={!input.trim()}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg p-1 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    )}
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isLoading && stopGeneration ? "Stop generation" : "Send message"}</p>
                  </TooltipContent>
                </Tooltip>
              </>
            )}
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
