import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repository = process.argv[2];
if (!repository) throw new Error("Usage: node scripts/import-bytespace-motion.mjs /path/to/portfolio-sites");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.resolve(repository, "apps/cmd0");
const output = path.join(root, "public/showcases/bytespace-motion");
const sha256 = bytes => createHash("sha256").update(bytes).digest("hex");
const sourceFiles = [];
for (const filename of ["src/components/landing-page/VirtualBrowsersSection.tsx", "src/app/globals.css"]) {
  sourceFiles.push({ path: `apps/cmd0/${filename}`, sha256: sha256(await readFile(path.join(source, filename))) });
}
const assets = [];
for (const [folder, prefix, count, extensions] of [
  ["agent_videos", "agent-", 20, ["webm", "webp", "mp4"]],
  ["browser_demos", "demo", 9, ["webm", "webp"]],
]) {
  await mkdir(path.join(output, folder), { recursive: true });
  for (let index = 1; index <= count; index++) {
    for (const extension of extensions) {
      const filename = `${folder}/${prefix}${index}.${extension}`;
      const original = path.join(source, "public/landing", filename);
      await copyFile(original, path.join(output, filename));
      assets.push({ path: filename, sha256: sha256(await readFile(original)) });
    }
  }
}
await writeFile(path.join(output, "provenance.json"), JSON.stringify({
  repository: "https://github.com/FindKar1/portfolio-sites",
  revision: execFileSync("git", ["rev-parse", "HEAD"], { cwd: repository, encoding: "utf8" }).trim(),
  sourceFiles,
  assets,
}, null, 2) + "\n");
console.log(`Copied ${assets.length} original video/poster assets without re-encoding.`);
