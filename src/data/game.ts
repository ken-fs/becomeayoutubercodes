import raw from "./game.json";

/**
 * Single source of truth for every code on this site.
 *
 * Provenance rules, enforced by the shape of this file:
 *  - `sources` records how many independent code trackers list the code. The
 *    site publishes at one source only when the entry is explicitly flagged
 *    `fresh` — those rows are labelled on the page, never blended in.
 *  - `note` surfaces tracker disagreements instead of hiding them.
 *  - The `gaps` list is rendered on /about/ rather than left implicit.
 */

export type Code = {
  code: string;
  reward: string;
  sources: number;
  /** True when a single tracker carries it — rendered with a visible flag. */
  fresh?: boolean;
  note?: string;
};

export const game = raw.game;
export const newGame = raw.newGame;
export const codes = raw.codes as Code[];
export const redeemSteps = raw.redeemSteps as string[];
export const gaps = raw.gaps as string[];

export const LAST_CHECKED = "2026-10-11";

/** Cross-checked codes (the site's default publishing bar). */
export const confirmedCodes = codes.filter((c) => c.sources >= 2);

/** Single-source fresh finds — shown, but labelled. */
export const freshCodes = codes.filter((c) => c.sources < 2);

export const visitsPerFavourite = Math.round(game.visits / game.favorites);
