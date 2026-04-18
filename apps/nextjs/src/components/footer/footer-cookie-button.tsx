"use client";

import * as CookieConsent from "vanilla-cookieconsent";

interface FooterCookieButtonProps {
  label: string;
}

export function FooterCookieButton({ label }: FooterCookieButtonProps) {
  return (
    <button
      type="button"
      onClick={() => CookieConsent.showPreferences()}
      className="text-muted-foreground hover:text-foreground text-base transition-colors"
    >
      {label}
    </button>
  );
}
