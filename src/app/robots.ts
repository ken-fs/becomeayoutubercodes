import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Next.js writes an RSC payload sidecar beside every page. It is not a
        // page and should not be indexed.
        disallow: ["/*__next", "/__next"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

export const dynamic = "force-static";
