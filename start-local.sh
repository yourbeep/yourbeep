#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/new-backend"
ADMIN_DIR="$ROOT_DIR/admin_yourbeep"

wt.exe -w 0 \
new-tab --title "gateway" powershell.exe -NoExit -Command "cd '$BACKEND_DIR'; bun run dev:gateway" \; \
new-tab --title "identity" powershell.exe -NoExit -Command "cd '$BACKEND_DIR'; bun run dev:identity" \; \
new-tab --title "content" powershell.exe -NoExit -Command "cd '$BACKEND_DIR'; bun run dev:content" \; \
new-tab --title "commerce" powershell.exe -NoExit -Command "cd '$BACKEND_DIR'; bun run dev:commerce" \; \
new-tab --title "admin" powershell.exe -NoExit -Command "cd '$ADMIN_DIR'; npm run dev"