#!/usr/bin/env bash
set -euo pipefail

: "${DEPLOY_HOST:?Set DEPLOY_HOST, for example 203.0.113.10}"
: "${YES_CHEF_DOMAIN:?Set YES_CHEF_DOMAIN, for example recipes.example.com}"
: "${YES_CHEF_IMAGE:?Set YES_CHEF_IMAGE to an immutable published image tag}"

if [[ ! "$YES_CHEF_DOMAIN" =~ ^[A-Za-z0-9.-]+$ ]]; then
  echo "YES_CHEF_DOMAIN must be a plain hostname" >&2
  exit 1
fi

DEPLOY_USER="${DEPLOY_USER:-deploy}"
SSH_IDENTITY="${SSH_IDENTITY:-$HOME/.ssh/hetzner_deploy}"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if ! git -C "$REPO_ROOT" diff --quiet || \
   ! git -C "$REPO_ROOT" diff --cached --quiet || \
   [[ -n "$(git -C "$REPO_ROOT" ls-files --others --exclude-standard)" ]]; then
  echo "Commit the deployment definition before deploying it." >&2
  exit 1
fi

ANSIBLE_LOCAL_TEMP="${ANSIBLE_LOCAL_TEMP:-/tmp/yes-chef-ansible}" \
ansible-playbook \
  --inventory "${DEPLOY_HOST}," \
  --user "$DEPLOY_USER" \
  --private-key "$SSH_IDENTITY" \
  --extra-vars "yes_chef_image=$YES_CHEF_IMAGE" \
  --extra-vars "yes_chef_domain=$YES_CHEF_DOMAIN" \
  "$REPO_ROOT/deploy/site.yml"

echo "Deployed $YES_CHEF_IMAGE to https://$YES_CHEF_DOMAIN"
