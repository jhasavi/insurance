#!/usr/bin/env bash
# Safora local dev — run from repo root: ./start.sh
# Works when invoked from any subdirectory (finds package.json by walking up).
set -euo pipefail

find_project_root() {
  local dir
  if [[ -n "${BASH_SOURCE[0]:-}" ]]; then
    dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  else
    dir="$PWD"
  fi
  while [[ "$dir" != "/" ]]; do
    if [[ -f "$dir/package.json" ]]; then
      printf '%s\n' "$dir"
      return 0
    fi
    dir="$(dirname "$dir")"
  done
  echo "error: could not find project root (no package.json above $(pwd))" >&2
  return 1
}

ROOT="$(find_project_root)"
cd "$ROOT"

if ! command -v pnpm >/dev/null 2>&1; then
  echo "error: pnpm is required — https://pnpm.io/installation" >&2
  exit 1
fi

if [[ ! -d node_modules ]]; then
  echo "→ Installing dependencies (first run)…"
  pnpm install
fi

if [[ ! -f .env.local ]] && [[ -f .env.example ]]; then
  echo "→ Tip: cp .env.example .env.local and set DATABASE_URL for auth/database features."
fi

echo "→ Dev server: http://localhost:3001"
echo "→ Press Ctrl+C to stop."
exec pnpm dev
