#!/usr/bin/env bash
set -euo pipefail

IMAGE_REPOSITORY="${IMAGE_REPOSITORY:-ghcr.io/tki2396/yes-chef}"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if ! git -C "$REPO_ROOT" diff --quiet || \
   ! git -C "$REPO_ROOT" diff --cached --quiet || \
   [[ -n "$(git -C "$REPO_ROOT" ls-files --others --exclude-standard)" ]]; then
  echo "Commit the source before publishing so the image tag identifies it exactly." >&2
  exit 1
fi

IMAGE_TAG="$(git -C "$REPO_ROOT" rev-parse --short=12 HEAD)"
IMAGE_REF="$IMAGE_REPOSITORY:$IMAGE_TAG"

printf 'Publishing %s\n' "$IMAGE_REF"
docker buildx build \
  --platform linux/amd64 \
  --tag "$IMAGE_REF" \
  --tag "$IMAGE_REPOSITORY:latest" \
  --push \
  "$REPO_ROOT"

printf 'Published %s\n' "$IMAGE_REF"
printf 'Deploy it with:\n  export YES_CHEF_IMAGE=%q\n  ./scripts/deploy-hetzner.sh\n' "$IMAGE_REF"
