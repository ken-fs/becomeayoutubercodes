import type { Metadata } from "next";
import Link from "next/link";
import { game, newGame, LAST_CHECKED } from "@/data/game";

export const metadata: Metadata = {
  title: "Become a Youtuber! 💻 codes — none exist yet (October 2026)",
  description:
    "Become a Youtuber! 💻 (September 2026, Incrementality Inc) has no code redemption system as of October 2026. What we checked, why sites listing codes for it are guessing, and when real codes would appear.",
  alternates: { canonical: "/become-a-youtuber/" },
};

const nf = new Intl.NumberFormat("en-US");

export default function BecomeAYoutuberPage() {
  return (
    <article className="mx-auto w-full max-w-6xl px-5">
      <nav className="pt-8 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <span className="px-2 text-border" aria-hidden="true">
          /
        </span>
        <span className="text-foreground">Become a Youtuber! 💻</span>
      </nav>

      <header className="pt-6 pb-10">
        <p className="tag">Status page · checked {LAST_CHECKED}</p>
        <h1 className="mt-3 max-w-[24ch] text-3xl font-semibold tracking-tight sm:text-4xl">
          Become a Youtuber! 💻 has no codes — yet
        </h1>
        <p className="mt-4 max-w-[64ch] text-muted-foreground">
          Two Roblox games share this search. The codes you are looking for almost
          certainly belong to{" "}
          <Link href="/" className="text-primary underline-offset-4 hover:underline">
            {game.name} (August 2025, {nf.format(game.visits)} visits)
          </Link>
          . This page is about the newer one: <strong className="font-medium text-foreground">{newGame.name}</strong>,
          released {newGame.created} by {newGame.developer}.
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-[var(--radius-container)] border rule bg-card p-5">
          <p className="text-xs text-muted-foreground">Code system</p>
          <p className="mt-1 font-medium">None in game</p>
          <p className="mt-1 text-sm text-muted-foreground">
            No code box, no codes in the description, no codes announced by the
            developer as of {LAST_CHECKED}.
          </p>
        </div>
        <div className="rounded-[var(--radius-container)] border rule bg-card p-5">
          <p className="text-xs text-muted-foreground">Game age</p>
          <p className="mt-1 font-medium">Three weeks</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Created {newGame.created}; last updated {newGame.updated}. Codes in
            this genre typically arrive with the first milestone update.
          </p>
        </div>
        <div className="rounded-[var(--radius-container)] border rule bg-card p-5">
          <p className="text-xs text-muted-foreground">Coverage elsewhere</p>
          <p className="mt-1 font-medium">Zero trackers</p>
          <p className="mt-1 text-sm text-muted-foreground">
            No major code tracker lists codes for this game — because there is
            nothing to list. Be sceptical of any site that claims otherwise.
          </p>
        </div>
      </section>

      <section className="border-t rule mt-12 py-12">
        <h2 className="text-sm font-medium">Why you landed here anyway</h2>
        <p className="mt-3 max-w-[66ch] text-sm text-muted-foreground">
          &quot;become a youtuber codes&quot; is searched for both games, and Google
          blends them. The demand is real — the sub-queries &quot;become a youtuber
          codes 2026&quot; and &quot;become a youtuber roblox codes&quot; are climbing — but
          today every working code belongs to the older game. The table on the
          home page is that list, cross-checked against four independent trackers.
        </p>
        <p className="mt-4">
          <Link href="/" className="btn-ember">
            See the {`working Be a YouTuber! codes`}
          </Link>
        </p>
      </section>

      <section className="border-t rule py-12">
        <h2 className="text-sm font-medium">When real 💻 codes would appear</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {[
            "The game adds a redemption box (usually in a Shop or Settings menu) — we check after every update it ships.",
            "The developer posts a code in the game description or group shout — milestone codes like \"release\" are the genre norm.",
            "Two independent code trackers list the same code — that is this site's publishing bar, the same one the main list follows.",
          ].map((t) => (
            <li key={t} className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
              />
              <span className="text-muted-foreground">{t}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 max-w-[66ch] text-sm text-muted-foreground">
          When any of those fires, the answer on this page flips to a real list
          within a day — the same monitoring that watches the main game's four
          trackers watches this game's description and update log hourly.
        </p>
      </section>

      <section className="border-t rule py-10">
        <p className="text-sm text-muted-foreground">
          <a
            href={newGame.robloxUrl}
            target="_blank"
            rel="noopener"
            className="text-primary underline-offset-4 hover:underline"
          >
            Play {newGame.name} on Roblox
          </a>{" "}
          · {nf.format(newGame.visits)} visits since {newGame.created}
        </p>
      </section>
    </article>
  );
}
