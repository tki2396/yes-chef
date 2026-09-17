# bun-react-tailwind-shadcn-template

To install dependencies:

```bash
bun install
```

To start a development server:

```bash
bun dev
```

To run for production:

```bash
bun start
```

This project uses Bun v1.4.2. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## Hetzner deployment

This repository owns the Yes Chef image and its production Compose project.
Shared host configuration and Caddy live in the
[`Infra`](https://github.com/tki2396/Infra) repository so other applications
can use the same server. See the
[Yes Chef deployment runbook](docs/hetzner-deployment.md).

Pushes to `main` build, publish, and deploy an immutable container image through
GitHub Actions. Other branches do not deploy production.
