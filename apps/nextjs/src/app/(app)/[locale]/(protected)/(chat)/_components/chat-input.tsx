"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, FileUp, Mic, Plus, Square, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { getFileExtension, IMAGE_EXTENSIONS } from "./chat-utils";

function AttachedFilePreview({
  file,
  onRemove,
  disabled,
  removeLabel,
}: {
  file: File;
  onRemove: () => void;
  disabled: boolean;
  removeLabel: string;
}) {
  const ext = getFileExtension(file.name);
  const isImage = IMAGE_EXTENSIONS.has(ext);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!isImage) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file, isImage]);

  if (isImage && previewUrl) {
    return (
      <div className="group relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={previewUrl}
          alt={file.name}
          className="h-20 w-20 rounded-lg border border-[#E2E8F0] object-cover shadow-sm"
        />
        <button
          type="button"
          onClick={onRemove}
          disabled={disabled}
          className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 disabled:opacity-50"
          aria-label={removeLabel}
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    );
  }

  return (
    <div className="group bg-muted/50 dark:bg-muted relative flex w-40 flex-col rounded-xl border border-[#E2E8F0] p-3 shadow-sm">
      <span
        className="dark:text-foreground min-h-10 truncate px-0.5 text-xs break-words text-[#2C3E50]"
        title={file.name}
      >
        {file.name}
      </span>
      <span className="text-muted-foreground dark:bg-muted mt-2 shrink-0 self-start rounded bg-[#E8EEF4] px-1.5 py-0.5 text-[10px] font-medium">
        {ext}
      </span>
      <button
        type="button"
        onClick={onRemove}
        disabled={disabled}
        className="dark:text-muted-foreground hover:bg-muted hover:text-foreground absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded text-[#64748B] opacity-0 transition-opacity group-hover:opacity-100 disabled:opacity-50"
        aria-label={removeLabel}
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSend: () => void;
  isLoading: boolean;
  stopGeneration?: () => void;
  placeholder?: string;
  showDisclaimer?: boolean;
  /** When true, disables textarea and attachments (e.g. while thread messages are loading). */
  disabled?: boolean;
  /** Currently attached files to show in the input. */
  attachedFiles?: File[];
  /** Called when user selects or removes attached files. */
  onAttachedFileChange?: (files: File[]) => void;
  /** @deprecated Use onAttachedFileChange instead. */
  onFileSelect?: (file: File) => void;
  /** Callback to toggle voice mode. */
  onVoiceMode?: () => void;
}

export function ChatInput({
  input,
  setInput,
  handleSend,
  isLoading,
  stopGeneration,
  placeholder,
  showDisclaimer = true,
  disabled = false,
  attachedFiles = [],
  onAttachedFileChange,
  onFileSelect,
  onVoiceMode,
}: ChatInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const t = useTranslations("dashboard.chat");
  const resolvedPlaceholder = placeholder ?? t("inputReplyPlaceholder");

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    // Temporarily disable transition so we can measure scrollHeight at auto
    el.style.transition = "none";
    el.style.height = "auto";
    const target = Math.max(40, el.scrollHeight);
    el.style.height = el.offsetHeight + "px";
    // Force reflow, then animate to target
    void el.offsetHeight;
    el.style.transition = "";
    el.style.height = target + "px";
  };

  useEffect(() => {
    autoResize();
  }, [input, resolvedPlaceholder]);

  const handleFilesAdd = (newFiles: FileList | null) => {
    if (!newFiles?.length) return;
    const list = Array.from(newFiles);
    list.forEach(f => onFileSelect?.(f));
    onAttachedFileChange?.([...(attachedFiles ?? []), ...list]);
  };

  const handleFileRemove = (index: number) => {
    const next = (attachedFiles ?? []).filter((_, i) => i !== index);
    onAttachedFileChange?.(next);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        handleSend();
      }
    }
  };

  const isInputDisabled = disabled;

  return (
    <div className="dark:bg-background w-full bg-[#F7F7F7]">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".txt,.md,.pdf,.docx,.png,.jpg,.jpeg,.gif,.webp"
        multiple
        onChange={e => {
          handleFilesAdd(e.target.files);
          e.target.value = "";
        }}
        aria-hidden
      />
      <div className="mx-auto max-w-3xl px-4 py-6">
        <div
          className={
            "dark:border-input dark:bg-muted/30 flex flex-col gap-2 rounded-2xl border border-[#E2E8F0] bg-white py-2.5 pr-3 pl-3 shadow-sm" +
            (disabled ? " opacity-70" : "")
          }
        >
          <AnimatePresence initial={false}>
            {attachedFiles.length > 0 && (
              <motion.div
                key="files-row"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                className="flex flex-wrap gap-2 overflow-hidden"
              >
                <AnimatePresence initial={false}>
                  {attachedFiles.map((file, index) => (
                    <motion.div
                      key={`${file.name}-${file.size}-${file.lastModified}`}
                      initial={{ opacity: 0, scale: 0.75 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.75 }}
                      transition={{ duration: 0.18, ease: [0.34, 1.56, 0.64, 1] }}
                    >
                      <AttachedFilePreview
                        file={file}
                        onRemove={() => handleFileRemove(index)}
                        disabled={isInputDisabled}
                        removeLabel={t("removeFile")}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  disabled={isLoading || disabled}
                  className="dark:text-foreground dark:hover:bg-muted flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#2C3E50] hover:bg-[#E8EEF4] disabled:opacity-50 disabled:hover:bg-transparent"
                  aria-label={t("addAttachment")}
                >
                  <Plus className="h-5 w-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" side="top">
                <DropdownMenuItem onSelect={() => fileInputRef.current?.click()} className="gap-2">
                  <FileUp className="h-4 w-4" />
                  {t("uploadFile")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={resolvedPlaceholder}
              disabled={isInputDisabled}
              rows={1}
              className="dark:placeholder:text-muted-foreground min-h-[40px] flex-1 resize-none overflow-hidden bg-transparent py-2.5 text-base leading-5 transition-[height] duration-200 ease-out outline-none placeholder:text-[#94A3B8] disabled:cursor-not-allowed"
              style={{ maxHeight: "200px" }}
            />
            <AnimatePresence mode="wait">
              {isLoading && stopGeneration ? (
                <motion.div
                  key="stop"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
                  className="shrink-0"
                >
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="h-9 w-9 rounded-lg border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
                    onClick={stopGeneration}
                    aria-label={t("stopGeneration")}
                  >
                    <Square className="h-3.5 w-3.5 fill-current" />
                  </Button>
                </motion.div>
              ) : input.trim() && !isLoading ? (
                <motion.div
                  key="send"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
                  className="shrink-0"
                >
                  <Button
                    type="button"
                    size="icon"
                    className="h-9 w-9 rounded-lg"
                    onClick={handleSend}
                    disabled={disabled}
                    aria-label={t("sendMessage")}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                </motion.div>
              ) : !input.trim() && !isLoading && onVoiceMode ? (
                <motion.div
                  key="mic"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
                  className="shrink-0"
                >
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="h-9 w-9 rounded-lg"
                    onClick={onVoiceMode}
                    disabled={disabled}
                    aria-label={t("voiceMode")}
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
        {showDisclaimer && (
          <p className="text-muted-foreground mt-2 text-center text-xs">{t("disclaimer")}</p>
        )}
      </div>
    </div>
  );
}
