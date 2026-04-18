/**
 * Seed script: populates blog categories and posts with initial content
 * for both en and lt locales.
 *
 * Usage:
 *   pnpm --filter app db:seed-blog
 *
 * The script is idempotent – it skips content that already exists.
 */
import "dotenv/config";

import { getPayload } from "payload";

import config from "../payload.config";
import { buildRichText, formatSlugStr } from "./seed-utils";

// ─── Main ─────────────────────────────────────────────────────────────────

async function main() {
  const payload = await getPayload({ config });

  // ─── Clear existing posts and categories ────────────────────────────
  console.log("Clearing existing posts...");
  const existingPosts = await payload.find({ collection: "posts", limit: 100 });
  for (const post of existingPosts.docs) {
    await payload.delete({ collection: "posts", id: post.id });
  }
  console.log(`Deleted ${existingPosts.docs.length} posts.`);

  console.log("Clearing existing categories...");
  const existingCategories = await payload.find({ collection: "categories", limit: 100 });
  for (const cat of existingCategories.docs) {
    await payload.delete({ collection: "categories", id: cat.id });
  }
  console.log(`Deleted ${existingCategories.docs.length} categories.`);

  // ─── Categories ───────────────────────────────────────────────────────

  async function ensureCategory(
    slug: string,
    enTitle: string,
    ltTitle: string,
    enDescription: string,
    ltDescription: string
  ): Promise<string> {
    const cat = await payload.create({
      collection: "categories",
      locale: "en",
      data: {
        title: enTitle,
        slug,
        content: {
          description: buildRichText([{ type: "paragraph", text: enDescription }]),
        },
      },
    });

    await payload.update({
      collection: "categories",
      id: cat.id,
      locale: "lt",
      data: {
        title: ltTitle,
        content: {
          description: buildRichText([{ type: "paragraph", text: ltDescription }]),
        },
      },
    });

    console.log(`Category "${slug}" seeded for en and lt.`);
    return cat.id;
  }

  const productUpdatesId = await ensureCategory(
    "product-updates",
    "Product Updates",
    "Produkto Naujienos",
    "Latest updates and improvements to the App platform.",
    "Naujausi App platformos atnaujinimai ir patobulinimai."
  );

  const useCasesId = await ensureCategory(
    "use-cases",
    "Use Cases",
    "Naudojimo Atvejai",
    "Real-world applications of App for career development and hiring.",
    "Praktiniai App taikymai karjeros vystymui ir įdarbinimui."
  );

  const psychologyId = await ensureCategory(
    "psychology",
    "Psychology",
    "Psichologija",
    "Insights into personality science and behavioral psychology.",
    "Įžvalgos apie asmenybės mokslą ir elgesio psichologiją."
  );

  const careerTipsId = await ensureCategory(
    "career-tips",
    "Career Tips",
    "Karjeros Patarimai",
    "Practical advice for career growth and professional development.",
    "Praktiniai patarimai karjeros augimui ir profesiniam tobulėjimui."
  );

  // ─── Posts ────────────────────────────────────────────────────────────

  async function ensurePost(opts: {
    slug: string;
    en: {
      title: string;
      description: string;
      summary: string;
      sections: { type: "heading" | "paragraph"; tag?: string; text: string }[];
    };
    lt: {
      title: string;
      description: string;
      summary: string;
      sections: { type: "heading" | "paragraph"; tag?: string; text: string }[];
    };
    categoryId: string;
    date: string;
    featured?: boolean;
  }) {
    const post = await payload.create({
      collection: "posts",
      locale: "en",
      data: {
        title: opts.en.title,
        slug: opts.slug,
        status: "published",
        _status: "published",
        featured: opts.featured ?? false,
        date: opts.date,
        content: {
          description: opts.en.description,
          summary: opts.en.summary,
          richText: buildRichText(opts.en.sections),
          category: [opts.categoryId],
        },
        meta: {
          title: `${opts.en.title} | App`,
          description: opts.en.description,
        },
      },
    });

    await payload.update({
      collection: "posts",
      id: post.id,
      locale: "lt",
      data: {
        title: opts.lt.title,
        slug: formatSlugStr(opts.lt.title),
        content: {
          description: opts.lt.description,
          summary: opts.lt.summary,
          richText: buildRichText(opts.lt.sections),
        },
        meta: {
          title: `${opts.lt.title} | App`,
          description: opts.lt.description,
        },
      },
    });

    console.log(`Post "${opts.slug}" seeded for en and lt.`);
  }

  // ─── Post 1: What is the AI Personality Profile? ──────────────────────

  await ensurePost({
    slug: "what-is-ai-personality-profile",
    categoryId: useCasesId,
    date: "2026-01-15T10:00:00.000Z",
    featured: true,
    en: {
      title: "What is the AI Personality Profile?",
      description:
        "Discover how our multi-dimensional personality framework goes beyond traditional assessments to reveal the full picture of who you are.",
      summary:
        "The AI profile analyzes temperament, archetypes, metaprograms, identity, mission, behavioral patterns, and context to create a complete map of your personality.",
      sections: [
        {
          type: "paragraph",
          text: "Traditional personality tests give you a label. Our AI Personality Profile gives you a map. Built on decades of psychological research and powered by AI, the assessment framework analyzes seven interconnected dimensions of your personality to create a comprehensive understanding of who you are, how you work, and where you thrive.",
        },
        { type: "heading", tag: "h2", text: "The Seven Dimensions" },
        {
          type: "paragraph",
          text: "The first dimension, Baseline Behavioral Direction, maps your Big Five and MBTI traits to workplace predictors. The second dimension, Operating Form, uncovers your core energy patterns — your inner heroes and shadow traits that drive behavior beneath the surface.",
        },
        {
          type: "paragraph",
          text: "Dimension three covers Metaprograms — the cognitive filters through which you process information and make decisions. The fourth dimension, Identity, explores your self-perception, values, and personal branding. The fifth, Mission and Purpose, maps your deeper motivations.",
        },
        {
          type: "paragraph",
          text: "Behavioral Patterns, the sixth dimension, analyzes your communication style, stress responses, and action tendencies. Finally, Context examines how you fit within specific team cultures and work environments.",
        },
        { type: "heading", tag: "h2", text: "Why Multiple Dimensions?" },
        {
          type: "paragraph",
          text: "Single-axis personality tests miss the complexity of real people. You are not just an introvert or an extrovert. You are a unique combination of traits, values, motivations, and behavioral patterns. Our assessment framework captures this complexity while remaining practical and actionable.",
        },
        { type: "heading", tag: "h2", text: "How It Works" },
        {
          type: "paragraph",
          text: "Getting your personality profile is simple. You have a natural conversation with our AI assistant — no forms, no multiple-choice questions. The AI analyzes your responses across all dimensions simultaneously. Most users complete their profile in a single conversation session.",
        },
      ],
    },
    lt: {
      title: "Kas yra AI asmenybės profilis?",
      description:
        "Sužinokite, kaip mūsų daugiamačė asmenybės sistema pranoksta tradicinius testus ir atskleidžia visapusišką jūsų asmenybės vaizdą.",
      summary:
        "AI profilis analizuoja temperamentą, archetipus, metaprogramas, tapatumą, misiją, elgesio modelius ir kontekstą, sukurdamas išsamų jūsų asmenybės žemėlapį.",
      sections: [
        {
          type: "paragraph",
          text: "Tradiciniai asmenybės testai suteikia jums etiketę. Mūsų AI asmenybės profilis suteikia žemėlapį. Sukurtas remiantis dešimtmečių psichologiniais tyrimais ir veikiamas dirbtinio intelekto, mūsų sistema analizuoja septynias tarpusavyje susijusias jūsų asmenybės dimensijas.",
        },
        { type: "heading", tag: "h2", text: "Septynios dimensijos" },
        {
          type: "paragraph",
          text: "Pirmoji dimensija — Bazinio elgesio kryptis — susieja jūsų Big Five ir MBTI bruožus su darbo vietos prognozėmis. Antroji dimensija — Veikimo forma — atskleidžia jūsų pagrindinius energijos modelius.",
        },
        {
          type: "paragraph",
          text: "Trečioji dimensija apima Metaprogramas — kognityvinius filtrus, per kuriuos apdorojate informaciją ir priimate sprendimus. Ketvirtoji — Tapatumas, penktoji — Misija ir tikslas.",
        },
        {
          type: "paragraph",
          text: "Elgesio modeliai, šeštoji dimensija, analizuoja jūsų bendravimo stilių. Kontekstas nagrinėja, kaip tinkate konkrečioms komandų kultūroms ir darbo aplinkoms.",
        },
        { type: "heading", tag: "h2", text: "Kodėl kelios dimensijos?" },
        {
          type: "paragraph",
          text: "Vienos ašies asmenybės testai praleidžia tikrų žmonių sudėtingumą. Mūsų vertinimo sistema fiksuoja šį sudėtingumą, išlikdama praktiška ir veiksminga.",
        },
        { type: "heading", tag: "h2", text: "Kaip tai veikia" },
        {
          type: "paragraph",
          text: "Gauti savo asmenybės profilį paprasta. Jūs vedatės natūralų pokalbį su mūsų AI asistentu — jokių formų, jokių testų. Dauguma vartotojų užbaigia savo profilį per vieną pokalbio sesiją.",
        },
      ],
    },
  });

  // ─── Post 2: How AI Conversations Build Your Profile ──────────────────

  await ensurePost({
    slug: "how-ai-conversations-build-your-profile",
    categoryId: productUpdatesId,
    date: "2026-02-01T10:00:00.000Z",
    en: {
      title: "How AI Conversations Build Your Profile",
      description:
        "Learn how our AI assistant uses natural conversation to analyze your personality across 7 dimensions — no forms or questionnaires needed.",
      summary:
        "Our AI agent uses natural conversation instead of forms to gather personality data, making the profiling experience feel like a chat rather than a test.",
      sections: [
        {
          type: "paragraph",
          text: "Nobody likes filling out lengthy questionnaires. That is why App takes a fundamentally different approach to personality profiling. Instead of asking you to rate yourself on a scale of 1 to 5, our AI assistant engages you in genuine conversation — and builds your profile from what you say and how you say it.",
        },
        { type: "heading", tag: "h2", text: "Conversation, Not Interrogation" },
        {
          type: "paragraph",
          text: "When you start a session with App, the AI greets you and begins a natural dialogue. It might ask about your work experiences, how you handle challenges, what motivates you, or what your ideal workday looks like. There are no right or wrong answers.",
        },
        { type: "heading", tag: "h2", text: "The Technology Behind It" },
        {
          type: "paragraph",
          text: "App uses advanced large language models combined with a specialized analysis framework built on established psychological research. The system does not simply categorize your words — it understands nuance, context, and the patterns that emerge across your entire conversation.",
        },
        { type: "heading", tag: "h2", text: "Your Profile Grows Over Time" },
        {
          type: "paragraph",
          text: "Your personality profile is not a one-time snapshot. Each conversation with the AI adds depth and nuance to your existing profile. As you grow professionally, your profile evolves with you.",
        },
      ],
    },
    lt: {
      title: "Kaip AI pokalbiai kuria jūsų profilį",
      description:
        "Sužinokite, kaip mūsų AI asistentas naudoja natūralų pokalbį jūsų asmenybei analizuoti 7 dimensijose.",
      summary: "Mūsų AI agentas naudoja natūralų pokalbį vietoj formų asmenybės duomenims rinkti.",
      sections: [
        {
          type: "paragraph",
          text: "Niekas nemėgsta pildyti ilgų klausimynų. Todėl App taiko iš esmės kitokį požiūrį į asmenybės profiliavimą. Mūsų AI asistentas įtraukia jus į tikrą pokalbį ir kuria jūsų profilį.",
        },
        { type: "heading", tag: "h2", text: "Pokalbis, ne apklausa" },
        {
          type: "paragraph",
          text: "Kai pradedate sesiją su App, AI pasisveikina ir pradeda natūralų dialogą. Nėra teisingų ar neteisingų atsakymų.",
        },
        { type: "heading", tag: "h2", text: "Technologija už to" },
        {
          type: "paragraph",
          text: "App naudoja pažangius didelius kalbos modelius kartu su specializuota analizės sistema, paremta pripažintais psichologiniais tyrimais.",
        },
        { type: "heading", tag: "h2", text: "Jūsų profilis auga laikui bėgant" },
        {
          type: "paragraph",
          text: "Jūsų asmenybės profilis nėra vienkartinis momentinis vaizdas. Kiekvienas pokalbis su AI prideda gilumo ir niuansų esamam profiliui.",
        },
      ],
    },
  });

  // ─── Post 3: Finding Your Perfect Career Match ─────────────────────────

  await ensurePost({
    slug: "finding-perfect-career-match",
    categoryId: useCasesId,
    date: "2026-02-10T10:00:00.000Z",
    featured: true,
    en: {
      title: "Finding Your Perfect Career Match with App",
      description:
        "See how App uses your personality profile to match you with jobs that align with who you are, not just what you have done.",
      summary:
        "App goes beyond resume keywords to match your personality, values, and work style with positions where you will actually thrive.",
      sections: [
        {
          type: "paragraph",
          text: "Most job matching platforms work on keywords. They match 'Python developer' with jobs that mention 'Python'. But anyone who has worked in tech knows that your programming language matters far less than how you collaborate, handle ambiguity, and stay motivated through long projects.",
        },
        { type: "heading", tag: "h2", text: "Beyond the Resume" },
        {
          type: "paragraph",
          text: "Your AI profile captures dimensions that no resume can. Your metaprograms reveal whether you thrive in structured environments or creative chaos. Your identity dimension shows what kind of work gives you a sense of purpose.",
        },
        { type: "heading", tag: "h2", text: "How Matching Works" },
        {
          type: "paragraph",
          text: "Every job position on App also has a profile. Employers describe their team culture, the challenges of the role, the management style, and what success looks like. Our AI converts this into a job profile that can be directly compared against candidate profiles.",
        },
        { type: "heading", tag: "h2", text: "Start Your Journey" },
        {
          type: "paragraph",
          text: "Getting matched is simple. Create your profile through a conversation with our AI, and you will immediately start seeing positions ranked by compatibility. Your career path should not be left to keyword algorithms.",
        },
      ],
    },
    lt: {
      title: "Tobulo karjeros atitikimo radimas su App",
      description:
        "Sužinokite, kaip App naudoja jūsų asmenybės profilį, kad suderintų jus su darbais, atitinkančiais tai, kas jūs esate.",
      summary:
        "App pranoksta CV raktažodžius, derindamas jūsų asmenybę, vertybes ir darbo stilių su pozicijomis.",
      sections: [
        {
          type: "paragraph",
          text: "Dauguma darbo paieškos platformų veikia pagal raktažodžius. Tačiau programavimo kalba svarbi kur kas mažiau nei tai, kaip bendradarbiaujate ir tvarkotės su neaiškumais.",
        },
        { type: "heading", tag: "h2", text: "Toliau nei CV" },
        {
          type: "paragraph",
          text: "Jūsų AI profilis fiksuoja dimensijas, kurių joks CV negali. Jūsų metaprogramos atskleidžia, ar klestite struktūruotose aplinkose, ar kūrybiniame chaose.",
        },
        { type: "heading", tag: "h2", text: "Kaip veikia derinimas" },
        {
          type: "paragraph",
          text: "Kiekviena darbo pozicija App taip pat turi profilį. Mūsų AI tai paverčia darbo profiliu, kurį galima tiesiogiai palyginti su kandidatų profiliais.",
        },
        { type: "heading", tag: "h2", text: "Pradėkite savo kelionę" },
        {
          type: "paragraph",
          text: "Derinimas yra paprastas. Sukurkite savo profilį per pokalbį su mūsų AI ir iš karto pradėsite matyti pozicijas, surikiuotas pagal suderinamumą.",
        },
      ],
    },
  });

  // ─── Post 4: The Science of Team Compatibility ────────────────────────

  await ensurePost({
    slug: "science-of-team-compatibility",
    categoryId: psychologyId,
    date: "2026-02-14T10:00:00.000Z",
    en: {
      title: "The Science of Team Compatibility",
      description:
        "Why some teams click and others clash — and how personality profiling can predict team dynamics before the first day.",
      summary:
        "Research shows that team performance depends more on personality compatibility than individual talent. Learn how our assessment framework helps build balanced teams.",
      sections: [
        {
          type: "paragraph",
          text: "Google's Project Aristotle famously found that the best teams are not made of the smartest individuals. They are made of people whose working styles complement each other. The question is: how do you measure compatibility before you hire?",
        },
        { type: "heading", tag: "h2", text: "The Complementary Principle" },
        {
          type: "paragraph",
          text: "High-performing teams rarely consist of identical personalities. They need a mix — a strategic thinker paired with an action-oriented executor, a detail-focused analyst working alongside a big-picture visionary. Our assessment framework makes these complementary patterns visible and measurable.",
        },
        { type: "heading", tag: "h2", text: "Predicting Friction Points" },
        {
          type: "paragraph",
          text: "When two team members share the same shadow patterns, conflicts are predictable. When their metaprograms clash — one moving toward goals while the other moves away from problems — communication breaks down. By mapping these patterns in advance, managers can intervene before small misunderstandings become major conflicts.",
        },
        { type: "heading", tag: "h2", text: "Building Your Team Profile" },
        {
          type: "paragraph",
          text: "With App, you can profile your entire existing team and generate a composite team personality map. This reveals gaps — perhaps your team lacks a strong intuitive thinker, or everyone shares the same blind spot around risk assessment. Knowing your gaps tells you exactly who to hire next.",
        },
      ],
    },
    lt: {
      title: "Komandos suderinamumo mokslas",
      description:
        "Kodėl kai kurios komandos veikia puikiai, o kitos konfliktuoja — ir kaip asmenybės profiliavimas gali numatyti komandos dinamiką.",
      summary:
        "Tyrimai rodo, kad komandos rezultatai labiau priklauso nuo asmenybių suderinamumo nei nuo individualaus talento.",
      sections: [
        {
          type: "paragraph",
          text: "Google projektas Aristotle nustatė, kad geriausios komandos susideda ne iš protingiausių individų. Jos susideda iš žmonių, kurių darbo stiliai vienas kitą papildo. Klausimas: kaip išmatuoti suderinamumą prieš įdarbinant?",
        },
        { type: "heading", tag: "h2", text: "Papildymo principas" },
        {
          type: "paragraph",
          text: "Aukšto našumo komandos retai susideda iš identiškų asmenybių. Joms reikia mišinio — strateginio mąstytojo su veiksmo orientuotu vykdytoju, detalėms dėmesingo analitiko su vizionierium. Mūsų vertinimo sistema padaro šiuos papildančius modelius matomus.",
        },
        { type: "heading", tag: "h2", text: "Trinties taškų prognozavimas" },
        {
          type: "paragraph",
          text: "Kai du komandos nariai dalinasi tais pačiais šešėlio modeliais, konfliktai yra nuspėjami. Iš anksto žinodami šiuos modelius, vadovai gali įsikišti, kol nedideli nesusipratimai netampa dideliais konfliktais.",
        },
        { type: "heading", tag: "h2", text: "Komandos profilio kūrimas" },
        {
          type: "paragraph",
          text: "Su App galite profiliuoti visą esamą komandą ir sukurti bendrą komandos asmenybės žemėlapį. Tai atskleidžia spragas — galbūt jūsų komandai trūksta intuityvaus mąstytojo. Žinodami spragas, tiksliai žinote, ką samdyti toliau.",
        },
      ],
    },
  });

  // ─── Post 5: 5 Signs You Are in the Wrong Career ─────────────────────

  await ensurePost({
    slug: "5-signs-wrong-career",
    categoryId: careerTipsId,
    date: "2026-02-18T10:00:00.000Z",
    en: {
      title: "5 Signs You Are in the Wrong Career",
      description:
        "Feeling stuck or unfulfilled at work? These five personality-based signals might mean your career does not match who you really are.",
      summary:
        "When your career misaligns with your core personality dimensions, the signs show up in predictable ways. Here is what to watch for.",
      sections: [
        {
          type: "paragraph",
          text: "Everyone has bad days at work. But if the dissatisfaction runs deeper — if Sunday evenings fill you with dread, or you feel like you are performing a role rather than being yourself — your career might be misaligned with who you actually are.",
        },
        { type: "heading", tag: "h2", text: "1. You Constantly Feel Drained" },
        {
          type: "paragraph",
          text: "Not tired from hard work — that can be satisfying. Drained from pretending. When your role requires you to operate against your natural behavioral patterns day after day, the energy cost is enormous. An introvert forced into constant networking, or a creative thinker trapped in rigid processes, burns out not from the volume of work but from the misfit.",
        },
        { type: "heading", tag: "h2", text: "2. You Have Stopped Growing" },
        {
          type: "paragraph",
          text: "Growth stalls when your work does not engage your core motivations. If your Mission dimension craves impact but your job is purely transactional, you will stop investing in skill development because the return feels empty.",
        },
        { type: "heading", tag: "h2", text: "3. Your Values Feel Compromised" },
        {
          type: "paragraph",
          text: "The Identity dimension of your profile includes your core values. When these clash with your workplace culture — when you value transparency but work in a political environment — the cognitive dissonance erodes job satisfaction over time.",
        },
        { type: "heading", tag: "h2", text: "4. You Envy People in Other Fields" },
        {
          type: "paragraph",
          text: "Pay attention to envy. It is your personality telling you where it wants to be. If you consistently envy the work of designers, teachers, or entrepreneurs, your archetypes and metaprograms are signaling a better fit.",
        },
        { type: "heading", tag: "h2", text: "5. You Cannot See a Future" },
        {
          type: "paragraph",
          text: "When your Fit and Future dimension is misaligned, you cannot picture yourself in this career in five years. Not because of practical concerns, but because the trajectory does not resonate with your sense of self. This is the strongest signal that a change is needed.",
        },
      ],
    },
    lt: {
      title: "5 Ženklai, Kad Esate Netinkamoje Karjeroje",
      description:
        "Jaučiatės įstrigę ar neišnaudojami darbe? Šie penki asmenybės signalai gali reikšti, kad jūsų karjera neatitinka to, kas jūs iš tikrųjų esate.",
      summary:
        "Kai jūsų karjera nesutampa su pagrindinėmis asmenybės dimensijomis, ženklai pasirodo nuspėjamai.",
      sections: [
        {
          type: "paragraph",
          text: "Kiekvienas turi blogų dienų darbe. Bet jei nepasitenkinimas gilesnis — jei sekmadienio vakarai kelia siaubą, ar jaučiatės tarsi vaidinate — jūsų karjera gali būti nesutapusi su tuo, kas iš tikrųjų esate.",
        },
        { type: "heading", tag: "h2", text: "1. Nuolat Jaučiatės Išsekę" },
        {
          type: "paragraph",
          text: "Ne pavargę nuo sunkaus darbo — tai gali būti malonu. Išsekę nuo apsimetinėjimo. Kai jūsų vaidmuo verčia veikti prieš natūralius elgesio modelius, energijos kaina didžiulė.",
        },
        { type: "heading", tag: "h2", text: "2. Nustojote Augti" },
        {
          type: "paragraph",
          text: "Augimas sustoja, kai jūsų darbas neįtraukia pagrindinių motyvacijų. Jei jūsų Misijos dimensija trokšta įtakos, bet darbas yra grynai transakcinis, nustojate investuoti į įgūdžių tobulinimą.",
        },
        { type: "heading", tag: "h2", text: "3. Jūsų Vertybės Kompromituojamos" },
        {
          type: "paragraph",
          text: "Tapatumo dimensija apima jūsų pagrindines vertybes. Kai jos kertasi su darbo vietos kultūra, kognityvinis disonansas mažina darbo pasitenkinimą.",
        },
        { type: "heading", tag: "h2", text: "4. Pavydite Žmonėms Kitose Srityse" },
        {
          type: "paragraph",
          text: "Stebėkite pavydą. Tai jūsų asmenybė sako, kur nori būti. Jei nuolat pavydite dizainerių, mokytojų ar verslininkų darbo, jūsų archetipai signalizuoja geresnį atitikimą.",
        },
        { type: "heading", tag: "h2", text: "5. Nematote Ateities" },
        {
          type: "paragraph",
          text: "Kai jūsų Tinkamumo ir Ateities dimensija nesutampa, negalite įsivaizduoti savęs šioje karjeroje po penkerių metų. Tai stipriausias signalas, kad reikalingas pokytis.",
        },
      ],
    },
  });

  // ─── Post 6: Understanding Metaprograms ───────────────────────────────

  await ensurePost({
    slug: "understanding-metaprograms-decision-making",
    categoryId: psychologyId,
    date: "2026-02-20T10:00:00.000Z",
    en: {
      title: "Understanding Metaprograms: The Hidden Filters Behind Your Decisions",
      description:
        "Metaprograms are the unconscious mental filters that shape how you process information, make decisions, and interact with the world.",
      summary:
        "Discover the hidden cognitive patterns that influence every decision you make — from choosing lunch to choosing your career.",
      sections: [
        {
          type: "paragraph",
          text: "Every second, your brain processes millions of bits of information. To manage this flood, it uses unconscious filters called metaprograms. These filters determine what you pay attention to, how you evaluate options, and what actions you take. Understanding your metaprograms is like getting the user manual for your own mind.",
        },
        { type: "heading", tag: "h2", text: "Toward vs. Away From" },
        {
          type: "paragraph",
          text: "One of the most fundamental metaprograms is your motivational direction. Toward-motivated people focus on what they want to achieve. Away-from-motivated people focus on what they want to avoid. Neither is better — but placing a toward person in a risk-management role, or an away-from person in a sales role, creates friction.",
        },
        { type: "heading", tag: "h2", text: "Big Picture vs. Detail" },
        {
          type: "paragraph",
          text: "Some people naturally think in abstractions and overviews. Others think in specifics and sequences. In the workplace, big-picture thinkers excel at strategy but may miss implementation details. Detail-oriented thinkers excel at execution but may lose sight of the broader goal.",
        },
        { type: "heading", tag: "h2", text: "Internal vs. External Reference" },
        {
          type: "paragraph",
          text: "Do you evaluate your own performance based on your internal standards, or do you need external feedback? Internally referenced people are self-motivated but may resist coaching. Externally referenced people are coachable but may struggle with autonomous roles.",
        },
        { type: "heading", tag: "h2", text: "Why This Matters for Your Career" },
        {
          type: "paragraph",
          text: "When your job aligns with your metaprograms, work feels natural. When it clashes, every task requires extra mental effort. Our AI profile maps your metaprograms precisely, helping you find roles where your natural cognitive style is an asset rather than an obstacle.",
        },
      ],
    },
    lt: {
      title: "Metaprogramų supratimas: paslėpti filtrai už jūsų sprendimų",
      description:
        "Metaprogramos yra nesąmoningi mentaliniai filtrai, formuojantys tai, kaip apdorojate informaciją ir priimate sprendimus.",
      summary:
        "Atraskite paslėptus kognityvinius modelius, kurie įtakoja kiekvieną jūsų sprendimą.",
      sections: [
        {
          type: "paragraph",
          text: "Kiekvieną sekundę jūsų smegenys apdoroja milijonus informacijos bitų. Šiam srautui valdyti naudojami nesąmoningi filtrai — metaprogramos. Šie filtrai nulemia, kam skiriate dėmesį, kaip vertinate galimybes ir kokius veiksmus atliekate.",
        },
        { type: "heading", tag: "h2", text: "Link vs. Nuo" },
        {
          type: "paragraph",
          text: 'Viena fundamentaliausių metaprogramų yra jūsų motyvacinė kryptis. "Link" motyvuoti žmonės fokusuojasi į tai, ko nori pasiekti. "Nuo" motyvuoti — į tai, ko nori išvengti. Nė vienas nėra geresnis, bet netinkamas derinys su pozicija sukuria trintį.',
        },
        { type: "heading", tag: "h2", text: "Bendras vaizdas vs. Detalės" },
        {
          type: "paragraph",
          text: "Kai kurie žmonės natūraliai mąsto abstrakcijomis ir apžvalgomis. Kiti mąsto konkrečiais dalykais ir sekomis. Darbo vietoje strateginio mąstymo žmonės puikiai kuria strategiją, bet gali praleisti įgyvendinimo detales.",
        },
        { type: "heading", tag: "h2", text: "Vidinė vs. Išorinė nuoroda" },
        {
          type: "paragraph",
          text: "Ar vertinate savo veiklą pagal vidinius standartus, ar reikia išorinio grįžtamojo ryšio? Vidine nuoroda besivadovaujantys žmonės yra savimotyvuoti, bet gali priešintis koučingui.",
        },
        { type: "heading", tag: "h2", text: "Kodėl tai svarbu jūsų karjerai" },
        {
          type: "paragraph",
          text: "Kai jūsų darbas sutampa su metaprogramomis, darbas jaučiasi natūraliai. Kai kertasi, kiekviena užduotis reikalauja papildomų mentalinių pastangų. Mūsų AI profilis tiksliai atvaizduoja jūsų metaprogramas.",
        },
      ],
    },
  });

  console.log("Done.");
  process.exit(0);
}

main().catch(err => {
  console.error("Seed failed:", err);
  process.exit(1);
});
