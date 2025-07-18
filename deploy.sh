#!/usr/bin/env bash
# deploy.sh - Commit and push madlabzdevs static site updates
set -euo pipefail

# Ensure script is running from repo root
REPO_ROOT=$(git rev-parse --show-toplevel)
cd "$REPO_ROOT"

echo "🔀 Staging all changes..."
git add .

# Timestamped commit
timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
git commit -m "chore(deploy): update site at $timestamp"

echo "🚀 Pushing to origin main..."
git push origin main

echo "✅ Static site deployed!"