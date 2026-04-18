/**
 * Seed script: creates the "Home" landing page in the Pages collection
 * using custom landing blocks for both en and lt locales.
 *
 * Usage:
 *   pnpm --filter app db:seed-landing
 *
 * The script is idempotent – it deletes and recreates the home page.
 */
import "dotenv/config";

import { getPayload } from "payload";

import config from "../payload.config";
import type { Page } from "../types/payload-types";
import { matchArrayIds } from "./seed-utils";

type PageLayout = NonNullable<Page["layout"]>;

async function main() {
  const payload = await getPayload({ config });

  // Delete existing home page
  const existing = await payload.find({
    collection: "pages",
    where: { slug: { equals: "home" } },
    limit: 1,
  });
  for (const page of existing.docs) {
    await payload.delete({ collection: "pages", id: page.id });
    console.log("Deleted existing home page.");
  }

  // Find "Default" page template
  const templates = await payload.find({
    collection: "page-templates",
    where: { name: { equals: "Default" } },
    limit: 1,
  });
  const defaultTemplateId = templates.docs[0]?.id ?? null;

  const enLayout: PageLayout = [
    // 1. Landing Hero
    {
      blockType: "landing-hero",
      badge: "AI-Powered Career Matching",
      title: "Discover Where You Truly Belong",
      subtitle:
        "[Company Name] analyzes 7 dimensions of your personality through natural AI conversation to match you with careers and teams where you will thrive.",
      ctaText: "Start Your Profile",
      ctaLink: "/sign-in",
    },
    // 2. What Is (2 cards with benefits)
    {
      blockType: "what-is",
      title: "Who Is It For?",
      description:
        "Whether you are looking for your dream job or building the perfect team, [Company Name] gives you the data-driven insight you need.",
      cards: [
        {
          badge: "For Employees",
          title: "Find Your",
          titleHighlight: "Dream Job",
          description:
            "[Company Name] AI technology analyzes your skills, experience, and career goals to find perfectly matching positions.",
          benefits: [
            {
              title: "Perfect Match Guarantee",
              description: "Only see jobs that align with your core dimensions and values.",
            },
            {
              title: "Personal Profile Power",
              description: "Get an AI-generated profile highlighting your unique strengths.",
            },
            {
              title: "Career Roadmap",
              description: "Stop job-hopping. Start planning your growth path with data.",
            },
          ],
        },
        {
          badge: "For Employers",
          title: "Find the",
          titleHighlight: "Best Talent",
          description:
            "[Company Name] AI technology helps quickly and efficiently find ideal candidates for your team, saving time and resources.",
          benefits: [
            {
              title: "Match Score",
              description: "See an objective percentage match for every candidate.",
            },
            {
              title: "Build Dream Teams",
              description:
                "Profile existing teams. Identify behavioral gaps. Hire the missing piece.",
            },
            {
              title: "AI Speed, Human Quality",
              description:
                "Access pre-vetted talent from integrated job boards and direct profiles.",
            },
          ],
        },
      ],
    },
    // 3. How It Works (Mechanism)
    {
      blockType: "mechanism",
      title: "How It Works",
      description:
        "Three simple steps to discover your professional personality profile and find your perfect career match.",
      steps: [
        {
          title: "Have a Conversation",
          description:
            "Chat naturally with our AI assistant. No forms, no questionnaires — just a genuine conversation about you, your work, and your goals.",
        },
        {
          title: "AI Builds Your Profile",
          description:
            "Our AI analyzes your responses across 7 personality dimensions simultaneously, building a comprehensive map of your professional self.",
        },
        {
          title: "Get Matched",
          description:
            "See jobs and teams ranked by genuine personality fit. Each match shows a detailed compatibility breakdown across all dimensions.",
        },
      ],
      ctaText: "Start Now",
      ctaLink: "/sign-in",
    },
    // 4. Framework
    {
      blockType: "framework",
      badge: "The Science",
      title: "We Analyze the Whole Person.",
      titleLine2: "Not Just the CV.",
      description:
        "Our methodology goes beyond traditional assessments to map seven interconnected dimensions of your personality.",
      dimensions: [
        {
          title: "Behavioral Direction",
          description: "Your baseline behavioral direction and decision-making patterns.",
        },
        {
          title: "Operating Form",
          description: "Your core operating model and inner driving force.",
        },
        {
          title: "Metaprograms",
          description:
            "Subconscious filters through which you process information and make decisions.",
        },
        {
          title: "Shadow",
          description: "Hidden behavioral patterns and blind spots you may not be fully aware of.",
        },
        {
          title: "Identity & Mission",
          description: "Your core sense of self, driving purpose, and neurological levels.",
        },
        {
          title: "RAM",
          description:
            "Your instinctive response under pressure — how you react to danger or stress.",
        },
        {
          title: "Fit & Future",
          description: "Career and life direction alignment for long-term growth.",
        },
      ],
    },
    // 5. Pricing
    {
      blockType: "pricing",
      title: "Plans",
      subtitle:
        "Choose the plan that fits your needs and start discovering your professional profile today.",
    },
    // 6. FAQ
    {
      blockType: "faq",
      title: "Frequently Asked Questions",
      subtitle: "Everything you need to know about [Company Name] and how it works.",
      items: [
        {
          question: "How long does the profiling conversation take?",
          answer:
            "Most users complete their personality profile in a single 15-20 minute conversation. You can also continue across multiple sessions — your profile grows with each interaction.",
        },
        {
          question: "Is my data secure?",
          answer:
            "Absolutely. Your conversation data and profile are encrypted and stored securely. We never share your personal information with third parties without your explicit consent.",
        },
        {
          question: "How accurate is the AI analysis?",
          answer:
            "Our AI is built on decades of psychological research and validated assessment frameworks. Our methodology has been refined through thousands of profiling sessions to ensure accuracy and reliability.",
        },
        {
          question: "Can I use [Company Name] for hiring?",
          answer:
            "Yes! Employers can create team profiles, define role requirements, and see objective compatibility scores for every candidate. This reduces mis-hires and helps build complementary teams.",
        },
        {
          question: "What makes [Company Name] different from personality tests?",
          answer:
            "Traditional tests give you a label. [Company Name] gives you a map. Instead of multiple-choice questions, we use natural conversation to capture the complexity of who you are across multiple interconnected dimensions.",
        },
      ],
    },
    // 7. Blog Section
    {
      blockType: "blog-section",
      title: "Latest from Our Blog",
      subtitle:
        "Insights, updates, and stories about personality profiling and career development.",
      ctaText: "See All Articles",
      postsLimit: 3,
    },
    // 8. Final CTA
    {
      blockType: "final-cta",
      title: "Ready to Discover Your Professional Self?",
      description:
        "Start a conversation with our AI and get your personalized personality profile in minutes.",
      buttonText: "Create Your Profile",
      buttonLink: "/sign-in",
      variant: "card",
    },
  ];

  // ─── Create EN landing page ─────────────────────────────────────────
  const enPage = await payload.create({
    collection: "pages",
    locale: "en",
    data: {
      title: "Home",
      slug: "home",
      status: "published",
      ...(defaultTemplateId ? { pageTemplate: defaultTemplateId } : {}),
      layout: enLayout,
    },
  });

  console.log(`Created home page (en): ${enPage.id}`);

  // ─── Seed LT locale ─────────────────────────────────────────────────
  const createdPage = await payload.findByID({
    collection: "pages",
    id: enPage.id,
    depth: 0,
  });
  const layout = createdPage.layout ?? [];

  const heroBlock = layout[0];
  const whatIsBlock = layout[1];
  const mechBlock = layout[2];
  const fwBlock = layout[3];
  const pricingBlock = layout[4];
  const faqBlock = layout[5];
  const blogBlock = layout[6];
  const ctaBlock = layout[7];

  // Match nested array IDs
  const whatIsCards = whatIsBlock && "cards" in whatIsBlock ? whatIsBlock.cards : [];
  const ltCards = matchArrayIds(
    whatIsCards ?? [],
    [
      {
        badge: "Darbuotojams",
        title: "Raskite Savo",
        titleHighlight: "Svajonių Darbą",
        description:
          "[Company Name] AI technologija analizuoja jūsų įgūdžius, patirtį ir karjeros tikslus, kad rastų idealiai tinkančias pozicijas.",
        benefits: matchArrayIds(whatIsCards?.[0]?.benefits ?? [], [
          {
            title: "Tobulo Atitikimo Garantija",
            description:
              "Matykite tik darbus, kurie atitinka jūsų pagrindines dimensijas ir vertybes.",
          },
          {
            title: "Asmeninio Profilio Galia",
            description: "Gaukite AI sukurtą profilį, išryškinantį jūsų unikalius stiprumus.",
          },
          {
            title: "Karjeros Planas",
            description:
              "Nustokite šokinėti tarp darbų. Pradėkite planuoti savo augimo kelią su duomenimis.",
          },
        ]),
      },
      {
        badge: "Darbdaviams",
        title: "Raskite",
        titleHighlight: "Geriausius Talentus",
        description:
          "[Company Name] AI technologija padeda greitai ir efektyviai rasti idealius kandidatus jūsų komandai.",
        benefits: matchArrayIds(whatIsCards?.[1]?.benefits ?? [], [
          {
            title: "Atitikimo Balas",
            description: "Pamatykite objektyvų procentinį atitikimą kiekvienam kandidatui.",
          },
          {
            title: "Sukurkite Svajonių Komandą",
            description:
              "Profiluokite esamas komandas. Identifikuokite elgesio spragas. Įdarbinkite trūkstamą dalį.",
          },
          {
            title: "AI Greitis, Žmonių Kokybė",
            description:
              "Pasiekite iš anksto patikrintus talentus iš integruotų darbo skelbimų ir tiesioginių profilių.",
          },
        ]),
      },
    ],
    "benefits"
  );

  const mechSteps = mechBlock && "steps" in mechBlock ? mechBlock.steps : [];
  const ltSteps = matchArrayIds(mechSteps ?? [], [
    {
      title: "Pasikalbėkite",
      description:
        "Kalbėkitės natūraliai su mūsų AI asistentu. Jokių formų, jokių klausimynų — tiesiog tikras pokalbis apie jus.",
    },
    {
      title: "AI Sukuria Jūsų Profilį",
      description:
        "Mūsų AI analizuoja jūsų atsakymus 7 asmenybės dimensijose vienu metu, kurdamas visapusišką žemėlapį.",
    },
    {
      title: "Gaukite Atitikimus",
      description: "Matykite darbus ir komandas, surikiuotas pagal tikrą asmenybės atitikimą.",
    },
  ]);

  const fwDimensions = fwBlock && "dimensions" in fwBlock ? fwBlock.dimensions : [];
  const ltDimensions = matchArrayIds(fwDimensions ?? [], [
    {
      title: "Bazinio elgesio kryptis",
      description: "Jūsų bazinio elgesio kryptis ir sprendimų priėmimo modeliai.",
    },
    {
      title: "Veikimo forma",
      description: "Jūsų pagrindinis veikimo modelis ir vidinė varomoji jėga.",
    },
    {
      title: "Metaprogramos",
      description:
        "Pasąmoniniai filtrai, per kuriuos apdorojate informaciją ir priimate sprendimus.",
    },
    {
      title: "Šešėlis",
      description: "Paslėpti elgesio modeliai ir aklosios zonos, kurių galite iki galo nesuvokti.",
    },
    {
      title: "Tapatybė ir Misija",
      description: "Jūsų esminis savęs suvokimas, varomoji jėga ir neurologiniai lygmenys.",
    },
    {
      title: "RAM",
      description:
        "Jūsų instinktyvus atsakas į spaudimą — kaip reaguojate susidūrę su pavojumi ar stresu.",
    },
    {
      title: "Atitikimas ir Ateitis",
      description: "Karjeros ir gyvenimo krypties atitikimas ilgalaikiam augimui.",
    },
  ]);

  const faqItems = faqBlock && "items" in faqBlock ? faqBlock.items : [];
  const ltFaqItems = matchArrayIds(faqItems ?? [], [
    {
      question: "Kiek laiko trunka profiliavimo pokalbis?",
      answer:
        "Dauguma vartotojų užbaigia savo asmenybės profilį per vieną 15-20 minučių pokalbį. Taip pat galite tęsti keliose sesijose.",
    },
    {
      question: "Ar mano duomenys saugūs?",
      answer: "Absoliučiai. Jūsų pokalbio duomenys ir profilis yra užšifruoti ir saugiai saugomi.",
    },
    {
      question: "Kiek tiksli yra AI analizė?",
      answer:
        "Mūsų AI sukurtas remiantis dešimtmečių psichologiniais tyrimais ir patvirtintomis vertinimo sistemomis.",
    },
    {
      question: "Ar galiu naudoti [Company Name] įdarbinimui?",
      answer:
        "Taip! Darbdaviai gali kurti komandų profilius, apibrėžti pozicijų reikalavimus ir matyti objektyvius suderinamumo balus.",
    },
    {
      question: "Kuo [Company Name] skiriasi nuo asmenybės testų?",
      answer:
        "Tradiciniai testai suteikia etiketę. [Company Name] suteikia žemėlapį. Naudojame natūralų pokalbį keliose dimensijose.",
    },
  ]);

  const ltLayout: PageLayout = [
    {
      ...heroBlock,
      blockType: "landing-hero",
      badge: "AI Karjeros Derinimas",
      title: "Atraskite, Kur Iš Tikrųjų Priklausote",
      subtitle:
        "[Company Name] analizuoja 7 jūsų asmenybės dimensijas per natūralų AI pokalbį, kad suderintų jus su karjera ir komandomis, kuriose klestėsite.",
      ctaText: "Sukurti Profilį",
    },
    {
      ...whatIsBlock,
      blockType: "what-is",
      title: "Kam Tai Skirta?",
      description:
        "Nesvarbu, ar ieškote svajonių darbo, ar kuriate tobulą komandą — [Company Name] suteikia duomenimis pagrįstą įžvalgą.",
      cards: ltCards,
    },
    {
      ...mechBlock,
      blockType: "mechanism",
      title: "Kaip Tai Veikia",
      description: "Trys paprasti žingsniai, kad atrastumėte savo profesinį asmenybės profilį.",
      steps: ltSteps,
      ctaText: "Pradėti Dabar",
    },
    {
      ...fwBlock,
      blockType: "framework",
      badge: "Mokslas",
      title: "Analizuojame Visą Asmenį.",
      titleLine2: "Ne Tik CV.",
      description:
        "Mūsų metodologija pranoksta tradicinius vertinimus, atvaizduodama septynias tarpusavyje susijusias dimensijas.",
      dimensions: ltDimensions,
    },
    {
      ...pricingBlock,
      blockType: "pricing",
      title: "Planai",
      subtitle: "Pasirinkite planą, kuris atitinka jūsų poreikius.",
    },
    {
      ...faqBlock,
      blockType: "faq",
      title: "Dažnai Užduodami Klausimai",
      subtitle: "Viskas, ką reikia žinoti apie [Company Name] ir kaip tai veikia.",
      items: ltFaqItems,
    },
    {
      ...blogBlock,
      blockType: "blog-section",
      title: "Naujausi Straipsniai",
      subtitle: "Įžvalgos, naujienos ir istorijos apie asmenybės profiliavimą ir karjeros vystymą.",
      ctaText: "Visi Straipsniai",
    },
    {
      ...ctaBlock,
      blockType: "final-cta",
      title: "Pasiruošę Atrasti Savo Profesinį Aš?",
      description:
        "Pradėkite pokalbį su mūsų AI ir gaukite savo personalizuotą asmenybės profilį per kelias minutes.",
      buttonText: "Sukurti Profilį",
    },
  ];

  await payload.update({
    collection: "pages",
    id: enPage.id,
    locale: "lt",
    data: {
      title: "Pradžia",
      layout: ltLayout,
    },
  });

  console.log("Home page seeded for en and lt.");

  // ─── Create Blog page ───────────────────────────────────────────────
  const existingBlog = await payload.find({
    collection: "pages",
    where: { slug: { equals: "blog" } },
    limit: 1,
  });
  for (const page of existingBlog.docs) {
    await payload.delete({ collection: "pages", id: page.id });
    console.log("Deleted existing blog page.");
  }

  const blogPage = await payload.create({
    collection: "pages",
    locale: "en",
    data: {
      title: "Blog",
      slug: "blog",
      status: "published",
      layout: [
        {
          blockType: "blog-index",
          title: "Blog",
          subtitle: "Insights on personality, psychology, and our methodology",
          postsPerPage: 9,
        },
      ],
    },
  });

  await payload.update({
    collection: "pages",
    id: blogPage.id,
    locale: "lt",
    data: {
      title: "Tinklaraštis",
      layout: [
        {
          blockType: "blog-index",
          title: "Tinklaraštis",
          subtitle: "Įžvalgos apie asmenybę, psichologiją ir mūsų metodologiją",
          postsPerPage: 9,
        },
      ],
    },
  });

  console.log("Blog page seeded.");
  process.exit(0);
}

main().catch(err => {
  console.error("Seed failed:", err);
  process.exit(1);
});
