#!/usr/bin/env bash
# 域名定下来后跑这个：重新构建 + 部署 + 绑定 custom domain
#
#   bash scripts/set-domain.sh animedice.gg
#
# 绑 domain 需要域名已经在同一个 Cloudflare 账号里。
set -euo pipefail
DOMAIN="${1:-}"
[ -z "$DOMAIN" ] && { echo "用法: bash scripts/set-domain.sh <域名>"; exit 1; }

cd "$(dirname "$0")/.."
echo "▸ 域名: $DOMAIN"

echo "▸ 重新构建（注入 NEXT_PUBLIC_SITE_URL）"
NEXT_PUBLIC_SITE_URL="https://$DOMAIN" npm run build 2>&1 | grep -E "Compiled|error|Error|Generating" | tail -3

echo "▸ 部署"
npx wrangler deploy 2>&1 | grep -E "Uploaded|Deployed|workers.dev|error" | tail -3

echo "▸ 绑定 custom domain"
npx wrangler domains add "$DOMAIN" 2>&1 | grep -vE "UNDICI|trace" | tail -5 || \
  echo "  ⚠️ 自动绑定失败，去 dashboard: Workers → animedice → Settings → Domains & Routes"

echo
echo "✅ 完成。接下来："
echo "   1. GSC 加属性 sc-domain:$DOMAIN 并提交 sitemap"
echo "   2. 推 IndexNow"
