import type { Metadata } from "next";
import Link from "next/link";
import { codes, game, gaps, LAST_CHECKED } from "@/data/game";

export const metadata: Metadata = {
  title: "How this list is sourced",
  description:
    "The provenance rules behind every code on this site: what two independent trackers means, why single-source codes are flagged instead of hidden, and the full list of what nobody has verified.",
  alternates: { canonical: "/about/" },
};

export default function AboutPage() {
  return (
    <article className="mx-auto w-full max-w-6xl px-5">
      <nav className="pt-8 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <span className="px-2 text-border" aria-hidden="true">
          /
        </span>
        <span className="text-foreground">About</span>
      </nav>

      <header className="pt-6 pb-10">
        <p className="tag">About · last pass {LAST_CHECKED}</p>
        <h1 className="mt-3 max-w-[24ch] text-3xl font-semibold tracking-tight sm:text-4xl">
          Where every code comes from
        </h1>
        <p className="mt-4 max-w-[64ch] text-muted-foreground">
          {game.name} has no official wiki and no announcement feed outside its
          game page and group, so codes travel through trackers — and trackers
          copy each other, typos included. This site exists to slow that game of
          telephone down. Here is the rulebook it follows.
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-3">
        <Rule
          title="Cross-checked means two trackers"
          body="A code is listed as confirmed only when at least two independent code trackers list it. Four trackers are checked every pass: Beebom, Pocket Tactics, GamingDose and UrGameTips."
        />
        <Rule
          title="Single-source codes are flagged, not hidden"
          body="Speed matters with codes. When exactly one tracker carries a new code, it appears immediately with a visible fresh flag and a '1 tracker' label — never blended into the confirmed rows."
        />
        <Rule
          title="Disagreements stay visible"
          body="When trackers disagree on a reward — 400klikes pays 40 on two trackers, 80 on another — the majority reading is shown and the row carries a note saying so. Nothing is silently picked."
        />
      </section>

      <section className="border-t rule mt-12 py-12">
        <h2 className="text-sm font-medium">The delisting rule</h2>
        <p className="mt-3 max-w-[66ch] text-sm text-muted-foreground">
          Trackers almost never mark expirations for this game — old codes simply
          vanish from lists one site at a time. This page delists a code only when{" "}
          <strong className="font-medium text-foreground">every tracked source</strong>{" "}
          has dropped it, which trades a little list hygiene for never removing a
          code that still works. If a code on the list fails for you in game, it
          has likely just retired; it will disappear from here on the next pass.
        </p>
      </section>

      <section className="border-t rule py-12">
        <h2 className="text-sm font-medium">What nobody has verified yet</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {gaps.map((g) => (
            <li key={g} className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
              />
              <span className="text-muted-foreground">{g}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t rule py-12">
        <h2 className="text-sm font-medium">Independence</h2>
        <p className="mt-3 max-w-[66ch] text-sm text-muted-foreground">
          This is a fan-made reference. It is not affiliated with {game.developer},
          Incrementality Inc, or Roblox Corporation, and it earns money from
          display ads, not from selling anything. Game names, screenshots and the
          icon belong to their owners and appear here for identification.
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          Wrong code on the list? The fastest fix is a comment on the game&apos;s
          Roblox page — every tracker reads those, this site included.
        </p>
      </section>
    </article>
  );
}

function Rule({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-[var(--radius-container)] border rule bg-card p-5">
      <p className="font-medium">{title}</p>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
