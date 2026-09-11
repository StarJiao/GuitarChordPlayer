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
#   3. 结束服务：终端按 Ctrl+C
# ============================================================
set -e
cd "$(dirname "$0")/播放器本体"

PORT="${1:-5173}"

# 优先 python3（系统自带、零依赖、秒启动），vite 仅作兜底
if command -v python3 >/dev/null 2>&1; then
  IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "127.0.0.1")
  echo ">>> 本地服务已启动（python3 http.server）"
  echo ">>> 本机:   http://127.0.0.1:${PORT}"
  echo ">>> 手机:   http://${IP}:${PORT}  （需与本机连同一 WiFi）"
  echo ">>> 按 Ctrl+C 停止服务"
  exec python3 -m http.server "$PORT" --bind 0.0.0.0
fi

echo ">>> 未找到 python3，改用 npx vite（首次需下载，稍候）..."
exec npx --yes vite@5 --host --port "$PORT"
