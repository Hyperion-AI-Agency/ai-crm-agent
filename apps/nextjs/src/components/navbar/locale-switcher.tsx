"use client";

import { useTransition } from "react";
import { env } from "@/env";
import { Check, Globe } from "lucide-react";
import { useLocale } from "next-intl";

import { usePathname, useRouter } from "@/lib/i18n/navigation";
import { localesConfig } from "@/lib/i18n/routing";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const currentLocale = useLocale();

  function onSelectChange(nextLocale: string) {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={isPending}>
        <button className="text-foreground/70 hover:text-foreground inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-medium transition-colors">
          <Globe className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {env.NEXT_PUBLIC_ALL_LOCALES.map(locale => {
          const config = localesConfig[locale];
          return (
            <DropdownMenuItem key={locale} onClick={() => onSelectChange(locale)}>
              {config && <span className="text-base leading-none">{config.flag}</span>}
              {config?.name ?? locale.toUpperCase()}
              {locale === currentLocale && <Check className="ml-auto h-4 w-4" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
