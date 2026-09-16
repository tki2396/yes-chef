# syntax=docker/dockerfile:1

FROM oven/bun:1.4.2
WORKDIR /app

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=8080

# Keep the runtime image focused on the files needed to serve the app.
COPY package.json bun.lock tsconfig.json bunfig.toml build.ts ./
RUN bun install --frozen-lockfile --production

COPY src ./src
COPY styles ./styles

# Compile the browser bundle used by the production server.
RUN bun run build --public-path /

# SQLite needs a writable directory. A hosted deployment must mount persistent
# storage here if recipe data should survive a container restart.
RUN mkdir -p /app/data && chown -R bun:bun /app
USER bun

EXPOSE 8080
CMD ["bun", "run", "src/index.tsx"]
