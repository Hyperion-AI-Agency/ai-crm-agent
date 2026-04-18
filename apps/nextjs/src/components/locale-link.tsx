"use client";

import { Link } from "@/lib/i18n/navigation";

type LocaleLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
};

export function LocaleLink({ href, children, ...props }: LocaleLinkProps) {
  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  );
}
