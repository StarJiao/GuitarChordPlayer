#!/usr/bin/env bash
# ============================================================
# 和弦播放器 —— 本地服务一键启动（手机预览用）
#
# 用法：
#   ./serve.sh           # 默认端口 5173
#   ./serve.sh 8080      # 指定端口
#
# 启动后：
#   1. 手机与本机连接同一个 WiFi
#   2. 在手机浏览器打开终端里显示的 Network 地址
#      （形如 http://192.168.x.x:5173）
#   3. 结束服务：终端按 Ctrl+C
# ============================================================
set -e
cd "$(dirname "$0")/播放器本体"

PORT="${1:-5173}"

if command -v npx >/dev/null 2>&1; then
  echo ">>> 使用 npx vite 启动（首次会自动下载 vite，稍等片刻）..."
  echo ">>> 手机与本机连同一 WiFi 后，浏览器打开下面 Network 地址："
  exec npx --yes vite@5 --host --port "$PORT"
fi

echo ">>> 未找到 npx，改用 python3 http.server 兜底"
echo ">>> 手机与本机连同一 WiFi 后，浏览器打开本机局域网 IP:${PORT}"
exec python3 -m http.server "$PORT" --bind 0.0.0.0
