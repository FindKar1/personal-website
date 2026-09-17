import { createRequire } from "node:module";
import { readFile, writeFile, mkdir, copyFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import postcss from "postcss";
import tailwind from "@tailwindcss/postcss";

const sourceRepo = process.argv[2];
if (!sourceRepo) throw new Error("Pass a local checkout of FindKar1/portfolio-sites with its dependencies installed.");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceApp = path.join(sourceRepo, "apps/bot0");
const sourceRequire = createRequire(path.join(sourceApp, "package.json"));
const toolRequire = createRequire(sourceRequire.resolve("tsx/package.json"));
const { build } = toolRequire("esbuild");
const output = path.join(root, "public/showcases/bot0");
await mkdir(output, { recursive: true });
const entry = path.join(sourceApp, "src/components/bytespace-clone/Bot0TerminalSection.tsx");
const core = await readFile(path.join(sourceRepo, "packages/core/src/index.ts"), "utf8");
const version = core.match(/export const VERSION = '([^']+)'/)[1];
const assets = ["protein-fold.webp", "bot0-logo.png", "bytespace-labs-mark.svg", "bytespace-team-profile.webp", "bot0-terminal-mobile.png"];
for (const filename of assets) await copyFile(path.join(sourceApp, "public", filename), path.join(output, filename));

// Bundle the original landing-page component, isolated from the portfolio and all service APIs.
const result = await build({
  stdin: { contents: await readFile(path.join(root, "scripts/bot0-showcase/entry.jsx"), "utf8"), resolveDir: sourceApp, loader: "jsx" },
  outfile: path.join(output, "demo.js"), bundle: true, minify: true, metafile: true,
  platform: "browser", format: "iife", jsx: "automatic", target: ["es2020"],
  define: { "process.env.NODE_ENV": '"production"' },
  alias: { react: sourceRequire.resolve("react"), "react-dom/client": sourceRequire.resolve("react-dom/client"), "react-dom": sourceRequire.resolve("react-dom"), "react/jsx-runtime": sourceRequire.resolve("react/jsx-runtime") },
  plugins: [{ name: "portfolio-demo-adapters", setup(build) {
    build.onResolve({ filter: /^bot0-showcase-source$/ }, () => ({ path: entry }));
    build.onResolve({ filter: /^next\/image$/ }, () => ({ path: "image", namespace: "demo" }));
    build.onResolve({ filter: /^@bot0\/core$/ }, () => ({ path: "core", namespace: "demo" }));
    build.onLoad({ filter: /.*/, namespace: "demo" }, ({ path: name }) => ({
      contents: name === "core"
        ? `export * from ${JSON.stringify(path.join(sourceRepo, "packages/core/src/models.ts"))}; export const VERSION = ${JSON.stringify(version)};`
        : `import {jsx} from 'react/jsx-runtime'; export default function Image({src,alt,fill,priority,unoptimized,quality,sizes,...props}) { return jsx('img', {...props,src:typeof src==='string'?src:src.src,alt}); }`,
      loader: "jsx", resolveDir: sourceApp,
    }));
    build.onLoad({ filter: /Bot0TerminalSection\.tsx$/ }, async ({ path: filename }) => ({
      contents: (await readFile(filename, "utf8"))
        .replace("function Bot0TerminalShell(", "export function Bot0TerminalShell(")
        .replace("<style jsx global>{`", "<style>{String.raw`")
        .replaceAll('"/protein-fold.webp"', '"/showcases/bot0/protein-fold.webp"')
        .replaceAll('"/bot0-logo.png"', '"/showcases/bot0/bot0-logo.png"')
        .replaceAll('"/bytespace-labs-mark.svg"', '"/showcases/bot0/bytespace-labs-mark.svg"')
        .replaceAll('"/bytespace-team-profile.webp"', '"/showcases/bot0/bytespace-team-profile.webp"'),
      loader: "tsx", resolveDir: path.dirname(filename),
    }));
  } }],
});

const cssInput = `@import "tailwindcss";\n@source ${JSON.stringify(path.join(sourceRepo, "packages/desktop/src/components/Terminal"))};\n@source ${JSON.stringify(entry)};\n${await readFile(path.join(root, "scripts/bot0-showcase/frame.css"), "utf8")}`;
const css = await postcss([tailwind({ base: root, optimize: true })]).process(cssInput, { from: path.join(root, "showcase.css") });
await writeFile(path.join(output, "demo.css"), css.css);
await copyFile(path.join(root, "scripts/bot0-showcase/index.html"), path.join(output, "index.html"));
await writeFile(path.join(output, "provenance.json"), JSON.stringify({
  repository: "https://github.com/FindKar1/portfolio-sites",
  revision: execFileSync("git", ["rev-parse", "HEAD"], { cwd: sourceRepo, encoding: "utf8" }).trim(),
  entry: path.relative(sourceRepo, entry),
  sourceFiles: Object.keys(result.metafile.inputs).filter(p => p.includes("packages/desktop") || p.includes("packages/core") || p.includes("Bot0TerminalSection")).map(p => path.relative(sourceRepo, path.resolve(p))),
  adaptations: ["Export original shell", "Local image adapter", "Browser-only model exports", "Local asset paths", "In-memory demo config and unavailable live catalog", "Responsive frame with session/notebook tabs", "Network disabled by CSP"],
}, null, 2) + "\n");
console.log(`Built original bot0 showcase (${Object.keys(result.metafile.inputs).length} modules).`);
