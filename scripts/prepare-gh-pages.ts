#!/usr/bin/env bun
import { copyFile, writeFile } from "fs/promises";
import path from "path";

const distDir = path.join(process.cwd(), "dist");
const indexPath = path.join(distDir, "index.html");
const fallbackPath = path.join(distDir, "404.html");
const noJekyllPath = path.join(distDir, ".nojekyll");

await copyFile(indexPath, fallbackPath);
await writeFile(noJekyllPath, "");

console.log("Prepared GitHub Pages SPA fallback: dist/404.html");
console.log("Prepared GitHub Pages Jekyll bypass: dist/.nojekyll");
