# Yes Chef deployment

This repository owns the Yes Chef container image and application runtime.
The separate [`Infra`](https://github.com/tki2396/Infra) repository configures
the Hetzner host, Docker, firewall, shared proxy network, and Caddy.

Run the Infra host playbook once before deploying this application.

## Automatic production deployment

Every push to `main` runs `.github/workflows/deploy-hetzner.yml`. The workflow:

1. Builds the `linux/amd64` image.
2. Publishes immutable commit-SHA and `latest` tags to GHCR using the
   repository's `GITHUB_TOKEN`.
3. Authenticates the server to GHCR with that short-lived token.
4. Deploys the exact commit-SHA image with Ansible.
5. Removes the registry credentials from the server.

Configure a GitHub environment named `production` with these values before
merging the deployment branch:

- Variable `DEPLOY_HOST`: the server IP address.
- Variable `DEPLOY_USER`: `deploy`.
- Variable `YES_CHEF_DOMAIN`: the public application hostname.
- Secret `DEPLOY_SSH_KEY`: a dedicated private key for CI without a passphrase.
- Secret `DEPLOY_KNOWN_HOSTS`: the pinned SSH host-key entry for the server.

Production does not deploy from feature branches. Failed workflow jobs can be
retried against the same immutable image tag.

## Manual deployment and rollback

The local script remains available for diagnostics and rollback. Install its
Ansible collection, then provide an existing image reference:

```bash
ansible-galaxy collection install -r deploy/requirements.yml

export DEPLOY_HOST=203.0.113.10
export DEPLOY_USER=deploy
export SSH_IDENTITY="$HOME/.ssh/hetzner_deploy"
export YES_CHEF_DOMAIN=recipes.example.com
export YES_CHEF_IMAGE=ghcr.io/tki2396/yes-chef:COMMIT_TAG
./scripts/deploy-hetzner.sh
```

The app playbook installs this repository's `compose.production.yaml`, creates
the persistent SQLite directory, adds the Yes Chef Caddy route, deploys the
container, reloads Caddy, and checks the public health endpoint. It refuses to
run until the shared proxy has been configured by the Infra repository.

## Inspect the app

```bash
cd /opt/apps/yes-chef
sudo docker compose ps
sudo docker compose logs -f --tail=100
du -sh data
```

Hetzner server backups help with disaster recovery, but SQLite also needs a
database-consistent backup copied off the server. Do not rely solely on a live
filesystem snapshot of a WAL-mode database.
