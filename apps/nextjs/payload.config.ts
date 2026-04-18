import path from "path";
import { fileURLToPath } from "url";
import { Accounts } from "@/payload/collections/auth/Accounts";
import { JWKS } from "@/payload/collections/auth/JWKS";
import { OAuthAccessToken } from "@/payload/collections/auth/OAuthAccessToken";
import { OAuthApplication } from "@/payload/collections/auth/OAuthApplication";
import { OAuthConsent } from "@/payload/collections/auth/OAuthConsent";
import { Sessions } from "@/payload/collections/auth/Sessions";
import { Users } from "@/payload/collections/auth/Users";
import { Verifications } from "@/payload/collections/auth/Verifications";
import { Categories } from "@/payload/collections/Categories";
import { Media } from "@/payload/collections/Media";
import { Pages } from "@/payload/collections/Pages";
import { PageTemplates } from "@/payload/collections/PageTemplates";
import { Subscriptions } from "@/payload/collections/payment/Subscriptions";
import { Posts } from "@/payload/collections/Posts";
import { GlobalSettings } from "@/payload/globals/GlobalSettings";
import { Plans as PlansGlobal } from "@/payload/globals/Plans";
import { poolConfig } from "@/server/db/drizzle";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { seoPlugin } from "@payloadcms/plugin-seo";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { en } from "@payloadcms/translations/languages/en";
import { lt } from "@payloadcms/translations/languages/lt";
import { buildConfig, type SharpDependency } from "payload";
import sharp from "sharp";

import { env } from "./src/env.js";
import { localesConfig } from "./src/lib/i18n/routing";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  localization: {
    locales: (Array.isArray(env.NEXT_PUBLIC_ALL_LOCALES)
      ? env.NEXT_PUBLIC_ALL_LOCALES
      : (env.NEXT_PUBLIC_ALL_LOCALES ?? "lt,en")
          .toString()
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean)
    ).map((code: string) => ({
      label: localesConfig[code as keyof typeof localesConfig]?.name || code,
      code,
    })),
    defaultLocale: env.NEXT_PUBLIC_DEFAULT_LOCALE,
    fallback: true,
  },
  i18n: {
    fallbackLanguage: "lt",
    supportedLanguages: {
      lt,
      en,
    },
  },
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    livePreview: {
      collections: ["posts", "pages"],
    },
    routes: {
      login: "/sign-in",
    },
    components: {
      graphics: {
        Logo: { path: "@/payload/components/Logo" },
        Icon: { path: "@/payload/components/Icon" },
      },
    },
    meta: {
      titleSuffix: " | App",
    },
  },
  // If you'd like to use Rich Text, pass your editor here
  editor: lexicalEditor(),

  // Define and configure your collections in this array
  collections: [
    // Auth
    Users,
    Sessions,
    Accounts,
    Verifications,
    OAuthApplication,
    OAuthAccessToken,
    OAuthConsent,
    JWKS,
    // Payments
    Subscriptions,
    // Content
    Media,
    Categories,
    Posts,
    Pages,
    PageTemplates,
  ],

  // Define and configure your globals in this array
  globals: [GlobalSettings, PlansGlobal],

  // Plugins
  plugins: [
    seoPlugin({
      collections: ["posts", "categories", "pages"],
      uploadsCollection: "media",
      generateTitle: ({ doc }: { doc: Record<string, any> }) => `${doc?.title ?? ""} | App`,
      generateDescription: ({ doc }: { doc: Record<string, any> }) =>
        doc?.content?.description || doc?.content?.summary || "",
      generateURL: ({ doc }: { doc: Record<string, any> }) =>
        doc?.slug ? `${process.env.NEXT_PUBLIC_APP_URL}/blog/${doc.slug}` : "",
      fields: ({ defaultFields }) => [
        ...defaultFields,
        {
          name: "canonical",
          type: "text" as const,
          admin: {
            description: "Include an alternative URL. Overwrites the default URL.",
          },
        },
        {
          name: "siteName",
          type: "text" as const,
          defaultValue: "App",
        },
      ],
    }),
  ],
  // Your Payload secret - should be a complex and secure string, unguessable
  secret: env.PAYLOAD_SECRET,
  typescript: {
    outputFile: path.resolve(dirname, "types/payload-types.ts"),
  },
  // Whichever Database Adapter you're using should go here
  // Mongoose is shown as an example, but you can also use Postgres
  db: postgresAdapter({
    generateSchemaOutputFile: path.resolve(dirname, "src/server/db/schemas/payload-schema.ts"),
    pool: poolConfig,
    idType: "uuid",
    push: false,
  }),
  // If you want to resize images, crop, set focal point, etc.
  // make sure to install it and pass it to the config.
  // This is optional - if you don't need to do these things,
  // you don't need it!
  sharp: sharp as unknown as SharpDependency,
});
