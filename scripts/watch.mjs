#!/usr/bin/env node
/**
 * Be a YouTuber! codes 变化监控（零 AI、零依赖）
 *
 * 为什么：首页就是码表，是这个站的全部价值；码都从游戏里程碑更新里出，
 * 几家聚合站（beebom / pockettactics / gamingdose / urgametips）几乎同步收录。
 * 本站的差异化是「快 + 每条都能溯源」，所以每小时做三件事：
 *
 *   1. 主游戏（Be a YouTuber! 🔴🎥）Roblox 元数据比对：标题/描述/版本变化 = 新码信号
 *   2. 新游戏（Become a Youtuber! 💻）描述比对：出现 code 字样 = 它加码系统了（本站独家页的承诺）
 *   3. 四个码源页比对：「本站还没有、且 ≥2 个源同时列出」的码 → 通知；≥3 源 → 自动上站
 *
 * 自动上站只增不删：过期码仍需人工确认（删错了会掉已收录的码词）。
 *
 * cron: 41 * * * * NODE_USE_ENV_PROXY=1 https_proxy=http://127.0.0.1:7897 /opt/homebrew/bin/node <本文件>
 */
import { readFileSync, writeFileSync, appendFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = join(HERE, "..");
const SHIP = join(REPO, "..");
const UNIVERSE_ID = 8572854650; // Be a YouTuber! 🔴🎥（主）
const NEWGAME_UNIVERSE_ID = 10767115221; // Become a Youtuber! 💻（监视：加码系统没）
const STATE = join(SHIP, "out", "becomeayoutubercodes-watch.json");
const LOG = "/tmp/becomeayoutubercodes-watch.log";

/** 码源：至少两个源同时出现才提示（防聚合站错拼 / 别的游戏串词）。 */
const CODE_SOURCES = [
  { id: "beebom", url: "https://beebom.com/be-a-youtuber-codes/" },
  { id: "pockettactics", url: "https://www.pockettactics.com/be-a-youtuber-codes" },
  { id: "gamingdose", url: "https://www.gamingdose.com/en/guide/be-a-youtuber-codes" },
  { id: "urgametips", url: "https://urgametips.com/be-a-youtuber-codes/" },
];

const log = (msg) => appendFileSync(LOG, `${new Date().toISOString()} ${msg}\n`);

const PUSH_SCRIPT = new URL("../../scripts/notify.mjs", import.meta.url).pathname;

function notify(title, body, sound = "Glass") {
  // 先推飞书（Ship/scripts/notify.mjs）；推不出去再走 macOS 通知。
  try {
    execFileSync(process.execPath, [PUSH_SCRIPT, "--title", String(title), "--body", String(body)], { stdio: "ignore", timeout: 30000 });
    return;
  } catch {}
  const esc = (s) => String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"').slice(0, 220);
  try {
    execFileSync("osascript", [
      "-e",
      `display notification "${esc(body)}" with title "${esc(title)}" sound name "${sound}"`,
    ]);
  } catch {}
}

async function get(path) {
  for (let i = 1; ; i++) {
    let limited = false;
    try {
      const r = await fetch(path, { signal: AbortSignal.timeout(20000), headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126 Safari/537.36" } });
      limited = r.status === 429;
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return await r.text();
    } catch (e) {
      if (i >= (limited ? 3 : 2)) throw new Error(`${path.slice(0, 60)}: ${e.message}`);
      await new Promise((res) => setTimeout(res, limited ? 20000 * i : 2500 * i));
    }
  }
}

/**
 * 从码源 HTML 里抽「码 → 奖励」：本游戏的码是小写/混合大小写（release / 115mvisits /
 * 200KLikes），跟「: N Rebirth Coins|Cash」共现，所以按奖励锚点抽，而不是按大写 token。
 * 兼容各家格式：`code : 45 Rebirth Coins`、`code - rebirth coins`（PT 数字拼写）。
 */
const NUM_WORDS = { five: 5, ten: 10, fifteen: 15, twenty: 20, thirty: 30, forty: 40, fifty: 50, eighty: 80 };
function extractCodes(html) {
  const text = html
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ");
  const out = new Map(); // code(lower) → { code, reward }
  for (const m of text.matchAll(/([A-Za-z0-9_!]{3,24})\s*[:：\-–]\s*(?:(\d+)|(five|ten|fifteen|twenty|thirty|forty|fifty|eighty))\s*(Rebirth Coins|Cash)\b/gi)) {
    const code = m[1];
    if (/^(redeem|code|codes|copy|new|list|guide|roblox|youtube|youtuber)$/i.test(code)) continue;
    const n = m[2] ?? NUM_WORDS[(m[3] || "").toLowerCase()];
    out.set(code.toLowerCase(), { code, reward: `${n} ${m[4]}` });
  }
  return out;
}

/** 本站已收录的码（唯一事实来源）。 */
function knownCodes() {
  const data = JSON.parse(readFileSync(join(REPO, "src", "data", "game.json"), "utf8"));
  return new Set(data.codes.map((c) => c.code.toLowerCase()));
}

// ─── 1. Roblox 元数据（主游戏 + 新游戏）─────────────────────────────────────
let game, newGame;
try {
  const d = JSON.parse(await get(`https://games.roblox.com/v1/games?universeIds=${UNIVERSE_ID},${NEWGAME_UNIVERSE_ID}`));
  const g = d.data.find((x) => x.id === UNIVERSE_ID) ?? d.data[0];
  const ng = d.data.find((x) => x.id === NEWGAME_UNIVERSE_ID) ?? d.data[1];
  game = { name: g.name, description: g.description, updated: g.updated, playing: g.playing };
  newGame = { name: ng.name, description: ng.description, updated: ng.updated, playing: ng.playing };
} catch (e) {
  log(`GAME_FETCH_FAILED ${e.message}`);
  process.exit(1);
}

// 新游戏加码系统的信号：描述出现 code 字样（现在的描述没有）
const newGameHasCode = /\bcodes?\b/i.test(newGame.description ?? "");

// ─── 2. 码源 ────────────────────────────────────────────────────────────────
const known = knownCodes();
const perSource = {};
const sourceErrors = [];
for (const s of CODE_SOURCES) {
  try {
    perSource[s.id] = extractCodes(await get(s.url));
  } catch (e) {
    sourceErrors.push(`${s.id}: ${e.message}`);
  }
}

// 出现在 ≥2 个源、且不在本站码表里的 → 新码候选（记录各源奖励，多数派为准）
const counts = new Map(); // codeLower → { code, rewards: string[], n }
for (const map of Object.values(perSource)) {
  for (const [lower, { code, reward }] of map) {
    const cur = counts.get(lower) ?? { code, rewards: [], n: 0 };
    cur.rewards.push(reward);
    cur.n += 1;
    counts.set(lower, cur);
  }
}
const newCandidates = [...counts.entries()]
  .filter(([lower, v]) => v.n >= 2 && !known.has(lower))
  .map(([lower, v]) => `${v.code}(${v.n}源)`)
  .sort();

/** 多数派奖励文本。 */
function majorityReward(rewards) {
  const freq = new Map();
  for (const r of rewards) freq.set(r, (freq.get(r) ?? 0) + 1);
  return [...freq.entries()].sort((a, b) => b[1] - a[1])[0][0];
}

/**
 * 自动上站：≥3 个源同时列出、且不在码表里的码，直接写进 src/data/game.json 并推送。
 * 奖励取多数派文本；只增不删。
 */
function autoAddCodes(items) {
  const file = join(REPO, "src", "data", "game.json");
  try {
    const data = JSON.parse(readFileSync(file, "utf8"));
    for (const it of items) {
      data.codes.unshift({
        code: it.code,
        reward: it.reward,
        sources: it.sources,
      });
    }
    writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);

    execFileSync("git", ["add", "src/data/game.json"], { cwd: REPO });
    execFileSync(
      "git",
      ["commit", "-q", "-m", `codes: auto-add ${items.map((i) => i.code).join(", ")} (${items.map((i) => `${i.sources} sources`).join(", ")})`],
      {
        cwd: REPO,
        env: {
          ...process.env,
          GIT_AUTHOR_NAME: "becomeayoutubercodes watch",
          GIT_AUTHOR_EMAIL: "watch@becomeayoutubercodes.wiki",
          GIT_COMMITTER_NAME: "becomeayoutubercodes watch",
          GIT_COMMITTER_EMAIL: "watch@becomeayoutubercodes.wiki",
        },
      },
    );

    // cron 里 keychain 拿不到 HTTPS 凭据 → SSH 优先，HTTPS 兜底（舰队 2026-09-28 的教训）
    let via = "ssh";
    try {
      execFileSync("git", ["push", "-q", "git@github.com:ken-fs/becomeayoutubercodes.git", "main"], {
        cwd: REPO,
        timeout: 60000,
        env: { ...process.env, GIT_SSH_COMMAND: `ssh -i ${homedir()}/.ssh/id_ed25519 -o IdentitiesOnly=yes` },
      });
    } catch {
      execFileSync("git", ["push", "-q", "origin", "main"], {
        cwd: REPO,
        timeout: 60000,
        env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
      });
      via = "https";
    }
    return { added: items.map((i) => i.code), via };
  } catch (e) {
    log(`AUTO_ADD_FAILED ${e.message}`);
    return { error: String(e.message).slice(0, 200) };
  }
}

const AUTOMATED = [...counts.entries()]
  .filter(([lower, v]) => v.n >= 3 && !known.has(lower))
  .map(([lower, v]) => ({ code: v.code, reward: majorityReward(v.rewards), sources: v.n }))
  .slice(0, 3);
const autoResult = AUTOMATED.length ? autoAddCodes(AUTOMATED) : null;

// 我们的码里，已从所有成功抓取的源上消失的 → 可能过期
const liveMaps = Object.values(perSource);
const gone = [...known].filter((c) => liveMaps.length > 0 && liveMaps.every((m) => !m.has(c)));

// ─── 3. 状态比对 + 通知 ─────────────────────────────────────────────────────
const prev = existsSync(STATE) ? JSON.parse(readFileSync(STATE, "utf8")) : null;
writeFileSync(
  STATE,
  JSON.stringify(
    {
      game,
      newGame,
      newGameHasCode,
      codes: [...known, ...newCandidates.map((c) => c.replace(/\(\d+源\)$/, "").toLowerCase())].sort(),
      newCandidates,
      checkedAt: new Date().toISOString(),
    },
    null,
    2,
  ),
);

if (!prev) {
  log(`BASELINE ${game.name} | updated ${game.updated} | candidates ${newCandidates.length} | newGame "${newGame.name}" hasCode=${newGameHasCode}`);
  process.exit(0);
}

const changed = ["name", "description", "updated"].filter((k) => prev.game?.[k] !== game[k]);
if (changed.length) {
  log(`GAME_CHANGED ${changed.join(",")}: updated ${prev.game?.updated} → ${game.updated}`);
  notify("🆕 游戏更新", `${changed.join("/")} 变化 → 查新码再更新站点`, "Glass");
}

// 新游戏的两类信号：元数据变化（普通）+ 描述出现 code（🚨 独家页要翻转）
const ngChanged = ["name", "description", "updated"].filter((k) => prev.newGame?.[k] !== newGame[k]);
if (ngChanged.length) {
  log(`NEWGAME_CHANGED ${ngChanged.join(",")}: updated ${prev.newGame?.updated} → ${newGame.updated}`);
}
if (newGameHasCode && !prev.newGameHasCode) {
  log(`🚨 NEWGAME_CODES_APPEARED 描述出现 code 字样`);
  notify("🚨 Become a Youtuber! 💻 出码了", "游戏描述出现 code 字样 → 验证后翻转 /become-a-youtuber/ 状态页", "Sosumi");
} else if (ngChanged.length) {
  notify("💻 新游戏有更新", `${ngChanged.join("/")} 变化，暂无码系统信号`, "Blow");
}

if (newCandidates.length) {
  log(`🚨 NEW_CODES ${newCandidates.join(" ")}`);
  notify(
    "🚨 新码待确认",
    `${newCandidates.slice(0, 8).join(" ")} → 双源确认后更新 src/data/game.json`,
    "Sosumi",
  );
}

if (autoResult?.added?.length) {
  log(`AUTO_ADDED ${autoResult.added.join(" ")} via ${autoResult.via}`);
  notify(
    "✅ 自动更新完成",
    `${autoResult.added.join(" ")} 已写入码表并推送（${autoResult.via}），部署约 1 分钟`,
    "Glass",
  );
} else if (autoResult?.error) {
  notify("⚠️ 自动更新失败", `${AUTOMATED.map((i) => i.code).join(" ")} — 手动补：${autoResult.error}`, "Basso");
}

if (gone.length) log(`GONE ${gone.join(" ")}（所有成功抓取的源都不再列出，考虑标过期）`);
if (sourceErrors.length) log(`SOURCE_ERRORS ${sourceErrors.join(" | ")}`);
if (!changed.length && !newCandidates.length && !ngChanged.length) log("no change");
