#!/usr/bin/env bash
# pnpm start:dev entry — delegates to repo-root start.sh (do not symlink start.sh here).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
exec bash "$ROOT/start.sh" "$@"
