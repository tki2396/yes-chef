#!/usr/bin/env bun

import { existsSync } from "node:fs";
import path from "node:path";

const distDirectory = path.resolve(process.cwd(), "dist");
const basePath = "/yes-chef";
const port = process.env.PORT ? Number(process.env.PORT) : 4173;

if (!existsSync(path.join(distDirectory, "index.html"))) {
  throw new Error("Missing dist/index.html. Run the GitHub Pages build first.");
}

const server = Bun.serve({
  port,
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/") {
      return Response.redirect(`${url.origin}${basePath}/`, 302);
    }

    if (url.pathname !== basePath && !url.pathname.startsWith(`${basePath}/`)) {
      return new Response("Not found", { status: 404 });
    }

    const requestedPath = url.pathname.slice(basePath.length) || "/";
    const relativePath = requestedPath === "/" ? "index.html" : decodeURIComponent(requestedPath.slice(1));
    const filePath = path.resolve(distDirectory, relativePath);
    const isInsideDist = filePath === distDirectory || filePath.startsWith(`${distDirectory}${path.sep}`);

    if (isInsideDist && existsSync(filePath)) {
      return new Response(Bun.file(filePath));
    }

    return new Response(Bun.file(path.join(distDirectory, "404.html")), {
      status: 404,
      headers: { "Cache-Control": "no-store" },
    });
  },
});

console.log(`GitHub Pages preview: ${server.url.origin}${basePath}/`);
console.log(`Nested route example: ${server.url.origin}${basePath}/drafts/sample`);
