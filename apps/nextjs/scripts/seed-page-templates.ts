/**
 * Seed script: creates page templates (reusable header/footer wrappers)
 * and assigns them to existing pages.
 *
 * Usage:
 *   pnpm --filter app db:seed-templates
 *
 * The script clears existing templates and recreates them.
 */
import "dotenv/config";

import { sql } from "drizzle-orm";
import { getPayload } from "payload";

import config from "../payload.config";

const navLinks = [
  { label: "How It Works", url: "/#mechanism" },
  { label: "Plans", url: "/#pricing" },
  { label: "Blog", url: "/blog" },
];

const navLinksLt = [
  { label: "Kaip tai veikia", url: "/#mechanism" },
  { label: "Planai", url: "/#pricing" },
  { label: "Tinklaraštis", url: "/blog" },
];

const footerSections = [
  {
    title: "Product",
    links: [
      { label: "How It Works", url: "/#mechanism" },
      { label: "Plans", url: "/#pricing" },
      { label: "Blog", url: "/blog" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", url: "/privacy-policy" },
      { label: "Terms of Service", url: "/terms-of-service" },
    ],
  },
];

const footerSectionsLt = [
  {
    title: "Produktas",
    links: [
      { label: "Kaip tai veikia", url: "/#mechanism" },
      { label: "Planai", url: "/#pricing" },
      { label: "Tinklaraštis", url: "/blog" },
    ],
  },
  {
    title: "Teisinė informacija",
    links: [
      { label: "Privatumo politika", url: "/privacy-policy" },
      { label: "Naudojimo sąlygos", url: "/terms-of-service" },
    ],
  },
];

async function main() {
  const payload = await getPayload({ config });

  // ─── Clear existing page templates ──────────────────────────────────────
  console.log("Clearing existing page templates...");
  const existingTemplates = await payload.find({
    collection: "page-templates",
    limit: 100,
  });
  for (const tpl of existingTemplates.docs) {
    await payload.delete({ collection: "page-templates", id: tpl.id });
  }
  console.log(`Deleted ${existingTemplates.docs.length} page templates.`);

  // ─── Default Template ───────────────────────────────────────────────────
  const defaultTemplate = await payload.create({
    collection: "page-templates",
    locale: "en",
    data: {
      name: "Default",
      header: [
        {
          blockType: "navbar",
          links: navLinks,
          ctaLabel: "Get Started",
          ctaUrl: "/sign-up",
        },
      ],
      footer: [
        {
          blockType: "site-footer",
          sections: footerSections,
        },
      ],
    },
  });
  // Seed LT locale for the default template
  await payload.update({
    collection: "page-templates",
    id: defaultTemplate.id,
    locale: "lt",
    data: {
      header: [
        {
          blockType: "navbar",
          links: navLinksLt,
          ctaLabel: "Pradėti",
          ctaUrl: "/sign-up",
        },
      ],
      footer: [
        {
          blockType: "site-footer",
          sections: footerSectionsLt,
        },
      ],
    },
  });
  console.log(`Created "Default" page template (id: ${defaultTemplate.id}).`);

  // ─── Blog Template ─────────────────────────────────────────────────────
  const blogTemplate = await payload.create({
    collection: "page-templates",
    locale: "en",
    data: {
      name: "Blog",
      header: [
        {
          blockType: "navbar",
          links: navLinks,
          ctaLabel: "Get Started",
          ctaUrl: "/sign-up",
        },
      ],
      footer: [
        {
          blockType: "cta",
          title: "Ready to discover your personality?",
          description: "Start your personality profile today with a simple AI conversation.",
          buttonText: "Get Started",
          buttonLink: "/sign-up",
        },
        {
          blockType: "site-footer",
          sections: footerSections,
        },
      ],
    },
  });
  await payload.update({
    collection: "page-templates",
    id: blogTemplate.id,
    locale: "lt",
    data: {
      header: [
        {
          blockType: "navbar",
          links: navLinksLt,
          ctaLabel: "Pradėti",
          ctaUrl: "/sign-up",
        },
      ],
      footer: [
        {
          blockType: "cta",
          title: "Pasiruošę atrasti savo asmenybę?",
          description: "Pradėkite savo asmenybės profilį šiandien paprastu pokalbiu su AI.",
          buttonText: "Pradėti",
          buttonLink: "/sign-up",
        },
        {
          blockType: "site-footer",
          sections: footerSectionsLt,
        },
      ],
    },
  });
  console.log(`Created "Blog" page template (id: ${blogTemplate.id}).`);

  // ─── Legal Template ────────────────────────────────────────────────────
  const legalTemplate = await payload.create({
    collection: "page-templates",
    locale: "en",
    data: {
      name: "Legal",
      header: [
        {
          blockType: "navbar",
          links: navLinks,
          ctaLabel: "Get Started",
          ctaUrl: "/sign-up",
        },
      ],
      footer: [
        {
          blockType: "site-footer",
          sections: footerSections,
        },
      ],
    },
  });
  await payload.update({
    collection: "page-templates",
    id: legalTemplate.id,
    locale: "lt",
    data: {
      header: [
        {
          blockType: "navbar",
          links: navLinksLt,
          ctaLabel: "Pradėti",
          ctaUrl: "/sign-up",
        },
      ],
      footer: [
        {
          blockType: "site-footer",
          sections: footerSectionsLt,
        },
      ],
    },
  });
  console.log(`Created "Legal" page template (id: ${legalTemplate.id}).`);

  // ─── Assign templates to existing pages ─────────────────────────────────
  const allPages = await payload.find({
    collection: "pages",
    limit: 100,
    select: { slug: true },
  });

  const legalSlugs = new Set(["terms-of-service", "privacy-policy"]);

  for (const page of allPages.docs) {
    const templateId = legalSlugs.has(page.slug) ? legalTemplate.id : defaultTemplate.id;
    await payload.db.drizzle.execute(
      sql`UPDATE pages SET page_template_id = ${templateId} WHERE id = ${page.id}`
    );
    console.log(
      `Assigned "${legalSlugs.has(page.slug) ? "Legal" : "Default"}" template to page "${page.slug}".`
    );
  }

  console.log("Page templates seed complete.");
  process.exit(0);
}

main().catch(err => {
  console.error("Seed failed:", err);
  process.exit(1);
});
