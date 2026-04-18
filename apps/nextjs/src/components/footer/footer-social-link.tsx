import { ReactNode } from "react";

interface FooterSocialLinkProps {
  href: string;
  icon: ReactNode;
  ariaLabel: string;
}

export function FooterSocialLink({ href, icon, ariaLabel }: FooterSocialLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground inline-flex h-10 w-10 items-center justify-center rounded-lg border bg-transparent transition-colors"
      aria-label={ariaLabel}
    >
      {icon}
    </a>
  );
}
