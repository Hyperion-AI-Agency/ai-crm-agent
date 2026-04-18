/**
 * Seed script: populates the Pages collection with legal pages
 * (Terms of Service, Privacy Policy, Cookie Preferences) in both
 * English and Lithuanian, using the exact content from the original
 * i18n translation files.
 *
 * Usage:
 *   pnpm --filter app db:seed-legal
 *
 * The script is idempotent – skips pages that already exist.
 */
import "dotenv/config";

import { getPayload } from "payload";

import config from "../payload.config";
import { buildRichText, type LexicalRoot } from "./seed-utils";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildLegalRichText(sections: { title: string; content: string }[]): LexicalRoot {
  return buildRichText(
    sections.flatMap(s => [
      { type: "heading" as const, tag: "h2", text: s.title },
      { type: "paragraph" as const, text: s.content },
    ])
  );
}

// ─── Content ──────────────────────────────────────────────────────────────────

const TOS_EN = {
  heroTitle: "Terms of Service",
  heroSubtitle: "Last Updated: January 2025",
  sections: [
    {
      title: "1. Agreement to Terms",
      content:
        "Welcome to [Company Name]. These Terms of Service ('Terms') govern your access to and use of the [Company Name] platform, including our website, mobile applications, and related services (collectively, the 'Service'). By accessing or using our Service, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you may not access or use the Service. These Terms form a legally binding agreement between you ('User', 'you', 'your') and [Company Name] ('Company', 'we', 'us', 'our'). [Company Name] is operated from Vilnius, Lithuania. You must be at least 16 years old to use the Service. By using the Service, you represent and warrant that you meet this age requirement and have the legal capacity to enter into this agreement.",
    },
    {
      title: "2. Service Description",
      content:
        "[Company Name] is a Software-as-a-Service (SaaS) platform that provides AI-powered career matching and talent management solutions. Our Service enables: (a) creation and analysis of comprehensive 7-dimensional psychological profiles; (b) intelligent job matching based on multi-dimensional compatibility; (c) career development insights and personalized recommendations; (d) employer tools for candidate screening, evaluation, and team building; (e) collaborative features for HR teams and hiring managers. The Service is provided on a subscription basis with different tiers offering varying levels of access and functionality. We continuously update and improve the Service, and we reserve the right to modify, suspend, or discontinue features at any time. While we strive for high availability, we do not guarantee uninterrupted, secure, or error-free operation of the Service.",
    },
    {
      title: "3. Account Registration and Security",
      content:
        "To access the Service, you must create an account by providing accurate, current, and complete registration information. You are solely responsible for: (a) maintaining the confidentiality and security of your account credentials; (b) all activities that occur under your account, whether authorized or not; (c) immediately notifying us of any unauthorized use or security breach; (d) ensuring your account information remains accurate and up-to-date. You may not share, transfer, or sell your account to another person. Each user may maintain only one account. We reserve the right to suspend or terminate accounts that violate these Terms, engage in fraudulent activity, or abuse the Service. You may deactivate your account at any time through your account settings, subject to our data retention policies as outlined in our Privacy Policy.",
    },
    {
      title: "4. Subscription Plans, Billing, and Payments",
      content:
        "The Service is offered through various subscription plans with different features and pricing. By subscribing, you agree to: (a) pay all fees associated with your selected subscription plan in advance; (b) automatic renewal of your subscription at the end of each billing period unless you cancel before the renewal date; (c) price changes with at least 30 days' written notice via email; (d) no refunds for partial billing periods, except as required by applicable consumer protection laws in your jurisdiction. We accept major credit cards and other payment methods as displayed during checkout. You authorize us to charge your designated payment method automatically for all subscription fees. If payment fails, we may suspend your account until payment is received. After 30 days of non-payment, we may terminate your account. All fees are stated in the currency displayed at checkout and are exclusive of applicable taxes, which you are responsible for paying. You may upgrade, downgrade, or cancel your subscription at any time through your account settings. Cancellations take effect at the end of your current billing period.",
    },
    {
      title: "5. User Content, Data, and Intellectual Property",
      content:
        "You retain ownership of all content, data, and information you submit, upload, or create through the Service ('User Content'), including your [Company Name] profile data, assessment responses, job applications, and communications. By using the Service, you grant [Company Name] a worldwide, non-exclusive, royalty-free, perpetual, and irrevocable license to: (a) use, store, process, and analyze your User Content to provide and improve the Service; (b) create aggregated, anonymized data for analytics and service improvement; (c) share your profile information with potential employers only when you explicitly opt-in to job matching features. You represent and warrant that: (a) you own or have all necessary rights to your User Content; (b) your User Content does not infringe any third-party intellectual property, privacy, or other rights; (c) your User Content is accurate, truthful, and not misleading. We reserve the right to review, modify, or remove User Content that violates these Terms or applicable laws. All Service software, algorithms, designs, text, graphics, logos, and other content are the exclusive property of [Company Name] and are protected by copyright, trademark, patent, and other intellectual property laws. You may not copy, modify, distribute, or create derivative works from the Service without our express written permission.",
    },
    {
      title: "6. Acceptable Use and Prohibited Activities",
      content:
        "You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree NOT to: (a) use the Service for any illegal purpose or in violation of any applicable laws or regulations; (b) impersonate any person or entity, or provide false, misleading, or inaccurate information; (c) interfere with, disrupt, or damage the Service, servers, or networks connected to the Service; (d) attempt to gain unauthorized access to any portion of the Service, other accounts, or computer systems; (e) upload, transmit, or distribute viruses, malware, or other harmful code; (f) harass, abuse, threaten, or harm other users, or send unsolicited communications; (g) use automated scripts, bots, scrapers, or crawlers to access or collect data from the Service without our express written permission; (h) reverse engineer, decompile, disassemble, or attempt to extract the source code of the Service; (i) use the Service to develop, market, or operate a competing service; (j) violate any intellectual property, privacy, or other rights of third parties; (k) use the Service to discriminate against individuals based on protected characteristics. Violations of this section may result in immediate account suspension or termination, and we reserve the right to pursue legal remedies.",
    },
    {
      title: "7. Privacy and Data Protection",
      content:
        "Your privacy is important to us. Our collection, use, and protection of your personal data is governed by our Privacy Policy, which is incorporated into these Terms by reference. By using the Service, you consent to our data practices as described in the Privacy Policy. Our Privacy Policy complies with the General Data Protection Regulation (GDPR), the California Consumer Privacy Act (CCPA), and other applicable data protection laws. You have certain rights regarding your personal data, including the right to access, correct, delete, restrict processing, and receive a copy of your data. These rights are detailed in our Privacy Policy. We implement industry-standard security measures, including encryption, access controls, and regular security audits. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.",
    },
    {
      title: "8. Service Availability, Disclaimers, and Limitation of Liability",
      content:
        "THE SERVICE IS PROVIDED 'AS IS' AND 'AS AVAILABLE' WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. We disclaim all warranties, including but not limited to implied warranties of merchantability, fitness for a particular purpose, non-infringement, and course of performance. We do not warrant that: (a) the Service will be uninterrupted, secure, or error-free; (b) the accuracy, reliability, or quality of job matches, recommendations, or profile analyses; (c) any defects or errors will be corrected; (d) the Service will meet your specific requirements or expectations. The Service may be subject to scheduled maintenance, updates, or unexpected downtime. We strive to maintain 99.9% uptime but do not guarantee specific availability levels. To the maximum extent permitted by applicable law, [Company Name], its affiliates, officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to lost profits, revenue, data, or business opportunities, even if we have been advised of the possibility of such damages. Our total aggregate liability for any claims arising from or related to the Service shall not exceed the total amount you paid to us in the twelve (12) months preceding the claim. Some jurisdictions do not allow the exclusion or limitation of certain damages, so some of the above limitations may not apply to you.",
    },
    {
      title: "9. Indemnification",
      content:
        "You agree to indemnify, defend, and hold harmless [Company Name], its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from: (a) your use of the Service; (b) your violation of these Terms; (c) your violation of any third-party rights; (d) your User Content. We reserve the right to assume exclusive defense and control of any matter subject to indemnification, and you agree to cooperate with our defense.",
    },
    {
      title: "10. Termination",
      content:
        "We may suspend or terminate your access to the Service immediately, without notice, for: (a) violation of these Terms; (b) fraudulent or illegal activity; (c) non-payment; (d) extended inactivity. You may terminate your account at any time. Upon termination: (a) your right to use the Service ceases; (b) we may delete your account and data (subject to legal retention requirements); (c) provisions that by their nature should survive will continue, including intellectual property, disclaimers, indemnification, and limitation of liability.",
    },
    {
      title: "11. Dispute Resolution, Governing Law, and Jurisdiction",
      content:
        "These Terms shall be governed by and construed in accordance with the laws of the Republic of Lithuania, without regard to its conflict of law provisions. For consumers residing in the European Union, the mandatory consumer protection laws of your country of residence may apply and cannot be excluded by these Terms. Any disputes, controversies, or claims arising out of or relating to these Terms or the Service shall first be addressed through good faith negotiations between the parties. If such negotiations fail to resolve the dispute within 60 days, the dispute shall be resolved exclusively in the competent courts of Vilnius, Lithuania. However, if you are a consumer residing in the EU, you may also bring proceedings in the courts of your country of residence. EU consumers have the right to use the European Online Dispute Resolution platform (https://ec.europa.eu/consumers/odr/) to resolve disputes. You agree to waive any right to participate in a class-action lawsuit or class-wide arbitration. If any provision of this section is found to be unenforceable, the remaining provisions shall remain in full effect.",
    },
    {
      title: "12. Modifications to Terms, Severability, and Contact",
      content:
        "We reserve the right to modify, update, or replace these Terms at any time at our sole discretion. Material changes will be communicated to you via email (to the address associated with your account) or through a prominent notice on the Service at least 30 days before the changes take effect. Your continued use of the Service after such modifications constitutes your acceptance of the updated Terms. If you do not agree to the modified Terms, you must discontinue use of the Service and may terminate your account. If any provision of these Terms is found to be invalid, illegal, or unenforceable, the remaining provisions shall continue in full force and effect. These Terms, together with our Privacy Policy and any other legal notices published on the Service, constitute the entire agreement between you and [Company Name] regarding your use of the Service and supersede all prior agreements. For questions, concerns, or legal notices regarding these Terms, please contact us at: [Company Name], Email: contact@[company-domain].com, Address: Vilnius, Lithuania. We will respond to your inquiry within a reasonable timeframe.",
    },
  ],
};

const TOS_LT = {
  heroTitle: "Naudojimo Sąlygos",
  heroSubtitle: "Paskutinį kartą atnaujinta: 2025 m. Sausis",
  sections: [
    {
      title: "1. Susitarimo Priėmimas",
      content:
        "Sveiki atvykę į [Company Name]. Šios Naudojimo Sąlygos ('Sąlygos') reglamentuoja jūsų prieigą prie ir naudojimąsi [Company Name] platforma, įskaitant mūsų svetainę, mobiliąsias programas ir susijusias paslaugas (kartu - 'Paslauga'). Pasiekdami arba naudodamiesi mūsų Paslauga, jūs sutinkate laikytis šių Sąlygų ir mūsų Privatumo Politikos. Jei nesutinkate su šiomis Sąlygomis, negalite pasiekti arba naudotis Paslauga. Šios Sąlygos sudaro teisiškai privalomą susitarimą tarp jūsų ('Vartotojas', 'jūs', 'jūsų') ir [Company Name] ('Įmonė', 'mes', 'mūsų'). [Company Name] veikia iš Vilniaus, Lietuva. Jūs turite būti mažiausiai 16 metų, kad galėtumėte naudotis Paslauga. Naudodamiesi Paslauga, jūs patvirtinate ir garantuojate, kad atitinkate šį amžiaus reikalavimą ir turite teisinį sugebėjimą sudaryti šį susitarimą.",
    },
    {
      title: "2. Paslaugos Aprašymas",
      content:
        "[Company Name] yra Programinės įrangos kaip paslaugos (SaaS) platforma, teikianti AI pagrįstas karjeros derinimo ir talentų valdymo sprendimus. Mūsų Paslauga leidžia: (a) sukurti ir analizuoti išsamius 7 dimensijų psichologinius profilius; (b) protingą darbo derinimą pagal daugiamatį suderinamumą; (c) karjeros plėtros įžvalgas ir asmeninius rekomendacijas; (d) darbdavių įrankius kandidatų atrankai, vertinimui ir komandų formavimui; (e) bendradarbiavimo funkcijas HR komandoms ir įdarbinimo vadovams. Paslauga teikiama pagal prenumeratos principą su skirtingais lygiais, siūlančiais įvairius prieigos ir funkcionalumo lygius. Mes nuolat atnaujiname ir tobulename Paslaugą, ir pasiliekame teisę bet kada modifikuoti, sustabdyti arba nutraukti funkcijas. Nors siekiame aukšto prieinamumo, negarantuojame nepertraukiamo, saugaus arba be klaidų Paslaugos veikimo.",
    },
    {
      title: "3. Paskyros Registracija ir Saugumas",
      content:
        "Norint pasiekti Paslaugą, turite sukurti paskyrą, pateikdami tikslią, dabartinę ir pilną registracijos informaciją. Jūs esate vienintelis atsakingas už: (a) paskyros duomenų konfidencialumą ir saugumą; (b) visą veiklą, vykstančią pagal jūsų paskyrą, arba autorizuotą, arba ne; (c) nedelsiant pranešti apie bet kokį neteisėtą naudojimą arba saugumo pažeidimą; (d) užtikrinti, kad jūsų paskyros informacija išlieka tiksli ir atnaujinta. Jūs negalite dalintis, perduoti arba parduoti savo paskyros kitam asmeniui. Kiekvienas vartotojas gali turėti tik vieną paskyrą. Mes pasiliekame teisę sustabdyti arba nutraukti paskyras, kurios pažeidžia šias Sąlygas, užsiima sukčiavimu arba piktnaudžiauja Paslauga. Galite deaktyvuoti savo paskyrą bet kada per paskyros nustatymus, atsižvelgiant į mūsų duomenų saugojimo politikas, kaip aprašyta mūsų Privatumo Politikoje.",
    },
    {
      title: "4. Prenumeratos Planai, Atsiskaitymas ir Mokėjimai",
      content:
        "Paslauga siūloma per įvairius prenumeratos planus su skirtingomis funkcijomis ir kainomis. Prenumeruodami sutinkate: (a) mokėti visas mokesčius, susijusius su pasirinktu prenumeratos planu, iš anksto; (b) automatinį jūsų prenumeratos atnaujinimą kiekvieno atsiskaitymo laikotarpio pabaigoje, nebent atšauksite prieš atnaujinimo datą; (c) kainų pakeitimus su mažiausiai 30 dienų raštu pranešimu el. paštu; (d) jokių grąžinimų už dalinius atsiskaitymo laikotarpius, išskyrus pagal taikomus vartotojų apsaugos įstatymus jūsų jurisdikcijoje. Mes priimame pagrindines kredito korteles ir kitus mokėjimo būdus, kaip rodoma atsiskaitymo metu. Jūs autorizuojate mus automatiškai apmokestinti jūsų nurodytą mokėjimo būdą už visas prenumeratos mokesčius. Jei mokėjimas nepavyksta, galime sustabdyti jūsų paskyrą, kol bus gautas mokėjimas. Po 30 dienų nemokėjimo galime nutraukti jūsų paskyrą. Visi mokesčiai nurodyti atsiskaitymo metu rodoma valiuta ir neapima taikomų mokesčių, kuriuos jūs esate atsakingi mokėti. Galite patobulinti, sumažinti arba atšaukti savo prenumeratą bet kada per paskyros nustatymus. Atšaukimai įsigalioja jūsų dabartinio atsiskaitymo laikotarpio pabaigoje.",
    },
    {
      title: "5. Vartotojo Turinys ir Intelektinė Nuosavybė",
      content:
        "Jūs išlaikote turinio, kurį pateikiate ('Vartotojo Turinys'), įskaitant profilio informaciją, įvertinimus ir komunikacijas, nuosavybę. Pateikdami Vartotojo Turinį, suteikiate mums pasaulinę, ne išimtinę, be mokesčių licenciją naudoti, atkurti, modifikuoti ir platinti jį Paslaugos veikimui ir tobulinimui. Jūs patvirtinate, kad: (a) turite arba turite teises į visą Vartotojo Turinį; (b) Vartotojo Turinys nepažeidžia trečiųjų šalių teisių; (c) Vartotojo Turinys yra tikslus ir ne klaidinantis. Mes pasiliekame teisę pašalinti Vartotojo Turinį, kuris pažeidžia šias Sąlygas. Visas Paslaugos turinys, funkcijos ir funkcionalumas priklauso [Company Name] ir yra saugomi autorių teisių, prekių ženklų ir kitų intelektinės nuosavybės įstatymų.",
    },
    {
      title: "6. Draudžiamas Elgesys",
      content:
        "Jūs sutinkate ne: (a) naudoti Paslaugą neteisėtiems tikslams arba pažeidžiant įstatymus; (b) apsimesti kitais arba pateikti neteisingą informaciją; (c) trukdyti Paslaugos veikimui arba saugumui; (d) bandyti neteisėtai pasiekti sistemas arba duomenis; (e) perduoti virusus, kenkėjišką programinę įrangą arba kenkėjišką kodą; (f) siųsti šlamštą, persekioti arba piktnaudžiauti kitais vartotojais; (g) nukrapšyti, naršyti arba naudoti automatizuotus įrankius be leidimo; (h) atvirkštinio inžinerijos arba bandyti išgauti šaltinio kodą; (i) naudoti Paslaugą konkuruoti su mumis arba kurti panašias paslaugas; (j) pažeisti bet kokias trečiųjų šalių teises. Pažeidimai gali sukelti nedelsiant paskyros nutraukimą ir teisinius veiksmus.",
    },
    {
      title: "7. Duomenų Apsauga ir Privatumas",
      content:
        "Jūsų Paslaugos naudojimą taip pat valdo mūsų Privatumo Politika, kuri atitinka BDAR ir kitus taikomus duomenų apsaugos įstatymus. Naudodamiesi Paslauga, sutinkate su mūsų asmeninių duomenų rinkimu, naudojimu ir atskleidimu, kaip aprašyta Privatumo Politikoje. Jūs turite teisių dėl savo asmeninių duomenų, įskaitant prieigą, taisymą, ištrynimą ir duomenų perkeliamumą, kaip išsamiai aprašyta mūsų Privatumo Politikoje. Mes taikome tinkamas saugumo priemones, bet negalime garantuoti absoliutaus saugumo. Jūs esate atsakingi už savo paskyros duomenų saugumą.",
    },
    {
      title: "8. Atsisakymai ir Atsakomybės Apribojimas",
      content:
        "PASLAUGA TEIKIAMA 'KAIP YRA' IR 'KAIP PRIEINAMA' BE JOKIŲ GARANTIJŲ. Mes atsisakome visų garantijų, aiškių arba numanomų, įskaitant parduodamumą, tinkamumą tam tikram tikslui ir nepažeidžiamumą. Mes negarantuojame: (a) nepertraukiamo arba be klaidų Paslaugos; (b) darbo derinimų arba rekomendacijų tikslumo; (c) tam tikrų funkcijų prieinamumo; (d) rezultatų naudojant Paslaugą. Iki didžiausio leistino įstatymų masto, [Company Name] neatsako už netiesioginę, atsitiktinę, ypatingą, pasekmių arba baudžiamąją žalą, įskaitant prarastą pelną, duomenų praradimą arba verslo pertraukimą. Mūsų bendra atsakomybė apribota suma, kurią sumokėjote per 12 mėnesių iki pretenzijos. Kai kurios jurisdikcijos neleidžia šių apribojimų, todėl jie gali jums netaikyti.",
    },
    {
      title: "9. Atlyginimas",
      content:
        "Jūs sutinkate atlyginti, ginti ir išlaisvinti [Company Name], jo pareigūnus, direktorius, darbuotojus ir agentus nuo bet kokių pretenzijų, žalos, nuostolių, atsakomybės ir išlaidų (įskaitant teisinius mokesčius), kylančių iš: (a) jūsų Paslaugos naudojimo; (b) jūsų šių Sąlygų pažeidimo; (c) jūsų bet kokios trečiųjų šalių teisių pažeidimo; (d) jūsų Vartotojo Turinio. Mes pasiliekame teisę prisiimti išimtinę gynybą ir kontrolę bet kokiu atlyginimo klausimu, ir jūs sutinkate bendradarbiauti su mūsų gynyba.",
    },
    {
      title: "10. Nutraukimas",
      content:
        "Mes galime sustabdyti arba nutraukti jūsų prieigą prie Paslaugos nedelsiant, be pranešimo, dėl: (a) šių Sąlygų pažeidimo; (b) sukčiavimo arba neteisėtos veiklos; (c) nemokėjimo; (d) ilgalaikio neaktyvumo. Galite nutraukti savo paskyrą bet kada. Nutraukus: (a) jūsų teisė naudotis Paslauga nutrūksta; (b) galime ištrinti jūsų paskyrą ir duomenis (atsižvelgiant į teisinius saugojimo reikalavimus); (c) nuostatos, kurios pagal savo pobūdį turėtų išlikti, tęsis, įskaitant intelektinę nuosavybę, atsisakymus, atlyginimą ir atsakomybės apribojimą.",
    },
    {
      title: "11. Ginčų Sprendimas ir Taikomas Teisė",
      content:
        "Šios Sąlygos valdomos Lietuvos įstatymų, neatsižvelgiant į teisės konflikto principus. ES vartotojams gali taikytis privalomi jūsų šalies vartotojų apsaugos įstatymai. Bet kokie ginčai turėtų būti sprendžiami per geros valios derybas. Jei derybos nepavyksta, ginčai bus sprendžiami kompetentingose Vilniaus, Lietuva, teismuose. ES vartotojai taip pat gali ieškoti sprendimo per Europos internetinio ginčų sprendimo platformą. Jūs sutinkate atsisakyti bet kokios teisės į teisėjų teismą ir dalyvauti grupinėse bylose.",
    },
    {
      title: "12. Sąlygų Pakeitimai ir Kontaktinė Informacija",
      content:
        "Mes pasiliekame teisę bet kada modifikuoti šias Sąlygas. Esminiai pakeitimai bus pranešti el. paštu arba ryškiu Paslaugos pranešimu mažiausiai 30 dienų prieš įsigaliojant. Jūsų tęstinis naudojimas po pakeitimų reiškia priėmimą. Jei nesutinkate, turite nustoti naudoti Paslaugą ir galite nutraukti savo paskyrą. Dėl klausimų apie šias Sąlygas susisiekite su mumis: [Company Name], El. paštas: contact@[company-domain].com, Vieta: Vilnius, Lietuva. Šios Sąlygos kartu su mūsų Privatumo Politika sudaro visą susitarimą tarp jūsų ir [Company Name] dėl Paslaugos.",
    },
  ],
};

const PP_EN = {
  heroTitle: "Privacy Policy",
  heroSubtitle: "Last Updated: January 2025",
  sections: [
    {
      title: "1. Introduction and Our Commitment to Privacy",
      content:
        "[Company Name] ('Company', 'we', 'us', 'our') operates a Software-as-a-Service platform for career matching and talent management. We are committed to protecting your privacy and handling your personal data with care and transparency. This Privacy Policy explains our practices regarding the collection, use, disclosure, and protection of your personal information when you use our Service. This policy complies with the General Data Protection Regulation (GDPR), the California Consumer Privacy Act (CCPA), and other applicable data protection laws. The data controller responsible for your personal data is [Company Name], with operations based in Vilnius, Lithuania. If you have questions about this Privacy Policy or our data practices, please contact us at contact@[company-domain].com. This policy was last updated on the date indicated above and applies to all users of our Service.",
    },
    {
      title: "2. Personal Information We Collect",
      content:
        "We collect and process the following categories of personal information to provide and improve our Service: (a) Account and Identity Information: full name, email address, phone number, date of birth, profile photo, and account credentials; (b) Professional Profile Data: comprehensive 7-dimensional psychological profile data, assessment responses, career goals, skills, work experience, education history, certifications, and professional preferences; (c) Usage and Technical Data: IP address, browser type and version, device information, operating system, log files, session data, feature usage patterns, clickstream data, and performance metrics; (d) Payment and Transaction Data: subscription plan details, payment method information (processed securely by third-party payment processors), billing address, transaction history, and invoice records; (e) Communication Data: messages sent through the platform, support tickets, feedback, survey responses, and correspondence with our team; (f) Marketing and Preference Data: communication preferences, newsletter subscriptions, and marketing consent status. We collect this information through: direct input when you register or use the Service, automated collection via cookies and tracking technologies, third-party integrations (payment processors, authentication services), and communications you send to us.",
    },
    {
      title: "3. How We Use Your Information and Legal Basis for Processing",
      content:
        "We use your personal information for the following purposes: (a) Service Delivery: to create and maintain your account, generate your [Company Name] profile, provide job matching services, enable employer-candidate connections, and deliver all features of our platform; (b) Payment Processing: to process subscription payments, manage billing, send invoices, and handle payment-related communications; (c) Communication: to respond to your inquiries, provide customer support, send service-related notifications, and communicate important updates about the Service; (d) Service Improvement: to analyze usage patterns, improve our algorithms, develop new features, conduct research, and enhance user experience; (e) Security and Fraud Prevention: to detect and prevent fraud, abuse, security threats, and unauthorized access; (f) Legal Compliance: to comply with applicable laws, regulations, legal processes, and government requests; (g) Marketing: to send promotional communications, newsletters, and marketing materials (only with your consent). Our legal basis for processing includes: (a) Contract Performance: necessary to provide the Service you have subscribed to; (b) Legitimate Interests: for service improvement, security, fraud prevention, and business operations; (c) Consent: for marketing communications and non-essential cookies; (d) Legal Obligation: to comply with tax, accounting, and regulatory requirements.",
    },
    {
      title: "4. How We Share Your Information",
      content:
        "We do not sell, rent, or trade your personal information to third parties for their marketing purposes. We may share your information in the following circumstances: (a) With Your Consent: we share your profile information with potential employers only when you explicitly opt-in to job matching features and consent to profile sharing; (b) Service Providers and Vendors: we engage trusted third-party service providers who assist us in operating the Service, including cloud hosting providers (e.g., AWS, Google Cloud), payment processors (e.g., Stripe), email service providers, analytics services (e.g., Google Analytics), customer support platforms, and security services. These providers are contractually obligated to protect your data and use it solely for the purposes we specify; (c) Business Transfers: in the event of a merger, acquisition, reorganization, or sale of assets, your information may be transferred as part of that transaction; (d) Legal Requirements: we may disclose information when required by law, court order, or government regulation, or to protect our rights, property, or safety, or that of our users; (e) Aggregated and Anonymized Data: we may share aggregated, anonymized data that cannot identify you for research, analytics, or business purposes. For international data transfers outside the European Economic Area, we implement appropriate safeguards including Standard Contractual Clauses approved by the European Commission.",
    },
    {
      title: "5. Data Security and Retention Practices",
      content:
        "We implement industry-standard technical and organizational security measures to protect your personal information: (a) Encryption: we use SSL/TLS encryption for data in transit and encryption at rest for sensitive data stored in our databases; (b) Access Controls: we limit access to personal data to authorized employees, contractors, and service providers who need it to perform their duties, and we require them to maintain confidentiality; (c) Security Monitoring: we regularly monitor our systems for security vulnerabilities and threats, conduct security audits, and maintain incident response procedures; (d) Secure Infrastructure: we use reputable cloud service providers with robust security certifications and maintain secure data centers; (e) Employee Training: we provide regular security and privacy training to our staff. Despite these measures, no method of transmission or storage is 100% secure. We retain your personal data only for as long as necessary to fulfill the purposes outlined in this policy: (a) Active Account Data: retained while your account is active and for 3 years after account closure to allow for account recovery; (b) Transaction and Financial Records: retained for 7 years to comply with tax, accounting, and legal requirements; (c) Marketing Data: retained until you withdraw consent or object to processing; (d) Legal and Compliance: retained as required by applicable laws or to establish, exercise, or defend legal claims. After retention periods expire, we securely delete or anonymize your data in accordance with our data deletion procedures.",
    },
    {
      title: "6. Your Privacy Rights and How to Exercise Them",
      content:
        "Depending on your location, you have certain rights regarding your personal information: (a) Right of Access: you can request a copy of the personal data we hold about you, including what data we have, why we have it, and who we share it with; (b) Right to Rectification: you can request correction of inaccurate or incomplete personal data; (c) Right to Erasure ('Right to be Forgotten'): you can request deletion of your personal data, subject to certain legal exceptions; (d) Right to Restrict Processing: you can request that we limit how we use your data in certain circumstances; (e) Right to Data Portability: you can request to receive your data in a structured, commonly used, and machine-readable format, or have it transferred to another service provider; (f) Right to Object: you can object to processing based on legitimate interests or for direct marketing purposes; (g) Right to Withdraw Consent: where processing is based on consent, you can withdraw consent at any time; (h) Right to Opt-Out of Sale: under CCPA, you have the right to opt-out of the sale of personal information (we do not sell personal information); (i) Right to Non-Discrimination: you have the right not to be discriminated against for exercising your privacy rights; (j) Right to Lodge a Complaint: you can file a complaint with your local data protection authority. To exercise any of these rights, please contact us at contact@[company-domain].com with your request. We will respond within 30 days (or as required by applicable law) and may ask you to verify your identity before processing your request.",
    },
    {
      title: "7. Cookies and Tracking Technologies",
      content:
        "We use cookies and similar technologies: (a) Strictly Necessary: essential for website functionality (no consent required); (b) Analytics: to understand usage patterns and improve services (requires consent); (c) Marketing: for personalized advertising (requires consent). You can manage cookie preferences through our Cookie Preferences page or browser settings. Third-party cookies (e.g., Google Analytics) are subject to their respective privacy policies.",
    },
    {
      title: "8. International Data Transfers",
      content:
        "Your data may be transferred to and processed in countries outside the European Economic Area (EEA). We ensure adequate protection through: (a) Adequacy Decisions: transfers to countries with adequate data protection laws; (b) Standard Contractual Clauses: EU-approved contractual safeguards; (c) Binding Corporate Rules: where applicable. You can request details about specific safeguards by contacting us.",
    },
    {
      title: "9. Children's Privacy",
      content:
        "Our services are not intended for individuals under 16 years of age. We do not knowingly collect personal data from children. If you believe we have collected data from a child, please contact us immediately, and we will delete such information.",
    },
    {
      title: "10. Data Breach Notification",
      content:
        "In the event of a personal data breach that poses a high risk to your rights and freedoms, we will notify you and the relevant supervisory authority within 72 hours, as required by GDPR. Notifications will include the nature of the breach, likely consequences, and measures taken to address it.",
    },
    {
      title: "11. Changes to This Policy",
      content:
        "We may update this Privacy Policy periodically. Material changes will be notified via email or prominent website notice. The 'Last Updated' date indicates when changes were last made. Continued use of our services after changes constitutes acceptance of the updated policy.",
    },
    {
      title: "12. Contact Us and Data Protection Authority",
      content:
        "If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us: [Company Name], Email: contact@[company-domain].com, Address: Vilnius, Lithuania. We are committed to addressing your privacy concerns promptly and transparently. If you are not satisfied with our response, you have the right to lodge a complaint with your local data protection authority. For users in Lithuania, the supervisory authority is the State Data Protection Inspectorate (Valstybinė duomenų apsaugos inspekcija, VDAI). For users in other EU member states, you can find your local data protection authority through the European Data Protection Board. For California residents, you may contact the California Attorney General's office regarding CCPA-related complaints.",
    },
  ],
};

const PP_LT = {
  heroTitle: "Privatumo Politika",
  heroSubtitle: "Paskutinį kartą atnaujinta: 2025 m. Sausis",
  sections: [
    {
      title: "1. Įžanga ir Duomenų Valdytojas",
      content:
        "[Company Name] ('mes', 'mūsų') yra įsipareigojęs saugoti jūsų privatumą. Ši Privatumo Politika paaiškina, kaip mes renkame, naudojame, atskleidžiame ir saugome jūsų asmeninius duomenis pagal Bendrąjį Duomenų Apsaugos Reglamentą (BDAR) ir kitus taikomus duomenų apsaugos įstatymus. Duomenų valdytojas yra [Company Name], esantis Vilniuje, Lietuvoje. Dėl bet kokių duomenų apsaugos klausimų prašome susisiekti su mumis el. paštu contact@[company-domain].com.",
    },
    {
      title: "2. Informacija, Kurią Renkame",
      content:
        "Mes renkame šias asmeninių duomenų kategorijas: (a) Tapatybės Duomenys: vardas, el. pašto adresas, telefono numeris, gimimo data; (b) Profilio Duomenys: [Company Name] profilio informacija, psichologiniai įvertinimai, karjeros pageidavimai, įgūdžiai, darbo patirtis, išsilavinimas; (c) Techniniai Duomenys: IP adresas, naršyklės tipas, įrenginio informacija, naudojimo duomenys, slapukai; (d) Sandorio Duomenys: prenumeratos detalės, mokėjimo informacija, sąskaitos adresas; (e) Komunikacijos Duomenys: žinutės, atsiliepimai, pagalbos užklausos; (f) Rinkodaros Duomenys: pageidavimai gauti rinkodaros komunikacijas. Mes renkame šiuos duomenis per tiesioginius kontaktus (kai registruojatės, kuriate profilį arba susisiekiate su mumis), automatizuotas technologijas (slapukai, analitika) ir trečiųjų šalių šaltinius (mokėjimo procesoriai, autentifikavimo teikėjai).",
    },
    {
      title: "3. Teisinis Pagrindas ir Apdorojimo Tikslas",
      content:
        "Mes apdorojame jūsų asmeninius duomenis remiantis šiais teisiniais pagrindais: (a) Sutikimas: rinkodaros komunikacijoms ir nebūtiniems slapukams; (b) Sutarties Vykdymas: teikti mūsų paslaugas, apdoroti prenumeratas ir vykdyti sutartinius įsipareigojimus; (c) Teisinė Prievolė: laikytis mokesčių, apskaitos ir reguliavimo reikalavimų; (d) Teisėti Interesai: paslaugų tobulinimui, saugumui, sukčiavimo prevencijai ir verslo operacijoms. Mes apdorojame jūsų duomenis, kad: teiktume ir tobulintume [Company Name] profilio derinimo paslaugas, apdorotume mokėjimus ir prenumeratas, bendrautume su jumis, užtikrintume saugumą ir prevencijuotume sukčiavimą, laikytumėmės teisinių prievolių ir siųstume rinkodaros komunikacijas (su jūsų sutikimu).",
    },
    {
      title: "4. Duomenų Dalijimasis ir Trečiųjų Šalių Procesoriai",
      content:
        "Mes neperkame jūsų asmeninių duomenų. Mes galime dalintis jūsų duomenimis su: (a) Paslaugų Teikėjais: debesų talpinimas, mokėjimo procesoriai, el. pašto paslaugos, analitikos teikėjai, klientų pagalbos įrankiai; (b) Verslo Partneriais: darbdaviai (tik su jūsų aiškiu sutikimu darbų derinimui); (c) Teisinėmis Institucijomis: kai to reikalauja įstatymai arba apsaugoti mūsų teises. Visi trečiųjų šalių procesoriai yra sutartimi įpareigoti saugoti jūsų duomenis ir apdoroti juos tik nustatytiems tikslams. Mes užtikriname tinkamas garantijas tarptautiniams duomenų perdavimams, įskaitant Standartines Sutartines Klausas, kur taikoma.",
    },
    {
      title: "5. Duomenų Saugumas ir Laikymas",
      content:
        "Mes taikome technines ir organizacines priemones, įskaitant šifravimą, prieigos kontrolę, reguliarų saugumo vertinimą, saugius duomenų centrus ir darbuotojų mokymą. Mes saugome jūsų asmeninius duomenis tik tiek, kiek būtina: (a) Paskyros Duomenys: kol jūsų paskyra aktyvi ir 3 metus po uždarymo; (b) Sandorio Duomenys: 7 metus mokesčių ir apskaitos tikslams; (c) Rinkodaros Duomenys: iki jūsų atšaukite sutikimą arba prieštaraujate; (d) Teisinės Pretenzijos: kaip reikalauja įstatymai arba teisinėms pretenzijoms nustatyti. Po saugojimo laikotarpių mes saugiai ištriname arba anonimizuojame jūsų duomenis.",
    },
    {
      title: "6. Jūsų BDAR Teisės",
      content:
        "Pagal BDAR jūs turite šias teises: (a) Prieigos Teisė: prašyti jūsų asmeninių duomenų kopijos; (b) Taisymo Teisė: taisyti netikslius arba nepilnus duomenis; (c) Ištrynimo Teisė ('Teisė Būti Pamirštam'): prašyti jūsų duomenų ištrynimo; (d) Apdorojimo Apribojimo Teisė: apriboti, kaip mes naudojame jūsų duomenis; (e) Duomenų Perkeliamumo Teisė: gauti jūsų duomenis struktūruotu formatu; (f) Prieštaravimo Teisė: prieštarauti apdorojimui, pagrįstam teisėtais interesais arba tiesioginei rinkodarai; (g) Sutikimo Atsisakymo Teisė: bet kada atsisakyti sutikimo; (h) Skundo Pateikimo Teisė: pateikti skundą vietinei duomenų apsaugos institucijai. Norėdami pasinaudoti šiomis teisėmis, susisiekite su mumis el. paštu contact@[company-domain].com. Atsakysime per vieną mėnesį.",
    },
    {
      title: "7. Slapukai ir Stebėjimo Technologijos",
      content:
        "Mes naudojame slapukus ir panašias technologijas: (a) Būtini: būtini svetainės funkcionalumui (sutikimo nereikia); (b) Analitika: suprasti naudojimo modelius ir tobulinti paslaugas (reikia sutikimo); (c) Rinkodara: asmeninei reklamai (reikia sutikimo). Galite valdyti slapukų nuostatas per mūsų Slapukų Nuostatų puslapį arba naršyklės nustatymus. Trečiųjų šalių slapukai (pvz., Google Analytics) yra taikomi jų atitinkamoms privatumo politikoms.",
    },
    {
      title: "8. Tarptautiniai Duomenų Perdavimai",
      content:
        "Jūsų duomenys gali būti perduodami ir apdorojami šalyse už Europos Ekonominės Erdvės (EEE) ribų. Mes užtikriname tinkamą apsaugą per: (a) Tinkamumo Sprendimus: perdavimus į šalis su tinkamais duomenų apsaugos įstatymais; (b) Standartines Sutartines Klausas: ES patvirtintas sutartines garantijas; (c) Privalomas Korporacines Taisykles: kur taikoma. Galite prašyti detalių apie konkrečias garantijas susisiekdami su mumis.",
    },
    {
      title: "9. Vaikų Privatumas",
      content:
        "Mūsų paslaugos nėra skirtos asmenims, jaunesniems nei 16 metų. Mes sąmoningai nerenkame asmeninių duomenų iš vaikų. Jei manote, kad mes surinkome duomenis iš vaiko, nedelsiant susisiekite su mumis, ir mes ištrinsime tokią informaciją.",
    },
    {
      title: "10. Duomenų Pažeidimo Pranešimas",
      content:
        "Esant asmeninių duomenų pažeidimui, kuris kelia didelę riziką jūsų teisėms ir laisvėms, mes pranešime jums ir atitinkamai priežiūros institucijai per 72 valandas, kaip reikalauja BDAR. Pranešimai apims pažeidimo pobūdį, tikėtinas pasekmes ir priemones, kuriomis jį spręsime.",
    },
    {
      title: "11. Šios Politikos Pakeitimai",
      content:
        "Mes galime periodiškai atnaujinti šią Privatumo Politiką. Esminiai pakeitimai bus pranešti el. paštu arba ryškiu svetainės pranešimu. 'Paskutinį kartą atnaujinta' data nurodo, kada paskutinį kartą buvo atlikti pakeitimai. Tęstinis mūsų paslaugų naudojimas po pakeitimų reiškia atnaujintos politikos priėmimą.",
    },
    {
      title: "12. Kontaktinė Informacija",
      content:
        "Dėl duomenų apsaugos užklausų, norėdami pasinaudoti savo teisėmis arba pateikti skundus, susisiekite: [Company Name], El. paštas: contact@[company-domain].com, Vieta: Vilnius, Lietuva. Dėl skundų taip pat turite teisę susisiekti su savo vietine duomenų apsaugos institucija. Lietuvoje tai yra Valstybinė Duomenų Apsaugos Inspekcija (VDAI).",
    },
  ],
};

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const payload = await getPayload({ config });

  // Delete existing legal pages so we can recreate cleanly
  const existing = await payload.find({
    collection: "pages",
    where: { slug: { in: ["terms-of-service", "privacy-policy"] } },
    select: { slug: true },
    limit: 10,
  });
  for (const page of existing.docs) {
    await payload.delete({ collection: "pages", id: page.id });
    console.log(`Deleted existing page "${page.slug}".`);
  }

  // ─── Terms of Service ────────────────────────────────────────────────────
  {
    const tos = await payload.create({
      collection: "pages",
      locale: "en",
      data: {
        title: TOS_EN.heroTitle,
        slug: "terms-of-service",
        status: "published",
        layout: [
          { blockType: "hero", title: TOS_EN.heroTitle, subtitle: TOS_EN.heroSubtitle },
          { blockType: "text", content: buildLegalRichText(TOS_EN.sections), alignment: "left" },
        ],
      },
    });

    await payload.update({
      collection: "pages",
      id: tos.id,
      locale: "lt",
      data: {
        title: TOS_LT.heroTitle,
        layout: [
          { blockType: "hero", title: TOS_LT.heroTitle, subtitle: TOS_LT.heroSubtitle },
          { blockType: "text", content: buildLegalRichText(TOS_LT.sections), alignment: "left" },
        ],
      },
    });

    console.log("Terms of Service seeded (en + lt).");
  }

  // ─── Privacy Policy ──────────────────────────────────────────────────────
  {
    const pp = await payload.create({
      collection: "pages",
      locale: "en",
      data: {
        title: PP_EN.heroTitle,
        slug: "privacy-policy",
        status: "published",
        layout: [
          { blockType: "hero", title: PP_EN.heroTitle, subtitle: PP_EN.heroSubtitle },
          { blockType: "text", content: buildLegalRichText(PP_EN.sections), alignment: "left" },
        ],
      },
    });

    await payload.update({
      collection: "pages",
      id: pp.id,
      locale: "lt",
      data: {
        title: PP_LT.heroTitle,
        layout: [
          { blockType: "hero", title: PP_LT.heroTitle, subtitle: PP_LT.heroSubtitle },
          { blockType: "text", content: buildLegalRichText(PP_LT.sections), alignment: "left" },
        ],
      },
    });

    console.log("Privacy Policy seeded (en + lt).");
  }

  console.log("Legal pages seed complete.");
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
