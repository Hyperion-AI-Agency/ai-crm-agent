"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";

import "vanilla-cookieconsent/dist/cookieconsent.css";

import * as CookieConsent from "vanilla-cookieconsent";

export function CookieManagerProvider({ children }: { children: React.ReactNode }) {
  const locale = useLocale();

  useEffect(() => {
    const privacyHref = "/privacy-policy";

    CookieConsent.run({
      language: {
        default: locale,
        autoDetect: "document",
        translations: {
          en: {
            consentModal: {
              title: "We use cookies!",
              description:
                'Hi, this website uses essential cookies to ensure its proper operation and tracking cookies to understand how you interact with it. The latter will be set only after consent. <button type="button" data-cc="c-settings" class="cc-link">Let me choose</button>',
              acceptAllBtn: "Accept all",
              acceptNecessaryBtn: "Reject all",
            },
            preferencesModal: {
              title: "Cookie preferences",
              savePreferencesBtn: "Save settings",
              acceptAllBtn: "Accept all",
              acceptNecessaryBtn: "Reject all",
              closeIconLabel: "Close",
              sections: [
                {
                  title: "Cookie usage",
                  description: `I use cookies to ensure the basic functionalities of the website and to enhance your online experience. You can choose for each category to opt-in/out whenever you want. For more details relative to cookies and other sensitive data, please read the full <a href="${privacyHref}" class="cc-link">privacy policy</a>.`,
                },
                {
                  title: "Strictly necessary cookies",
                  description:
                    "These cookies are essential for the proper functioning of my website. Without these cookies, the website would not work properly",
                  linkedCategory: "necessary",
                },
                {
                  title: "Performance and Analytics cookies",
                  description:
                    "These cookies allow the website to remember the choices you have made in the past",
                  linkedCategory: "analytics",
                  cookieTable: {
                    headers: {
                      col1: "Name",
                      col2: "Domain",
                      col3: "Expiration",
                      col4: "Description",
                    },
                    body: [
                      {
                        col1: "^_ga",
                        col2: "google.com",
                        col3: "2 years",
                        col4: "Google Analytics cookie",
                      },
                      {
                        col1: "_gid",
                        col2: "google.com",
                        col3: "1 day",
                        col4: "Google Analytics cookie",
                      },
                    ],
                  },
                },
                {
                  title: "Advertisement and Targeting cookies",
                  description:
                    "These cookies are used to deliver ads that are more relevant to you and your interests",
                  linkedCategory: "targeting",
                },
                {
                  title: "More information",
                  description:
                    'For any queries in relation to my policy on cookies and your choices, please <a class="cc-link" href="/contact">contact me</a>.',
                },
              ],
            },
          },
          lt: {
            consentModal: {
              title: "Mes naudojame slapukus!",
              description:
                'Sveiki, ši svetainė naudoja būtinus slapukus, kad užtikrintų tinkamą veikimą, ir stebėjimo slapukus, kad suprastume, kaip su ja sąveikaujate. Pastarieji bus nustatyti tik po sutikimo. <button type="button" data-cc="c-settings" class="cc-link">Leiskite man pasirinkti</button>',
              acceptAllBtn: "Priimti visus",
              acceptNecessaryBtn: "Atmesti visus",
            },
            preferencesModal: {
              title: "Slapukų nuostatos",
              savePreferencesBtn: "Išsaugoti nuostatas",
              acceptAllBtn: "Priimti visus",
              acceptNecessaryBtn: "Atmesti visus",
              closeIconLabel: "Uždaryti",
              sections: [
                {
                  title: "Slapukų naudojimas",
                  description: `Naudoju slapukus, kad užtikrinčiau pagrindines svetainės funkcijas ir pagerinčiau jūsų interneto patirtį. Galite pasirinkti kiekvienai kategorijai prisijungti/atsijungti bet kada. Daugiau informacijos apie slapukus ir kitus jautrius duomenis rasite <a href="${privacyHref}" class="cc-link">privatumo politikoje</a>.`,
                },
                {
                  title: "Būtini slapukai",
                  description:
                    "Šie slapukai yra būtini mano svetainės tinkamam veikimui. Be šių slapukų svetainė neveiktų tinkamai",
                  linkedCategory: "necessary",
                },
                {
                  title: "Veikimo ir analitikos slapukai",
                  description: "Šie slapukai leidžia svetainei prisiminti jūsų pasirinkimus",
                  linkedCategory: "analytics",
                  cookieTable: {
                    headers: {
                      col1: "Pavadinimas",
                      col2: "Domenas",
                      col3: "Galiojimas",
                      col4: "Aprašymas",
                    },
                    body: [
                      {
                        col1: "^_ga",
                        col2: "google.com",
                        col3: "2 metai",
                        col4: "Google Analytics slapukas",
                      },
                      {
                        col1: "_gid",
                        col2: "google.com",
                        col3: "1 diena",
                        col4: "Google Analytics slapukas",
                      },
                    ],
                  },
                },
                {
                  title: "Reklamos ir tikslinimo slapukai",
                  description:
                    "Šie slapukai naudojami rodyti jums aktualesnes reklamas pagal jūsų interesus",
                  linkedCategory: "targeting",
                },
                {
                  title: "Daugiau informacijos",
                  description:
                    'Dėl bet kokių klausimų dėl mano slapukų politikos ir jūsų pasirinkimų, prašome <a class="cc-link" href="/contact">susisiekti su manimi</a>.',
                },
              ],
            },
          },
        },
      },
      categories: {
        necessary: {
          enabled: true,
          readOnly: true,
        },
        analytics: {
          enabled: false,
          readOnly: false,
        },
        targeting: {
          enabled: false,
          readOnly: false,
        },
      },
      autoClearCookies: true,
      manageScriptTags: true,
    });
  }, [locale]);

  return <>{children}</>;
}
