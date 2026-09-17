# Yes Chef deployment

This repository owns the Yes Chef container image and application runtime.
The separate [`Infra`](https://github.com/tki2396/Infra) repository configures
the Hetzner host, Docker, firewall, shared proxy network, and Caddy.

Run the Infra host playbook once before deploying this application.

## Install application dependencies

Install the Ansible collection on the workstation:

```bash
ansible-galaxy collection install \
  -r deploy/requirements.yml
```

Authenticate Docker to GHCR and make the resulting package public, or arrange
registry authentication on the server if the package remains private.

```bash
gh auth token | docker login ghcr.io \
  -u YOUR_GITHUB_USERNAME --password-stdin
```

## Publish

Publishing requires a clean Git tree. It builds for the server's `linux/amd64`
platform, pushes both an immutable commit tag and `latest`, and does not load a
new container image into the workstation's Docker engine.

```bash
./scripts/publish-image.sh
```

## Deploy

Use the immutable image reference printed by the publish script:

```bash
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

## Roll back

Set `YES_CHEF_IMAGE` to a previously published immutable tag and run the same
deployment script again.

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
