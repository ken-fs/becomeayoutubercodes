#!/usr/bin/env bash
# 轮询 animedice.xyz 的 NS 委派，生效后自动核对站点。
# 用法: bash scripts/watch-domain.sh [轮次] [间隔秒]
set -uo pipefail
D=animedice.xyz
ROUNDS="${1:-20}"
SLEEP="${2:-60}"

echo "监控 $D 的 NS 委派（$ROUNDS 轮 × ${SLEEP}s）"
echo

for i in $(seq 1 "$ROUNDS"); do
  # 走 DoH，绕开本机 Clash 的 DNS 劫持
  NS=$(curl -s --max-time 15 -H "accept: application/dns-json" \
    "https://cloudflare-dns.com/dns-query?name=$D&type=NS" 2>/dev/null \
    | python3 -c "
import sys,json
try:
    d=json.load(sys.stdin)
    print(' '.join(sorted(a['data'].rstrip('.') for a in d.get('Answer',[]) if a['type']==2)))
except: pass
")
  ts=$(date +%H:%M:%S)
  if echo "$NS" | grep -q cloudflare; then
    echo "[$ts] ✅ 已生效: $NS"
    echo
    echo "── 核对站点 ──"
    IP=$(curl -s --max-time 15 -H "accept: application/dns-json" \
      "https://cloudflare-dns.com/dns-query?name=$D&type=A" 2>/dev/null \
      | python3 -c "
import sys,json
try:
    d=json.load(sys.stdin)
    a=[x['data'] for x in d.get('Answer',[]) if x['type']==1]
    print(a[0] if a else '')
except: pass
")
    echo "  A 记录: ${IP:-（尚未解析）}"
    if [ -n "$IP" ]; then
      for p in "/" "/codes/" "/units/" "/grades/" "/sitemap.xml" "/robots.txt"; do
        code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 20 --resolve "$D:443:$IP" "https://$D$p")
        printf "  %-16s %s\n" "$p" "$code"
      done
    fi
    exit 0
  fi
  echo "[$ts] ⏳ 还是旧 NS: ${NS:-（无记录）}"
  [ "$i" -lt "$ROUNDS" ] && sleep "$SLEEP"
done

echo
echo "⏳ $ROUNDS 轮后仍未生效。NS 变更最长 48h，可稍后再跑。"
