#!/bin/bash

set -e

# Check if commit message is provided
if [ $# -eq 0 ]; then
    echo "Error: Commit message is required"
    echo "Usage: ./commit.sh \"your commit message\" [remote]"
    echo "  remote: 可选，指定 remote 名称（如 origin, github），留空则推送到全部 remote"
    exit 1
fi

COMMIT_MESSAGE="$1"
REMOTE_NAME="$2"  # 可选的 remote 名称

# Add all changes
echo "Adding all changes..."
git add .

# Commit
echo "Committing..."
git commit -m "$COMMIT_MESSAGE"

# Get list of remotes
if [ -n "$REMOTE_NAME" ]; then
    # 验证指定的 remote 是否存在
    if ! git remote | grep -q "^${REMOTE_NAME}$"; then
        echo "Error: Remote '$REMOTE_NAME' not found"
        echo "Available remotes:"
        git remote
        exit 1
    fi
    REMOTES="$REMOTE_NAME"
else
    REMOTES=$(git remote)
fi

REMOTE_COUNT=$(echo "$REMOTES" | wc -l | tr -d '[:space:]')

echo "Found $REMOTE_COUNT remote(s) to push:"
echo "$REMOTES"
echo
echo "Pushing..."
echo

# Push to specified remotes
for REMOTE in $REMOTES; do
    echo ">>> Pushing to $REMOTE..."
    git push "$REMOTE"
    echo "<<< Pushed to $REMOTE done"
    echo
done

echo "Done! ✅"
