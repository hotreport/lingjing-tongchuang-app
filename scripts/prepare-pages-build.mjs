#!/usr/bin/env node
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const repository = process.env.GITHUB_REPOSITORY;
const repositoryName = repository?.split("/")[1];
if (!repositoryName) {
  throw new Error("GITHUB_REPOSITORY is required to prepare the GitHub Pages build.");
}

const clientDir = path.resolve("dist/client");
const basePath = `/${repositoryName}/`;
const textExtensions = new Set([".html", ".js", ".css"]);

async function visit(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await visit(filePath);
      continue;
    }

    if (!textExtensions.has(path.extname(entry.name))) continue;
    const original = await readFile(filePath, "utf8");
    const updated = original.replace(/(["'`])\/assets\//g, `$1${basePath}assets/`);
    if (updated !== original) await writeFile(filePath, updated, "utf8");
  }
}

await visit(clientDir);
console.log(`Prepared GitHub Pages assets for ${basePath}`);
