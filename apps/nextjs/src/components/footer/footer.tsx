import { fetchGlobalSettings } from "@/actions/fetch-global-settings";
import {
  Facebook,
  Github,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Youtube,
} from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { FooterContactItem } from "./footer-contact-item";
import { FooterCookieButton } from "./footer-cookie-button";
import { FooterLink } from "./footer-link";
import { FooterLogo } from "./footer-logo";
import { FooterSection } from "./footer-section";
import { FooterSocialLink } from "./footer-social-link";

const socialIcons: Record<string, React.ReactNode> = {
  linkedin: <Linkedin className="size-5" />,
  twitter: <Twitter className="size-5" />,
  facebook: <Facebook className="size-5" />,
  instagram: <Instagram className="size-5" />,
  youtube: <Youtube className="size-5" />,
  github: <Github className="size-5" />,
};

interface FooterProps {
  sections?: {
    title?: string | null;
    links?:
      | {
          label?: string | null;
          url?: string | null;
          openInNewTab?: boolean | null;
          id?: string | null;
        }[]
      | null;
    id?: string | null;
  }[];
}

export default async function Footer({ sections }: FooterProps = {}) {
  const locale = await getLocale();
  const [settings, t] = await Promise.all([
    fetchGlobalSettings(locale),
    getTranslations({ locale, namespace: "common.footer" }),
  ]);

  const businessName = settings?.businessName ?? "App";
  const copyright = `\u00A9 ${new Date().getFullYear()} ${businessName}. ${t("allRightsReserved")}`;
  const contactEmail = settings?.contactInfo?.email ?? "";
  const contactPhone = settings?.contactInfo?.phone ?? "";
  const contactAddress = settings?.contactInfo?.address ?? "";
  const socialLinks = settings?.socialLinks ?? [];

  const hasCmsSections = Array.isArray(sections) && sections.length > 0;

  return (
    <footer className="border-border bg-background border-t py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Top Section */}
        <div className="mb-12 flex flex-col gap-8 lg:flex-row lg:justify-between">
          <FooterLogo />
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:flex lg:gap-12">
            {hasCmsSections ? (
              sections.map((section, i) => (
                <FooterSection key={section.id ?? i} title={section.title ?? ""}>
                  {Array.isArray(section.links) &&
                    section.links.map((link, j) => (
                      <FooterLink
                        key={link.id ?? j}
                        href={link.url ?? "#"}
                        openInNewTab={link.openInNewTab ?? false}
                      >
                        {link.label}
                      </FooterLink>
                    ))}
                  {i === sections.length - 1 && (
                    <FooterCookieButton label={t("cookiePreferences")} />
                  )}
                </FooterSection>
              ))
            ) : (
              <>
                <FooterSection title={t("product")}>
                  <FooterLink href="/#mechanism">{t("howItWorks")}</FooterLink>
                  <FooterLink href="/#pricing">{t("plans")}</FooterLink>
                  <FooterLink href="/blog">{t("blog")}</FooterLink>
                </FooterSection>
                <FooterSection title={t("legal")}>
                  <FooterLink href="/privacy-policy">{t("privacyPolicy")}</FooterLink>
                  <FooterLink href="/terms-of-service">{t("termsOfService")}</FooterLink>
                  <FooterCookieButton label={t("cookiePreferences")} />
                </FooterSection>
              </>
            )}

            {/* Contact - always from global settings */}
            {(contactEmail || contactPhone || contactAddress) && (
              <FooterSection title={t("contact")}>
                {contactEmail && (
                  <FooterContactItem
                    href={`mailto:${contactEmail}`}
                    icon={<Mail className="h-4 w-4 flex-shrink-0" />}
                  >
                    {contactEmail}
                  </FooterContactItem>
                )}
                {contactPhone && (
                  <FooterContactItem
                    href={`tel:${contactPhone}`}
                    icon={<Phone className="h-4 w-4 flex-shrink-0" />}
                  >
                    {contactPhone}
                  </FooterContactItem>
                )}
                {contactAddress && (
                  <FooterContactItem icon={<MapPin className="h-4 w-4 flex-shrink-0" />}>
                    {contactAddress}
                  </FooterContactItem>
                )}
              </FooterSection>
            )}
          </div>
        </div>

        {/* Bottom Section - Copyright and Social Media */}
        <div className="border-border border-t pt-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="text-muted-foreground text-sm">
              <p>{copyright}</p>
            </div>

            {socialLinks.length > 0 && (
              <div className="flex gap-3">
                {socialLinks.map((social, i) => (
                  <FooterSocialLink
                    key={i}
                    href={social.url}
                    icon={socialIcons[social.platform] || <Linkedin className="size-5" />}
                    ariaLabel={social.platform}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
