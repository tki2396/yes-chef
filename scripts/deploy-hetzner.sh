#!/usr/bin/env bash
set -euo pipefail

# Builds an immutable linux/amd64 image, pushes it to GHCR, and updates only
# the Yes Chef Compose project on the shared host.
: "${DEPLOY_HOST:?Set DEPLOY_HOST, for example 203.0.113.10}"
: "${YES_CHEF_DOMAIN:?Set YES_CHEF_DOMAIN, for example recipes.example.com}"

if [[ ! "$YES_CHEF_DOMAIN" =~ ^[A-Za-z0-9.-]+$ ]]; then
  echo "YES_CHEF_DOMAIN must be a plain hostname" >&2
  exit 1
fi

DEPLOY_USER="${DEPLOY_USER:-root}"
SSH_IDENTITY="${SSH_IDENTITY:-$HOME/.ssh/hetzner_deploy}"
IMAGE_REPOSITORY="${IMAGE_REPOSITORY:-ghcr.io/tki2396/yes-chef}"
REMOTE="${DEPLOY_USER}@${DEPLOY_HOST}"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if ! git -C "$REPO_ROOT" diff --quiet || \
   ! git -C "$REPO_ROOT" diff --cached --quiet || \
   [[ -n "$(git -C "$REPO_ROOT" ls-files --others --exclude-standard)" ]]; then
  echo "Commit the deployment before publishing so the image tag identifies its exact source." >&2
  exit 1
fi

IMAGE_TAG="$(git -C "$REPO_ROOT" rev-parse --short=12 HEAD)"
IMAGE_REF="$IMAGE_REPOSITORY:$IMAGE_TAG"
STAGING_DIR="$(mktemp -d)"
trap 'rm -r "$STAGING_DIR"' EXIT

SSH=(ssh -i "$SSH_IDENTITY" -o IdentitiesOnly=yes "$REMOTE")
SCP=(scp -i "$SSH_IDENTITY" -o IdentitiesOnly=yes)

printf 'Publishing %s\n' "$IMAGE_REF"
docker buildx build \
  --platform linux/amd64 \
  --tag "$IMAGE_REF" \
  --tag "$IMAGE_REPOSITORY:latest" \
  --push \
  "$REPO_ROOT"

sed "s/__YES_CHEF_DOMAIN__/$YES_CHEF_DOMAIN/g" \
  "$REPO_ROOT/deploy/hetzner/yes-chef.caddy.template" \
  > "$STAGING_DIR/yes-chef.caddy"
printf 'YES_CHEF_IMAGE=%s\n' "$IMAGE_REF" > "$STAGING_DIR/yes-chef.env"

"${SSH[@]}" 'set -eu; sudo install -d -m 0755 /opt/apps/yes-chef/data /opt/proxy/sites; sudo chown -R 1000:1000 /opt/apps/yes-chef/data; sudo docker network inspect proxy >/dev/null'
"${SCP[@]}" "$REPO_ROOT/compose.production.yaml" "$REMOTE:/tmp/yes-chef-compose.yaml"
"${SCP[@]}" "$STAGING_DIR/yes-chef.env" "$REMOTE:/tmp/yes-chef.env"
"${SCP[@]}" "$STAGING_DIR/yes-chef.caddy" "$REMOTE:/tmp/yes-chef.caddy"

"${SSH[@]}" 'set -eu; sudo install -m 0644 /tmp/yes-chef-compose.yaml /opt/apps/yes-chef/compose.yaml; sudo install -m 0600 /tmp/yes-chef.env /opt/apps/yes-chef/.env; sudo install -m 0644 /tmp/yes-chef.caddy /opt/proxy/sites/yes-chef.caddy; cd /opt/apps/yes-chef; sudo docker compose pull; sudo docker compose up -d --remove-orphans; cd /opt/proxy; sudo docker compose exec -T caddy caddy validate --config /etc/caddy/Caddyfile; sudo docker compose exec -T caddy caddy reload --config /etc/caddy/Caddyfile'

echo "Deployed $IMAGE_REF to https://$YES_CHEF_DOMAIN"
