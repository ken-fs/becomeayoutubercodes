#!/usr/bin/env bash
# 守望 petsuniverse.site 的 zone：一出现就等激活，激活后自动跑完接线全流程。
#
#   nohup bash scripts/watch-zone-and-wire.sh > /tmp/petsuniverse-wire.log 2>&1 &
#
# 用户只需在 Cloudflare dashboard 建 zone（Add a site → petsuniverse.site）。
# 本脚本每 60s 查一次；zone 激活后调用 wire-domain.sh（构建/部署/绑域名/IndexNow）。
set -uo pipefail
DOMAIN="petsuniverse.site"
MAX_ROUNDS="${1:-240}"     # 240 × 60s = 4 小时
SLEEP="${2:-60}"
cd "$(dirname "$0")/.."

TOK=""
for cand in "$HOME/.config/cloudflare/env" "$HOME/Library/Preferences/.wrangler/config/default.toml"; do
  [ -f "$cand" ] || continue
  TOK=$(python3 -c "
import re,sys
d=open('$cand').read()
m=re.search(r'CF_API_TOKEN\s*=\s*\"?([A-Za-z0-9_-]{20,})\"?', d) or re.search(r'oauth_token\s*=\s*\"([^\"]+)\"', d)
print(m.group(1) if m else '')
")
  [ -n "$TOK" ] && { echo "▸ token 来源: $cand"; break; }
done
[ -z "$TOK" ] && { echo "✗ 拿不到 token"; exit 1; }

echo "▸ 守望 $DOMAIN —— 每 ${SLEEP}s 查一次，最多 $((MAX_ROUNDS * SLEEP / 60)) 分钟"
echo "  （等你在 Cloudflare dashboard 建 zone：Add a site → ${DOMAIN}）"
echo

for i in $(seq 1 "$MAX_ROUNDS"); do
  ts=$(date +%H:%M:%S)
  R=$(curl -s --max-time 25 -H "Authorization: Bearer $TOK" \
    "https://api.cloudflare.com/client/v4/zones?name=$DOMAIN")
  INFO=$(echo "$R" | python3 -c "
import json,sys
try:
    d=json.load(sys.stdin); r=d.get('result') or []
    if not r: print('missing|-|-|-')
    else:
        z=r[0]
        print(z['status'], '|', ','.join(z.get('name_servers') or []), '|', ','.join(z.get('observed_name_servers') or []) or '-', '|', z.get('activation_failure_reason') or '-')
except Exception:
    print('query-failed|-|-|-')
")
  ST=$(echo "$INFO" | cut -d'|' -f1 | tr -d ' ')
  echo "[$ts] status=$INFO"

  case "$ST" in
    active)
      echo
      echo "✅ zone 已激活 → 开始接线"
      bash scripts/wire-domain.sh "$DOMAIN"
      echo
      echo "▸ 收尾：把 petsuniverse 加进验收基线提示"
      echo "  → 人工确认 GSC 属性后再取消 scripts/gsc-lib.mjs 里的注释"
      exit 0
      ;;
    pending)
      OBS=$(echo "$INFO" | cut -d'|' -f3 | tr -d ' ')
      [ "$OBS" != "-" ] && [ "$OBS" != "" ] && echo "    ↑ 已观测到 NS，等 CF 标记激活（若卡住：dashboard 点「立即检查名称服务器」）"
      ;;
    missing)
      [ $((i % 10)) -eq 0 ] && echo "    … 还没建 zone（第 $i 次检查）"
      ;;
  esac
  sleep "$SLEEP"
done
echo "✗ 超时未激活，请手动跑：bash scripts/wire-domain.sh $DOMAIN"
exit 1
