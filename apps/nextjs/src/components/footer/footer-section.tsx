import { ReactNode } from "react";

interface FooterSectionProps {
  title: string;
  children: ReactNode;
}

export function FooterSection({ title, children }: FooterSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-foreground text-sm font-bold tracking-wider uppercase">{title}</h3>
      <ul className="space-y-3">{children}</ul>
    </div>
  );
}
