import type { Metadata } from "next";
import Link from "next/link";
import {
  codes,
  confirmedCodes,
  freshCodes,
  game,
  newGame,
  redeemSteps,
  LAST_CHECKED,
} from "@/data/game";
import { CopyCode } from "@/components/copy-code";
import { VideoEmbed } from "@/components/video-embed";
import { VIDEOS } from "@/data/videos";
import { FaqJsonLd } from "@/components/json-ld";
import { AdsterraBanner } from "@/components/adsterra-banner";
import { LEADERBOARD, RECTANGLE } from "@/lib/ads";

export const metadata: Metadata = {
  title: `Be a YouTuber codes (October 2026) — ${codes.length} working codes`,
  description: `All ${codes.length} working Be a YouTuber! 🔴🎥 codes with the exact Rebirth Coin and Cash rewards, the Shop-box redeem steps, and an honest note on the newer Become a Youtuber! 💻 — which has no codes yet.`,
  alternates: { canonical: "/" },
};

const nf = new Intl.NumberFormat("en-US");

const FAQ = [
  {
    q: "How many working Be a YouTuber codes are there?",
    a: `${codes.length} on this list: ${confirmedCodes.length} confirmed by at least two independent code trackers, plus ${freshCodes.length} fresh finds carried by a single tracker so far — those rows are flagged rather than blended in. release is the one code named in the game's own description.`,
  },
  {
    q: "Is Be a YouTuber! the same game as Become a Youtuber! 💻?",
    a: "No — they are two different Roblox games that search results constantly mix up. This page covers Be a YouTuber! 🔴🎥 (August 2025, 130M visits), which has the codes. Become a Youtuber! 💻 (September 2026, by Incrementality Inc) has no code system as of October 2026 — we re-check after every update it ships.",
  },
  {
    q: "Why is my Be a YouTuber code not working?",
    a: "Two reasons, in order of frequency. First, codes are case-sensitive — 65mVisits and mvisits65 are not the same string, so use the copy button instead of retyping. Second, the code has retired: codes in this genre expire without warning, and this page delists a code once every tracked source drops it.",
  },
  {
    q: "What do Be a YouTuber codes give you?",
    a: "Almost everything pays Rebirth Coins — the currency for rebirths, which multiply how fast each video earns. The exception is release, the launch code named in the game description, which pays 250 Cash for early upgrades and hiring.",
  },
  {
    q: "Where do new Be a YouTuber codes come from?",
    a: "Milestones and updates: the developer names codes after visits (115mvisits), likes (450klikes), favourites (850kfavs) and features (summer, gifting, Mutations). They surface in the game and its group first, trackers pick them up within hours, and this page adds them once two trackers agree — or immediately, visibly flagged, when only one has it.",
  },
  {
    q: "Do I need to join the Roblox group to redeem codes?",
    a: "Every major tracker recommends liking the game and joining the IM A YOUTUBER group before redeeming, and some rewards in this genre are group-locked. Joining is free and takes ten seconds from the game page, so do it first — but no tracker has proven a hard lock for any specific code, so this site lists it as a recommendation, not a requirement.",
  },
];

export default function HomePage() {
  const topCode = codes[0];

  return (
    <div className="mx-auto w-full max-w-6xl px-5">
      <FaqJsonLd items={FAQ} />

      <section className="relative pt-14 pb-12">
        <div className="hero-glow" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <p className="tag">Roblox codes · updated {LAST_CHECKED}</p>
            <h1 className="mt-4 max-w-[22ch] text-4xl font-semibold tracking-tight sm:text-5xl">
              Be a YouTuber! codes
            </h1>
            <p className="mt-5 max-w-[62ch] text-lg text-muted-foreground">
              {codes.length} working codes for {game.name} — {confirmedCodes.length}{" "}
              cross-checked by at least two independent trackers, {freshCodes.length}{" "}
              fresh finds flagged as single-source. Searched as &quot;become a
              youtuber codes&quot; —{" "}
              <Link href="/become-a-youtuber/" className="text-primary underline-offset-4 hover:underline">
                that is actually a different game
              </Link>
              .
            </p>
          </div>

          {/* 官方美术：游戏页截图 + icon 做品牌锚点 */}
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element -- static export has no image optimizer */}
            <img
              src="/images/shot-1.webp"
              alt={`Official ${game.name} screenshot from the game's Roblox page`}
              width={768}
              height={432}
              fetchPriority="high"
              decoding="async"
              className="w-full rounded-[var(--radius-container)] border rule lift"
            />
            {/* eslint-disable-next-line @next/next/no-img-element -- static export has no image optimizer */}
            <img
              src="/images/icon.png"
              alt={`${game.name} game icon`}
              width={96}
              height={96}
              loading="lazy"
              decoding="async"
              className="absolute -bottom-6 -left-6 h-20 w-20 rounded-2xl border rule bg-background shadow-lg sm:h-24 sm:w-24"
            />
          </div>
        </div>

        {topCode && (
          <div className="mt-10 flex flex-wrap items-center gap-3 rounded-[var(--radius-container)] border rule bg-card p-4">
            <span className="tag">highest payout</span>
            <code className="font-mono text-sm font-semibold">{topCode.code}</code>
            <CopyCode code={topCode.code} />
            <span className="text-sm text-muted-foreground">{topCode.reward}</span>
          </div>
        )}
      </section>

      <section className="grid gap-px overflow-hidden rounded-[var(--radius-container)] border rule bg-border sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="Game" value={game.shortName} sub={`by ${game.developer}`} />
        <Fact
          label="Visits since Aug 2025"
          value={nf.format(game.visits)}
          sub={`${nf.format(game.favorites)} favourites`}
        />
        <Fact
          label="Reward currency"
          value="Rebirth Coins"
          sub="rebirths multiply video income"
        />
        <Fact label="List last checked" value={LAST_CHECKED} sub="against four trackers" />
      </section>

      {/* Highest-intent element on the site: the table is why people land here. */}
      <AdsterraBanner slot={LEADERBOARD} className="mt-10 hidden md:flex" />

      <section className="pt-14" id="codes">
        <h2 className="text-sm font-medium">All working codes</h2>
        <div className="mt-5 overflow-hidden rounded-[var(--radius-container)] border rule">
          <div className="grid grid-cols-[1fr_auto] gap-4 border-b rule bg-muted/60 px-5 py-3 text-xs font-medium text-muted-foreground sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)_minmax(0,0.8fr)_auto]">
            <span>Code</span>
            <span className="hidden sm:block">Reward</span>
            <span className="hidden sm:block">Trackers</span>
            <span className="sr-only sm:not-sr-only">Copy</span>
          </div>
          <ul>
            {codes.map((c) => (
              <li
                key={c.code}
                className="grid grid-cols-[1fr_auto] items-center gap-4 border-b rule bg-card px-5 py-4 last:border-b-0 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)_minmax(0,0.8fr)_auto]"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <code className="font-mono text-sm font-semibold break-all">{c.code}</code>
                  {c.fresh && (
                    <span className="shrink-0 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                      fresh
                    </span>
                  )}
                </span>
                <span className="col-span-2 text-sm text-muted-foreground sm:col-span-1">
                  {c.reward}
                  {c.note && <span className="block text-xs">({c.note})</span>}
                </span>
                <span className="col-span-2 text-xs text-muted-foreground sm:col-span-1">
                  {c.sources >= 4
                    ? "4 sources · in-game confirmed"
                    : c.sources >= 2
                      ? `${c.sources} trackers`
                      : "1 tracker · flagged fresh"}
                </span>
                <CopyCode code={c.code} />
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-4 max-w-[62ch] text-sm text-muted-foreground">
          Sourcing note: a code graduates from &quot;fresh&quot; to cross-checked when{" "}
          <strong className="font-medium text-foreground">two independent trackers</strong>{" "}
          list it. Where trackers disagree on the reward — as they do over 400klikes
          and 65mVisits — the majority reading is shown and the row says so. Codes
          retire without warning in this genre, so the list gets re-checked rather
          than trusted, and a code is delisted only when every tracked source drops
          it.
        </p>
      </section>

      <AdsterraBanner slot={RECTANGLE} className="mt-14" />

      <section className="border-t rule mt-14 py-12">
        <h2 className="text-sm font-medium">How to redeem a code</h2>
        <ol className="mt-5 grid gap-4 sm:grid-cols-2">
          {redeemSteps.map((step, i) => (
            <li
              key={step}
              className="flex gap-4 rounded-[var(--radius-container)] border rule bg-card p-5"
            >
              <span className="font-mono text-sm font-semibold text-primary tabular">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-sm text-muted-foreground">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t rule py-12">
        <h2 className="text-sm font-medium">Watch a creator redeem them</h2>
        <p className="mt-3 max-w-[64ch] text-sm text-muted-foreground">
          The table above is cross-checked in writing; this video is codes being
          typed into the in-game Shop box, which shows the redeem flow (and how the
          case-sensitivity bites) faster than any screenshot.
        </p>
        <VideoEmbed className="mt-5" {...VIDEOS.codes} />
      </section>

      <section className="border-t rule py-12">
        <h2 className="text-sm font-medium">The game, in its own frames</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {[
            { src: "/images/shot-2.webp", alt: `${game.name} studio plot, official screenshot` },
            { src: "/images/shot-3.webp", alt: `${game.name} gameplay, official screenshot` },
          ].map((s) => (
            // eslint-disable-next-line @next/next/no-img-element -- static export has no image optimizer
            <img
              key={s.src}
              src={s.src}
              alt={s.alt}
              width={768}
              height={432}
              loading="lazy"
              decoding="async"
              className="w-full rounded-[var(--radius-container)] border rule"
            />
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Official screenshots and icon belong to {game.developer}. Used here for
          reference with attribution.
        </p>
      </section>

      <section className="border-t rule py-12">
        <h2 className="text-sm font-medium">Looking for Become a Youtuber! 💻 codes?</h2>
        <p className="mt-3 max-w-[64ch] text-sm text-muted-foreground">
          The September 2026 game by {newGame.developer} — the one currently
          climbing the charts — is a <em>different game</em> from {game.name}, and
          it has <strong className="font-medium text-foreground">no code system as of {LAST_CHECKED}</strong>.
          Any site listing &quot;Become a Youtuber 💻 codes&quot; today is guessing. We
          re-check it after every update it ships:{" "}
          <Link href="/become-a-youtuber/" className="text-primary underline-offset-4 hover:underline">
            see the watch page
          </Link>
          .
        </p>
      </section>

      <section className="border-t rule py-12">
        <h2 className="text-sm font-medium">Questions</h2>
        <dl className="mt-5 divide-y rule">
          {FAQ.map((f) => (
            <div key={f.q} className="py-5">
              <dt className="font-medium">{f.q}</dt>
              <dd className="mt-2 max-w-[70ch] text-sm text-muted-foreground">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="border-t rule py-10">
        <p className="text-sm text-muted-foreground">
          New codes are published by the developer around visits, likes and
          favourites milestones, then tracked here.{" "}
          <Link href="/about/" className="text-primary underline-offset-4 hover:underline">
            How this list is sourced
          </Link>{" "}
          ·{" "}
          <a
            href={game.robloxUrl}
            target="_blank"
            rel="noopener"
            className="text-primary underline-offset-4 hover:underline"
          >
            Play {game.shortName} on Roblox
          </a>
        </p>
      </section>
    </div>
  );
}

function Fact({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="bg-card p-5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-mono text-lg font-semibold tabular">{value}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}
