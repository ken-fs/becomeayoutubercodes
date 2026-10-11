// Adsterra ad units — single source of truth.
//
// Copy each unit's GET CODE snippet verbatim into `src`. The network has used at
// least two shapes over time and they are not interchangeable:
//
//   old:  <script src="//www.highrevenueformat.com/<key>/invoke.js"></script>
//   new:  <script src="https://bauval.org/22/<key>"></script>
//
// Guessing the URL from the key produced a 404 on this account's units, so the
// full URL is stored rather than reconstructed.
//
// A slot with an empty key renders nothing, so this file is safe to ship before
// a unit is approved — ads appear only once the key is filled in.
//
// NOTE: Adsterra needs NO ads.txt record (user-confirmed 2026-10-11; the
// dashboard has no such thing). public/ads.txt serves AdSense only - add the
// pub-ID line after approval.

export type AdSlot = {
  key: string;
  width: number;
  height: number;
  /** Exact script URL from the dashboard's GET CODE snippet. */
  src: string;
};

/** 728×90 leaderboard. Desktop only — it overflows phones. */
export const LEADERBOARD: AdSlot = {
  key: "",
  width: 728,
  height: 90,
  src: "",
};

/** 300×250 rectangle. Fits every viewport. */
export const RECTANGLE: AdSlot = {
  key: "",
  width: 300,
  height: 250,
  src: "",
};
