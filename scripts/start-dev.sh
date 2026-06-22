#!/usr/bin/env bash
# Run from project root: ./start.sh  (do not symlink — use this file)
cd "$(dirname "$0")"
exec bash scripts/start-dev.sh
