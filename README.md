# Anime Zero Reference

A data reference for the Roblox game **Anime Zero** (Zero Studio / a Lyt Project):
working codes with their rewards and level gates, the weapon roster with the
rarities two independent sources agree on, and an explicit map of what nobody has
published yet.

Built on the fleet's path B — Next.js 16 App Router + Tailwind v4 + shadcn/ui,
static export served from Cloudflare Workers assets. Scaffolded from
`petsuniverse` (which was scaffolded from `animedice`).

- Production: https://animezero.live
- Repo: https://github.com/ken-fs/animezero

## The idea

Anime Zero has no official wiki and no published odds. The four sites that
already cover it are AI-filled: weapon pages that say "how to master" without one
verified number. This site competes on the two things they skip — provenance and
recentness:

- every code carries the exact reward, the level gate, and the count of
  independent listings that agree (two minimum to be published here);
- weapon entries only get a rarity when two rosters agree on it, and everything
  else is rendered as a visible gap;
- the gap list is a feature, not an apology: `/about/` documents what nobody has
  published so a reader knows the site looked.

## Structure

```
/                 facts, confirmed vs unpublished, entry points
/codes/           25 codes + rewards + level gates + redeem steps + FAQ schema
/weapons/         the roster down the Zenless → Epic rarity ladder
/weapons/[slug]/  one page per entity; unconfirmed ones say what is missing
/tier-list/       what published rankings agree on, where they fight, and a
                  five-minute method to judge a pull yourself
/guide/           systems in order: Arsenal, traits, slots, modes, first hour
/about/           provenance rules + the full gap list + game facts
```

## Visual theme

**synth — 霓虹网格** from `Ship/game-themes` (dark indigo, electric cyan + magenta,
perspective grid floor, scanlines). Chosen 2026-10-10 because the game's own key
art is a dark navy frame with electric-blue lightning, while the two biggest
competing sites ship warm-white or plain-black themes. Tokens are remapped onto
the shadcn variables in `src/app/globals.css`; the contract (token names, `.tag`,
`card-glow`, `btn-ember`, `hero-glow`) is unchanged from the theme library.

## Commands

```bash
npm install
npm run dev     # local
npm run build   # static export to ./out (prebuild writes the deploy marker)
```

## Data rules

`src/data/game.json` is the single source of truth; `src/data/game.ts` documents
the shape and the provenance rules. Codes need two independent listings with
matching rewards. A weapon needs two rosters agreeing on a rarity before it joins
the ladder; otherwise it lands in "seen in game, not yet ranked". No number is
ever copied from another game to fill a column.
