import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { SiteNav } from "@/components/site-nav";
import { WebsiteJsonLd } from "@/components/json-ld";
import { SITE_URL } from "@/lib/site";
import { AnalyticsConsent } from "@/components/analytics-consent";
import { LAST_CHECKED, game } from "@/data/game";

// Fonts: Space Grotesk + JetBrains Mono arrive through @fontsource-variable
// imports in globals.css (self-hosted woff2 inside the npm packages), so the
// build never waits on a Google Fonts download — that failure mode broke a
// Cloudflare build in this fleet on 2026-10-06.

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Be a YouTuber codes (working, October 2026)",
    template: "%s | Become a YouTuber Codes",
  },
  description:
    "Every working Be a YouTuber! 🔴🎥 code with its exact reward, cross-checked against independent trackers — plus an honest status page for the newer Become a Youtuber! 💻, which has no codes yet. Fan-made, every code has a source.",
  openGraph: {
    type: "website",
    siteName: "Become a YouTuber Codes",
    images: [{ url: "/images/og.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/og.jpg"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="flex min-h-full flex-col antialiased">
        <WebsiteJsonLd name="Become a YouTuber Codes" />
        <SiteNav />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <AnalyticsConsent />
      </body>
    </html>
  );
}

function SiteFooter() {
  return (
    <footer className="mt-24 border-t rule">
      <div className="mx-auto w-full max-w-6xl px-5 py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-md">
            <p className="text-sm font-medium">Become a YouTuber Codes</p>
            <p className="mt-2 text-sm text-muted-foreground">
              An independent codes reference for {game.name} on Roblox. Not
              affiliated with {game.developer}, Incrementality Inc, or Roblox
              Corporation. Game names and assets belong to their owners.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Last source pass: {LAST_CHECKED}
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm" aria-label="Footer">
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              Codes
            </Link>
            <Link
              href="/become-a-youtuber/"
              className="text-muted-foreground hover:text-foreground"
            >
              Become a Youtuber! 💻
            </Link>
            <Link href="/about/" className="text-muted-foreground hover:text-foreground">
              About
            </Link>
          </nav>
        </div>
        <div className="mt-8 flex items-center justify-between border-t rule pt-6">
          <p className="text-xs text-muted-foreground">
            Tracker-reported where marked. Codes are case-sensitive — copy, don&apos;t retype.
          </p>
        </div>
      </div>
    </footer>
  );
}
