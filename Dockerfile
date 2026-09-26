FROM oven/bun:1.4.2
WORKDIR /app

COPY package.json bun.lock tsconfig.json bunfig.toml ./
RUN bun install --frozen-lockfile

COPY src ./src
COPY styles ./styles

EXPOSE 3000
CMD ["bun", "--hot", "src/index.tsx"]
