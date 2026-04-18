import { Logo } from "@/components/branding/logo";

interface FooterLogoProps {
  description?: string | null;
}

export function FooterLogo({ description }: FooterLogoProps) {
  return (
    <div className="max-w-xs flex-shrink-0">
      <Logo className="text-foreground text-xl font-semibold" />
      {description && (
        <p className="text-muted-foreground mt-3 text-base leading-relaxed">{description}</p>
      )}
    </div>
  );
}
