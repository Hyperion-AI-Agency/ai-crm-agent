"use client";

export function ChatLoadingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex space-x-1">
        <span className="bg-foreground/60 h-2 w-2 animate-bounce rounded-full [animation-delay:-0.3s]"></span>
        <span className="bg-foreground/60 h-2 w-2 animate-bounce rounded-full [animation-delay:-0.15s]"></span>
        <span className="bg-foreground/60 h-2 w-2 animate-bounce rounded-full"></span>
      </div>
    </div>
  );
}
