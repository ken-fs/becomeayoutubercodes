/**
 * Creator videos worth embedding, checked by hand before adding.
 *
 * Rules: embed only, never re-upload; the caption always names the channel;
 * nothing that is a codes-only video may drift more than a patch behind, so
 * codes embeds carry the date they were checked.
 */
export type Video = {
  id: string;
  title: string;
  channel: string;
  meta: string;
  /** Where it is embedded and why that page needs it. */
  why: string;
};

export const VIDEOS: Record<string, Video> = {
  codes: {
    id: "BcryOutve-c",
    title: "All working codes for Be a YouTuber (2026)",
    channel: "Gaming Dan",
    meta: "video, 8:17 · published Feb 2026 · checked 2026-10-11",
    why: "Types each code into the in-game Shop box on camera — shows the exact redeem flow (and the case-sensitivity) faster than any screenshot. Its February list is the early half of today's table.",
  },
};
