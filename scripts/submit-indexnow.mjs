/**
 * Submit every page to IndexNow, which Bing, Yandex, Naver and Seznam read from.
 * Google does not participate, so this is a Bing-side accelerator only.
 *
 * The key is hosted at /<key>.txt because IndexNow verifies ownership by fetching it.
 * Run by hand: node scripts/submit-indexnow.mjs
 */
import { readFileSync } from "node:fs";

// Read the generated JSON directly. Importing src/data/game.ts would need a TS
// loader, and this script has to run in a bare Node context.
const { pets } = JSON.parse(
  readFileSync(new URL("../src/data/game.json", import.meta.url), "utf8")
);

const HOST = "petsuniverse.site";
const KEY = readFileSync(new URL("../.indexnow-key", import.meta.url), "utf8").trim();

const PATHS = [
  "/",
  "/codes/",
  "/pets/",
  "/values/",
  "/tier-list/",
  "/guide/",
  "/about/",
  ...pets.map((p) => `/pets/${p.slug}/`),
];

const body = {
  host: HOST,
  key: KEY,
  keyLocation: `https://${HOST}/${KEY}.txt`,
  urlList: PATHS.map((p) => `https://${HOST}${p}`),
};

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(body),
});

if (res.ok) {
  console.log(`✓ 已提交 ${body.urlList.length} 个 URL 到 IndexNow (HTTP ${res.status})`);
} else {
  console.error(`✗ 提交失败 HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
  process.exit(1);
}
