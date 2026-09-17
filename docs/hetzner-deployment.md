# Hetzner deployment

Yes Chef runs as one isolated Docker Compose project behind a shared Caddy
reverse proxy. This layout allows other applications to use the same server
without sharing processes, ports, data directories, or Compose lifecycles.

## Host layout

```text
/opt/
├── proxy/
│   ├── compose.yaml       # the only service publishing ports 80 and 443
│   ├── Caddyfile
│   └── sites/             # one routing file per application
└── apps/
    └── yes-chef/
        ├── compose.yaml
        ├── .env           # exact immutable image reference
        └── data/          # persistent SQLite database
```

All application containers join the external Docker network named `proxy`.
Caddy reaches Yes Chef through the `yes-chef:8080` network alias. Port 8080 is
not published by the host and is therefore unavailable from the internet.

## Prerequisites

On the server, install Docker Engine with the Compose plugin. Permit inbound
TCP 22, 80, and 443 and UDP 443 in both the Hetzner firewall and UFW. Keep all
other inbound ports closed. The deployment account needs passwordless `sudo`
for the Docker and file-install commands used by the scripts.

On the workstation:

1. Authenticate Docker to GitHub Container Registry.
2. Create an `A` record for the application hostname pointing to the server.
3. Ensure the configured SSH identity can access the deployment account.

For a public GHCR image, authenticate before publishing with:

```bash
gh auth token | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin
```

## First-time proxy setup

Run this once for the whole server:

```bash
export DEPLOY_HOST=203.0.113.10
export DEPLOY_USER=root
export SSH_IDENTITY="$HOME/.ssh/hetzner_deploy"
export CADDY_EMAIL=you@example.com
./scripts/setup-hetzner-proxy.sh
```

Caddy obtains and renews TLS certificates automatically after DNS resolves to
the server.

## Deploy Yes Chef

```bash
export DEPLOY_HOST=203.0.113.10
export DEPLOY_USER=root
export SSH_IDENTITY="$HOME/.ssh/hetzner_deploy"
export YES_CHEF_DOMAIN=recipes.example.com
./scripts/deploy-hetzner.sh
```

The deploy script builds for the server's `linux/amd64` architecture, tags the
image with the current Git commit, pushes both the immutable tag and `latest`,
uploads only configuration, pulls the immutable image on the server, and
restarts only the Yes Chef Compose project. It requires a clean, committed
working tree so the image tag always identifies the exact source that produced
it.

Rollback uses any earlier commit tag:

```bash
ssh root@203.0.113.10
cd /opt/apps/yes-chef
sed -i 's/:CURRENT_TAG$/:PREVIOUS_TAG/' .env
docker compose pull
docker compose up -d
```

## Adding another application

Give every app its own `/opt/apps/<name>` directory, Compose project, data
directory, resource limits, and proxy-network alias. Add one corresponding
`/opt/proxy/sites/<name>.caddy` file, then reload Caddy. Do not publish the
application's internal port on the host.

## Operations to learn and practice

```bash
# Show all containers and health states
docker ps

# Follow this app's logs
cd /opt/apps/yes-chef && docker compose logs -f --tail=100

# Inspect resource usage
docker stats

# Validate and reload the proxy
cd /opt/proxy
docker compose exec caddy caddy validate --config /etc/caddy/Caddyfile
docker compose exec caddy caddy reload --config /etc/caddy/Caddyfile

# Verify the database directory and disk capacity
du -sh /opt/apps/yes-chef/data
df -h /
```

## Backups

Hetzner server backups are useful for disaster recovery, but also create a
SQLite-consistent backup and copy it off the server. Do not rely only on a live
filesystem snapshot of a WAL-mode database. A later deployment step should add
an automated `VACUUM INTO` or SQLite backup-API job plus off-host retention.
