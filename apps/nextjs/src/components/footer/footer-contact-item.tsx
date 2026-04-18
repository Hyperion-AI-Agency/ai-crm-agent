import { ReactNode } from "react";

interface FooterContactItemProps {
  href?: string;
  icon: ReactNode;
  children: ReactNode;
}

export function FooterContactItem({ href, icon, children }: FooterContactItemProps) {
  const content = (
    <>
      {icon}
      <span>{children}</span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
      >
        {content}
      </a>
    );
  }

  return <p className="text-muted-foreground flex items-center gap-2">{content}</p>;
}
