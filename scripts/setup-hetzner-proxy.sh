#!/usr/bin/env bash
set -euo pipefail

# Run this once from your workstation. It installs the shared reverse proxy
# configuration without coupling Caddy to any one application.
: "${DEPLOY_HOST:?Set DEPLOY_HOST, for example 203.0.113.10}"
: "${CADDY_EMAIL:?Set CADDY_EMAIL for TLS expiry notices}"

if [[ ! "$CADDY_EMAIL" =~ ^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+$ ]]; then
  echo "CADDY_EMAIL must be a plain email address" >&2
  exit 1
fi

DEPLOY_USER="${DEPLOY_USER:-root}"
SSH_IDENTITY="${SSH_IDENTITY:-$HOME/.ssh/hetzner_deploy}"
REMOTE="${DEPLOY_USER}@${DEPLOY_HOST}"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
STAGING_DIR="$(mktemp -d)"
trap 'rm -r "$STAGING_DIR"' EXIT

SSH=(ssh -i "$SSH_IDENTITY" -o IdentitiesOnly=yes "$REMOTE")
SCP=(scp -i "$SSH_IDENTITY" -o IdentitiesOnly=yes)

printf 'CADDY_EMAIL=%s\n' "$CADDY_EMAIL" > "$STAGING_DIR/caddy.env"

"${SSH[@]}" 'set -eu; sudo install -d -m 0755 /opt/proxy/sites; sudo docker network inspect proxy >/dev/null 2>&1 || sudo docker network create proxy'
"${SCP[@]}" "$REPO_ROOT/deploy/hetzner/proxy/compose.yaml" "$REMOTE:/tmp/yes-chef-proxy-compose.yaml"
"${SCP[@]}" "$REPO_ROOT/deploy/hetzner/proxy/Caddyfile" "$REMOTE:/tmp/yes-chef-Caddyfile"
"${SCP[@]}" "$STAGING_DIR/caddy.env" "$REMOTE:/tmp/yes-chef-caddy.env"

"${SSH[@]}" 'set -eu; sudo install -m 0644 /tmp/yes-chef-proxy-compose.yaml /opt/proxy/compose.yaml; sudo install -m 0644 /tmp/yes-chef-Caddyfile /opt/proxy/Caddyfile; sudo install -m 0600 /tmp/yes-chef-caddy.env /opt/proxy/.env; cd /opt/proxy; sudo docker compose up -d'

echo "Shared proxy is running. Point app DNS at $DEPLOY_HOST before deploying an app."
