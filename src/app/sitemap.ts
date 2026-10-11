import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "/", priority: 1, freq: "daily" },
    { path: "/become-a-youtuber/", priority: 0.7, freq: "daily" },
    { path: "/about/", priority: 0.3, freq: "monthly" },
  ];

  return staticRoutes.map((r) => ({
    url: SITE_URL + r.path,
    lastModified: now,
    changeFrequency: r.freq,
    priority: r.priority,
  }));
}

export const dynamic = "force-static";
