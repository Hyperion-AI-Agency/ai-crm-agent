import { ReactNode } from "react";
import Link from "next/link";

interface FooterLinkProps {
  href: any;
  children: ReactNode;
  openInNewTab?: boolean;
}

export function FooterLink({ href, children, openInNewTab }: FooterLinkProps) {
  return (
    <li>
      <Link
        href={href}
        className="text-muted-foreground hover:text-foreground text-base transition-colors"
        {...(openInNewTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </Link>
    </li>
  );
}
