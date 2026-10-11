#!/usr/bin/env bash
# zone active 之后跑这个：重新构建 + 部署 + 绑定自定义域名 + 验证 + IndexNow
#
#   bash scripts/wire-domain.sh petsuniverse.site
#
# 前提：域名已在同一个 Cloudflare 账号里建好 zone 且 status=active。
# 绑域名需要 workers_routes:write —— wrangler 的 OAuth token 有（实测）。
set -uo pipefail
DOMAIN="${1:-petsuniverse.site}"
cd "$(dirname "$0")/.."

echo "▸ 1/5 检查 zone 状态"
# Token 优先级：~/.config/cloudflare/env 的静态 API token（不会过期）
# → 其次 wrangler 的 OAuth token（约 24h 过期，过期先跑 `npx wrangler whoami` 续期）
TOKEN=""
if [ -f "$HOME/.config/cloudflare/env" ]; then
  TOKEN=$(python3 -c "
import re
d=open('$HOME/.config/cloudflare/env').read()
m=re.search(r'CF_API_TOKEN\s*=\s*\"?([A-Za-z0-9_-]{20,})\"?', d)
print(m.group(1) if m else '')
")
fi
if [ -z "$TOKEN" ] && [ -f "$HOME/Library/Preferences/.wrangler/config/default.toml" ]; then
  TOKEN=$(python3 -c "
import re
d=open('$HOME/Library/Preferences/.wrangler/config/default.toml').read()
m=re.search(r'oauth_token\s*=\s*\"([^\"]+)\"', d)
print(m.group(1) if m else '')
")
fi
[ -z "$TOKEN" ] && { echo "  ✗ 拿不到 CF token"; exit 1; }
ZONE=$(curl -s -H "Authorization: Bearer $TOKEN" "https://api.cloudflare.com/client/v4/zones?name=$DOMAIN")
STATUS=$(echo "$ZONE" | python3 -c "import json,sys;d=json.load(sys.stdin);r=d.get('result') or [];print(r[0]['status'] if r else 'missing')")
if [ "$STATUS" != "active" ]; then
  echo "  ✗ zone status = $STATUS"
  echo "    → 域名还没加进 Cloudflare，或 NS 还没生效。"
  echo "      dashboard → Add a site → $DOMAIN → 把给出的两个 NS 改到注册商 → 等 active。"
  exit 1
fi
echo "✓ zone active"

# 坑 1 的修复：NS 是**按 zone 分配**的（本 zone 是 daisy/lochlan，与舰队其他 22 个
# zone 的 ariella/seamus 不同）—— 所以从 zone 读，绝不按账号推断。
if [ -f "$HOME/.config/spaceship/env" ]; then
  echo "▸ 1.5/5 同步 NS 到注册商（读 zone 实际分配的那对）"
  NS=$(echo "$ZONE" | python3 -c "import json,sys;print(' '.join((json.load(sys.stdin)['result'] or [{}])[0].get('name_servers') or []))")
  if [ -z "$NS" ]; then
    echo "  ⚠️ zone 没返回 name_servers，跳过"
  else
    source "$HOME/.config/spaceship/env"
    HOSTS=$(echo "$NS" | python3 -c "import json,sys;print(json.dumps(sys.stdin.read().split()))")
    CUR=$(curl -s -H "X-Api-Key: $SPACESHIP_API_KEY" -H "X-Api-Secret: $SPACESHIP_API_SECRET" \
      "https://spaceship.dev/api/v1/domains/$DOMAIN" | python3 -c "import json,sys;print(' '.join(json.load(sys.stdin)['nameservers']['hosts']))")
    if [ "$CUR" = "$NS" ]; then
      echo "  ✓ 注册商已是: $NS"
    else
      curl -s -X PUT -H "X-Api-Key: $SPACESHIP_API_KEY" -H "X-Api-Secret: $SPACESHIP_API_SECRET" \
        -H "Content-Type: application/json" \
        "https://spaceship.dev/api/v1/domains/$DOMAIN/nameservers" \
        -d "{\"provider\":\"custom\",\"hosts\":$HOSTS}" --max-time 30 >/dev/null
      echo "  ✓ 已改为: $NS（原来是: $CUR）"
    fi
  fi
fi

echo "▸ 2/5 重新构建（注入 NEXT_PUBLIC_SITE_URL）"
NEXT_PUBLIC_SITE_URL="https://$DOMAIN" npm run build 2>&1 | grep -E "Compiled|error|Error|Generating static pages using 9 workers \(16" | tail -3

echo "▸ 3/5 部署到 Worker"
npx wrangler deploy 2>&1 | grep -E "Deployed|workers.dev|error" | tail -2

echo "▸ 4/5 绑定自定义域名（workers_routes API）"
ACC="${CF_ACCOUNT_ID:-70716e073f0925c564bafd0eaf0be307}"  # 舰队账号
BIND=$(curl -s -X PUT -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  "https://api.cloudflare.com/client/v4/accounts/$ACC/workers/domains" \
  -d "{\"environment\":\"production\",\"hostname\":\"$DOMAIN\",\"service\":\"petsuniverse\",\"zone_name\":\"$DOMAIN\"}")
echo "$BIND" | python3 -c "
import json,sys
d=json.load(sys.stdin)
if d.get('success'):
    r=d['result']; print('  ✓ 已绑定:', r.get('hostname'), '| cert:', (r.get('ssl') or {}).get('status'))
else:
    print('  ⚠️ 绑定失败:', [e.get('message') for e in d.get('errors',[])])
    print('     → dashboard: Workers → petsuniverse → Settings → Domains & Routes → Add custom domain')
"

echo "▸ 5/5 验证 + IndexNow"
sleep 45
for u in "https://$DOMAIN/" "https://$DOMAIN/codes/" "https://$DOMAIN/pets/"; do
  printf "  %-34s HTTP %s\n" "$u" "$(curl -s -o /dev/null -w '%{http_code}' --max-time 25 "$u")"
done
node scripts/submit-indexnow.mjs 2>&1 | grep -vE "UNDICI|trace" | tail -3

echo
echo "✅ 完成。剩下人工两件："
echo "   1. GSC 加属性 sc-domain:${DOMAIN}（DNS TXT 验证）→ 加服务账号为 Owner"
echo "   2. GA4 建属性 → 填 Cloudflare 构建变量 NEXT_PUBLIC_GA_ID"
