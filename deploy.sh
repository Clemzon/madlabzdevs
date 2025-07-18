#!/usr/bin/env bash
set -euo pipefail

# deploy.sh - Commit and push madlabzdevs static site updates
# Usage:
#   ./deploy.sh ["Custom commit message"]

# Navigate to the repository root
git_root=$(git rev-parse --show-toplevel)
cd "$git_root"

echo "🔄 Pulling latest changes from origin/main..."
git pull --rebase origin main

echo "🔀 Staging all changes..."
git add .

# Determine commit message
if [ $# -gt 0 ]; then
  commit_msg="$*"
else
  commit_msg="chore(deploy): update site at $(date -u +'%Y-%m-%dT%H:%M:%SZ')"
fi

# Commit only if there are staged changes
if git diff --cached --quiet; then
  echo "ℹ️ No changes to commit."
else
  echo "💾 Committing with message: $commit_msg"
  git commit -m "$commit_msg"
fi

echo "🚀 Pushing to origin main..."
git push origin main

echo "✅ Deployment complete!"