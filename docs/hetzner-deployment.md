# Hetzner deployment

Ansible owns the server configuration. Docker Compose owns each application's
runtime, and one shared Caddy container owns public HTTP, HTTPS, and automatic
TLS. Bash is limited to publishing an immutable image and invoking Ansible.

```text
workstation
├── docker buildx → GHCR
└── Ansible over SSH
      └── Hetzner host
          ├── Caddy :80/:443
          └── isolated Compose projects
              └── Yes Chef + persistent SQLite
```

## Host layout

```text
/opt/
├── proxy/
│   ├── compose.yaml       # the only project publishing ports 80 and 443
│   ├── Caddyfile
│   └── sites/             # one route file per application
└── apps/
    └── yes-chef/
        ├── compose.yaml
        ├── .env           # immutable image reference
        └── data/          # persistent SQLite database
```

Applications join the external Docker network named `proxy`. Caddy reaches Yes
Chef at `yes-chef:8080`; port 8080 is never published on the host.

## Responsibility boundary

Ansible manages packages, Docker, swap, SSH policy, fail2ban, unattended
security updates, UFW, directories, Compose definitions, Caddy, application
deployment, and the final health check. It deliberately does not remove
Coolify or any unknown service occupying ports 80/443.

Before the first run, export anything needed from the old Coolify project and
stop/remove Coolify deliberately. The playbook aborts if a Coolify container or
an unknown listener on ports 80/443 remains.

## Prerequisites

1. Restore SSH access as the `deploy` user.
2. Point the application's DNS `A` record at the server.
3. Install the Ansible collections once:

   ```bash
   ansible-galaxy collection install \
     -r deploy/hetzner/ansible/requirements.yml
   ```

4. Authenticate the workstation to GHCR:

   ```bash
   gh auth token | docker login ghcr.io \
     -u YOUR_GITHUB_USERNAME --password-stdin
   ```

5. Make the GHCR package public so the server can pull it without registry
   credentials. Private-image authentication can be added later with Ansible
   Vault.

   On the very first publish, the package might not exist yet. Publish without
   contacting the server, change the new package visibility to public in
   GitHub, then deploy that printed image reference:

   ```bash
   PUBLISH_ONLY=1 ./scripts/deploy-hetzner.sh
   export DEPLOY_IMAGE=ghcr.io/tki2396/yes-chef:PRINTED_COMMIT_TAG
   ./scripts/deploy-hetzner.sh
   unset DEPLOY_IMAGE
   ```

The deployment user needs passwordless `sudo`. Ansible enables UFW only after
allowing SSH, HTTP, HTTPS, and HTTP/3.

## Inspect before replacing Coolify

Run these on the server before the first Ansible deployment:

```bash
docker ps
sudo ss -lntup
sudo du -sh /data/coolify 2>/dev/null || true
```

Do not delete application data until you have confirmed the previous project
is disposable or backed up.

## Validate Ansible locally

Syntax checking does not contact the server:

```bash
ANSIBLE_CONFIG=deploy/hetzner/ansible/ansible.cfg \
ansible-playbook deploy/hetzner/ansible/site.yml --syntax-check
```

After SSH works, preview host changes without applying them:

```bash
cp deploy/hetzner/ansible/inventory.ini.example \
  deploy/hetzner/ansible/inventory.ini
$EDITOR deploy/hetzner/ansible/inventory.ini

ANSIBLE_CONFIG=deploy/hetzner/ansible/ansible.cfg \
ansible-playbook -i deploy/hetzner/ansible/inventory.ini \
  deploy/hetzner/ansible/site.yml --check --diff \
  -e caddy_email=you@example.com \
  -e yes_chef_domain=recipes.example.com \
  -e yes_chef_image=ghcr.io/tki2396/yes-chef:EXISTING_TAG
```

Docker actions cannot be fully simulated in check mode, so review its output as
a preview rather than a proof.

## Publish and deploy

The normal deployment is one command after setting its inputs:

```bash
export DEPLOY_HOST=203.0.113.10
export DEPLOY_USER=deploy
export SSH_IDENTITY="$HOME/.ssh/hetzner_deploy"
export CADDY_EMAIL=you@example.com
export YES_CHEF_DOMAIN=recipes.example.com
./scripts/deploy-hetzner.sh
```

The script requires a clean Git tree, builds `linux/amd64`, tags the image with
the current commit, pushes it to GHCR, then runs the playbook. Running the same
playbook again converges drift instead of repeating imperative setup steps.

## Roll back

Deploy an existing immutable image without rebuilding:

```bash
export DEPLOY_IMAGE=ghcr.io/tki2396/yes-chef:PREVIOUS_COMMIT_TAG
./scripts/deploy-hetzner.sh
unset DEPLOY_IMAGE
```

## Add another application

Give each app its own `/opt/apps/<name>` directory, Compose project, persistent
data, resource limits, Docker network alias, and Caddy site template. Extend the
playbook rather than making lasting edits directly on the server.

## Operations to practice

```bash
docker ps
docker stats

cd /opt/apps/yes-chef
sudo docker compose logs -f --tail=100

cd /opt/proxy
sudo docker compose exec caddy caddy validate --config /etc/caddy/Caddyfile

du -sh /opt/apps/yes-chef/data
df -h /
```

## Backups

Hetzner server backups are useful for disaster recovery, but also create a
SQLite-consistent backup and copy it off the server. Do not rely only on a live
filesystem snapshot of a WAL-mode database. The next infrastructure increment
should add a scheduled SQLite backup-API or `VACUUM INTO` job and off-host
retention.
