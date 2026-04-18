"use client";

import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  background?: "default" | "muted" | "dark" | "primary" | null;
  noPadding?: boolean;
}

const bgClasses: Record<string, string> = {
  default: "",
  muted: "bg-muted",
  dark: "bg-gray-900 text-white",
  primary: "bg-primary text-primary-foreground",
};

export function SectionWrapper({
  children,
  className,
  id,
  background = "default",
  noPadding = false,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative overflow-hidden",
        !noPadding && "py-16 lg:py-24 xl:py-32",
        bgClasses[background ?? "default"],
        className
      )}
    >
      {children}
    </section>
  );
}
