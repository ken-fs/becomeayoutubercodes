#!/usr/bin/env bash
# 监控 Cloudflare zone 是否激活（激活后 DNS 才会应答）
set -uo pipefail
ZONE=162b8a628b8e960a94163191f26edb97
ROUNDS="${1:-15}"; SLEEP="${2:-120}"

TOK=$(python3 -c "
import re,os
t=open(os.path.expanduser('~/Library/Preferences/.wrangler/config/default.toml')).read()
m=re.search(r'oauth_token\s*=\s*\"([^\"]+)\"',t); print(m.group(1) if m else '')
")
[ -z "$TOK" ] && { echo "✗ 拿不到 token，先跑 npx wrangler whoami 续期"; exit 1; }

echo "监控 zone 激活状态（$ROUNDS 轮 × ${SLEEP}s）"
for i in $(seq 1 "$ROUNDS"); do
  ts=$(date +%H:%M:%S)
  R=$(curl -s --max-time 25 -H "Authorization: Bearer $TOK" \
    "https://api.cloudflare.com/client/v4/zones/$ZONE")
  echo "$R" | python3 -c "
import sys,json
z=json.load(sys.stdin)['result']
st=z['status']
print(f\"[$ts] status={st}  observed={','.join(z.get('observed_name_servers') or []) or '-'}  reason={z.get('activation_failure_reason') or '-'}\")
" 2>/dev/null || echo "[$ts] 查询失败"

  if echo "$R" | grep -q '"status": *"active"'; then
    echo
    echo "✅ zone 已激活，核对站点："
    for p in "/" "/codes/" "/units/" "/grades/" "/sitemap.xml" "/robots.txt"; do
      code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 20 "https://animedice.xyz$p")
      printf "  %-16s %s\n" "$p" "$code"
    done
    exit 0
  fi
  [ "$i" -lt "$ROUNDS" ] && sleep "$SLEEP"
done
echo
echo "⏳ 仍未激活。去 dashboard 点「立即检查名称服务器」会更快。"
