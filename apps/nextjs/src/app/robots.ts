import type { MetadataRoute } from "next";
import { env } from "@/env";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = env.NEXT_PUBLIC_APP_URL;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/(payload)/",
          "/sign-in",
          "/sign-up",
          "/verify-email",
          "/reset-password",
          "/profile/",
          "/settings/",
          "/chat/",
          "/new",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
