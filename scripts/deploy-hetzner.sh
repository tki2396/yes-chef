#!/usr/bin/env bash
set -euo pipefail

# Build and publish an immutable image, then let Ansible converge the host.
IMAGE_REPOSITORY="${IMAGE_REPOSITORY:-ghcr.io/tki2396/yes-chef}"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if ! git -C "$REPO_ROOT" diff --quiet || \
   ! git -C "$REPO_ROOT" diff --cached --quiet || \
   [[ -n "$(git -C "$REPO_ROOT" ls-files --others --exclude-standard)" ]]; then
  echo "Commit the deployment before publishing so the image tag identifies its exact source." >&2
  exit 1
fi

if [[ -n "${DEPLOY_IMAGE:-}" ]]; then
  IMAGE_REF="$DEPLOY_IMAGE"
  printf 'Deploying existing image %s\n' "$IMAGE_REF"
else
  IMAGE_TAG="$(git -C "$REPO_ROOT" rev-parse --short=12 HEAD)"
  IMAGE_REF="$IMAGE_REPOSITORY:$IMAGE_TAG"

  printf 'Publishing %s\n' "$IMAGE_REF"
  docker buildx build \
    --platform linux/amd64 \
    --tag "$IMAGE_REF" \
    --tag "$IMAGE_REPOSITORY:latest" \
    --push \
    "$REPO_ROOT"
fi

if [[ "${PUBLISH_ONLY:-0}" == "1" && -n "${DEPLOY_IMAGE:-}" ]]; then
  echo "PUBLISH_ONLY cannot be combined with DEPLOY_IMAGE because nothing would be published." >&2
  exit 1
fi

if [[ "${PUBLISH_ONLY:-0}" == "1" ]]; then
  printf 'Published %s; deployment skipped because PUBLISH_ONLY=1.\n' "$IMAGE_REF"
  exit 0
fi

: "${DEPLOY_HOST:?Set DEPLOY_HOST, for example 203.0.113.10}"
: "${YES_CHEF_DOMAIN:?Set YES_CHEF_DOMAIN, for example recipes.example.com}"
: "${CADDY_EMAIL:?Set CADDY_EMAIL for TLS expiry notices}"

if [[ ! "$YES_CHEF_DOMAIN" =~ ^[A-Za-z0-9.-]+$ ]]; then
  echo "YES_CHEF_DOMAIN must be a plain hostname" >&2
  exit 1
fi

if [[ ! "$CADDY_EMAIL" =~ ^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+$ ]]; then
  echo "CADDY_EMAIL must be a plain email address" >&2
  exit 1
fi

DEPLOY_USER="${DEPLOY_USER:-deploy}"
SSH_IDENTITY="${SSH_IDENTITY:-$HOME/.ssh/hetzner_deploy}"

ANSIBLE_CONFIG="$REPO_ROOT/deploy/hetzner/ansible/ansible.cfg" \
ANSIBLE_LOCAL_TEMP="${ANSIBLE_LOCAL_TEMP:-/tmp/yes-chef-ansible}" \
ansible-playbook \
  --inventory "${DEPLOY_HOST}," \
  --user "$DEPLOY_USER" \
  --private-key "$SSH_IDENTITY" \
  --extra-vars "yes_chef_image=$IMAGE_REF" \
  --extra-vars "yes_chef_domain=$YES_CHEF_DOMAIN" \
  --extra-vars "caddy_email=$CADDY_EMAIL" \
  "$REPO_ROOT/deploy/hetzner/ansible/site.yml"

echo "Deployed $IMAGE_REF to https://$YES_CHEF_DOMAIN"
