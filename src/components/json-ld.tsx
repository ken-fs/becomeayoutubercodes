import { SITE_URL } from "@/lib/site";
/**
 * Structured data.
 *
 * Only two shapes are emitted: a WebSite node for the site itself, and FAQPage
 * where a page genuinely answers questions. No aggregateRating or
 * reviewCount, because there are no reviews to aggregate.
 */
export function WebsiteJsonLd({ name }: { name: string }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url: SITE_URL,
    description:
      "An independent codes reference for Be a YouTuber! on Roblox: every working code with its reward, cross-checked against independent trackers, plus an honest status page for the newer Become a Youtuber! game.",
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function FaqJsonLd({ items }: { items: { q: string; a: string }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
