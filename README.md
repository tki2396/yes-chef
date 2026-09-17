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

Production runs as an isolated Docker Compose project behind a shared Caddy
proxy, allowing multiple applications to coexist on one server. See the
[Hetzner deployment runbook](docs/hetzner-deployment.md).
