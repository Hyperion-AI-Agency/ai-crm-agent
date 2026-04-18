/**
 * Seed script: populates GlobalSettings and Plans globals with initial content
 * for both en and lt locales.
 *
 * Usage:
 *   pnpm --filter app db:seed-content
 *
 * For Plans, set POLAR_PRODUCT_KEY_REGULAR and POLAR_PRODUCT_KEY_HR env vars
 * to the Polar.sh product UUIDs. If not set, placeholder values are used.
 *
 * The script is idempotent – it overwrites existing global content.
 */
import "dotenv/config";

import { getPayload } from "payload";

import config from "../payload.config";
import { env } from "../src/env.js";
import { matchArrayIds } from "./seed-utils";

async function main() {
  const payload = await getPayload({ config });

  // ─── Global Settings ────────────────────────────────────────────────
  {
    console.log("Seeding global-settings...");
    await payload.updateGlobal({
      slug: "global-settings",
      data: {
        businessName: "[Company Name]",
        domain: "https://[company-domain].com",
        contactInfo: {
          email: "contact@[company-domain].com",
          phone: "+370 68758122",
          address: "Vilnius, Lithuania",
        },
        socialLinks: [
          { platform: "linkedin", url: "https://linkedin.com/company/[company]" },
          { platform: "facebook", url: "https://facebook.com/[company]" },
        ],
      },
    });
    console.log("Global settings seeded.");
  }

  // ─── Plans ──────────────────────────────────────────────────────────
  {
    const regularProductKey =
      env.POLAR_PRODUCT_KEY_REGULAR ?? "00000000-0000-0000-0000-000000000001";
    const hrProductKey = env.POLAR_PRODUCT_KEY_HR ?? "00000000-0000-0000-0000-000000000002";

    // Seed English (default)
    const enResult = await payload.updateGlobal({
      slug: "plans",
      locale: "en",
      data: {
        plans: [
          {
            key: "regular",
            name: "Regular",
            description: "Perfect for individuals exploring their professional profile",
            price: 29,
            cta: "Get Started",
            features: [
              { feature: "Full personality profile" },
              { feature: "AI conversation analysis" },
              { feature: "Career matching insights" },
              { feature: "Downloadable PDF report" },
              { feature: "Email support" },
            ],
            productKey: regularProductKey,
            isActive: true,
            sortOrder: 0,
          },
          {
            key: "hr",
            name: "HR Professional",
            description: "For recruiters and HR teams seeking the best talent match",
            price: 99,
            cta: "Contact Us",
            features: [
              { feature: "Unlimited job postings" },
              { feature: "Access to candidate database" },
              { feature: "Advanced candidate matching" },
              { feature: "Company profile management" },
              { feature: "Bulk candidate analysis" },
              { feature: "Custom matching criteria" },
              { feature: "Dedicated account manager" },
              { feature: "API access for integrations" },
              { feature: "Advanced analytics dashboard" },
              { feature: "White-label options" },
              { feature: "Team collaboration tools" },
            ],
            productKey: hrProductKey,
            isActive: true,
            sortOrder: 1,
          },
        ],
      },
    });

    // Match IDs for Lithuanian localized version
    const ltPlans = matchArrayIds(enResult.plans ?? [], [
      {
        key: "regular",
        name: "Įprastas",
        description: "Idealiai tinka žmonėms, norintiems pažinti savo profesinį profilį",
        price: 29,
        cta: "Pradėti",
        features: [
          { feature: "Pilnas asmenybės profilis" },
          { feature: "AI pokalbio analizė" },
          { feature: "Karjeros atitikimo įžvalgos" },
          { feature: "Atsisiunčiama PDF ataskaita" },
          { feature: "El. pašto palaikymas" },
        ],
        productKey: regularProductKey,
        isActive: true,
        sortOrder: 0,
      },
      {
        key: "hr",
        name: "HR Profesionalas",
        description:
          "Personalo atrankos specialistams ir HR komandoms, ieškantiems geriausio talentų atitikimo",
        price: 99,
        cta: "Susisiekti",
        features: [
          { feature: "Neriboti darbo skelbimai" },
          { feature: "Prieiga prie kandidatų duomenų bazės" },
          { feature: "Pažangus kandidatų derinimas" },
          { feature: "Įmonės profilio valdymas" },
          { feature: "Masinis kandidatų analizė" },
          { feature: "Individualūs derinimo kriterijai" },
          { feature: "Individualus paskyros vadovas" },
          { feature: "API prieiga integracijoms" },
          { feature: "Pažangus analitikos skydas" },
          { feature: "Baltų etikečių parinktys" },
          { feature: "Komandos bendradarbiavimo įrankiai" },
        ],
        productKey: hrProductKey,
        isActive: true,
        sortOrder: 1,
      },
    ]);

    // Seed Lithuanian with matched IDs
    await payload.updateGlobal({
      slug: "plans",
      locale: "lt",
      data: {
        plans: ltPlans,
      },
    });

    console.log("Plans seeded for en and lt.");
  }

  console.log("Done.");
  process.exit(0);
}

main().catch(err => {
  console.error("Seed failed:", err);
  process.exit(1);
});
