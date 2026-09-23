import { createRequire } from "node:module";
import { readFile, writeFile, mkdir, copyFile, readdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

if (!process.argv[2]) throw new Error("Pass the portfolio-sites checkout.");
const archive = path.resolve(process.argv[2]);
const app = path.join(archive, "apps/cmd0");
const sourceRoot = path.join(app, "src");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const support = path.join(root, "scripts/bytespace-hero");
const output = path.join(root, "public/showcases/bytespace-hero");
const require = createRequire(path.join(app, "package.json"));
const botRequire = createRequire(path.join(archive, "apps/bot0/package.json"));
const { build } = createRequire(botRequire.resolve("tsx/package.json"))("esbuild");
const ts = require("typescript");
const postcss = require("postcss");
const tailwind = require("tailwindcss");
const inputs = new Map();
const styles = [];
const assetPrefix = "/showcases/bytespace-hero/assets";
const hash = data => createHash("sha256").update(data).digest("hex");
const parse = (source, filename) => ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

// Extract the builder's actual JSX, including its glass, fades and viewport settings.
// Do not import the marketing page's signup, statistics, WebGL or service dependencies.
const titleFile = path.join(sourceRoot, "components/landing-page/TitleSectionNew.tsx");
const titleSource = await readFile(titleFile, "utf8");
const titleAst = parse(titleSource, titleFile);
let builder;
const findBuilder = node => {
  if (ts.isJsxElement(node) && node.openingElement.tagName.getText(titleAst) === "GlassPanelFrost") builder = node.parent.getText(titleAst);
  ts.forEachChild(node, findBuilder);
};
findBuilder(titleAst);
if (!builder?.includes("WorkflowPreview")) throw new Error("Original hero builder not found.");
const builderModule = `
import React, { useRef } from 'react';
import GlassPanelFrost from '@/components/landing-page/GlassPanelFrost';
import WorkflowPreview from '@/components/marketplace/workflow-preview/WorkflowPreview';
import { landingWorkflowData } from '@/components/marketplace/workflow-preview/landingWorkflowData';
import { LANDING_RADIUS_SECTION } from '@/components/landing-page/landingLayout';
import { cn } from '@/lib/utils';
export default function OriginalBuilder({showWorkflow}) {
  const workflowContainerRef = useRef(null);
  const workflowViewport = {zoom: 0.45 * 0.85, offsetX: -340, offsetY: -20};
  return (${builder});
}`;

function adapt(source, filename) {
  const ast = parse(source, filename);
  const transformed = ts.transform(ast, [context => {
    const visit = node => {
      if (filename.endsWith("mountainAssets.ts") && ts.isArrayLiteralExpression(node)) {
        return ts.factory.updateArrayLiteralExpression(node, node.elements.filter(item => !ts.isStringLiteral(item) || !item.text.endsWith("phase-3-z-5.png")).map(item => ts.visitNode(item, visit)));
      }
      // Prefix only asset literals; preserve the original dimensions and animation code.
      if ((ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) || ts.isTemplateHead(node)) && /^\/(landing|agent_profiles)\//.test(node.text)) {
        const value = assetPrefix + (filename.endsWith("mountainAssets.ts") ? node.text.replace(/\.png$/, ".webp") : node.text);
        if (ts.isTemplateHead(node)) return ts.factory.createTemplateHead(value);
        return ts.isStringLiteral(node) ? ts.factory.createStringLiteral(value) : ts.factory.createNoSubstitutionTemplateLiteral(value);
      }
      // The preview's debug logging is not part of its animation.
      if (ts.isExpressionStatement(node) && ts.isCallExpression(node.expression) && node.expression.expression.getText(ast) === "console.log") return undefined;
      return ts.visitEachChild(node, visit, context);
    };
    return node => ts.visitNode(node, visit);
  }]);
  let result = ts.createPrinter().printFile(transformed.transformed[0]);
  transformed.dispose();
  // Cancel the original delayed viewport setter when the scene is replayed/unmounted.
  if (filename.endsWith("WorkflowPreview.tsx")) result = result
    .replace("setTimeout(() => {\n                setViewport", "const timer = setTimeout(() => {\n                setViewport")
    .replace("}, 100);", "}, 100);\n            return () => clearTimeout(timer);");
  return result;
}

await mkdir(output, { recursive: true });
const entry = await readFile(path.join(support, "entry.jsx"), "utf8");
await build({
  stdin: { contents: entry, loader: "jsx", resolveDir: support },
  outfile: path.join(output, "hero.js"), bundle: true, minify: true,
  platform: "browser", format: "iife", jsx: "automatic", target: ["es2020"],
  define: { "process.env.NODE_ENV": '"production"' },
  plugins: [{ name: "original-cmd0-hero", setup(build) {
    build.onResolve({ filter: /.*/ }, ({ path: name, importer }) => {
      if (["original-builder", "next-themes", "next/image"].includes(name)) return { path: name, namespace: "adapter" };
      if (name.startsWith("@/")) return { path: path.resolve(sourceRoot, name.slice(2)), namespace: "original" };
      if (importer.includes("node_modules") && !/^react(?:-dom)?(?:\/|$)/.test(name)) return;
      if (!name.startsWith(".") && !path.isAbsolute(name)) return { path: require.resolve(name) };
    });
    build.onLoad({ filter: /.*/, namespace: "adapter" }, ({ path: name }) => ({
      contents: name === "original-builder" ? builderModule : name === "next-themes"
        ? `export const useTheme = () => ({theme:'light',systemTheme:'light',resolvedTheme:'light'});`
        : `import React from 'react'; export default function Image({src,alt,fill,priority,unoptimized,quality,...props}) {return <img {...props} src={src} alt={alt}/>;}`,
      loader: "tsx", resolveDir: support,
    }));
    build.onLoad({ filter: /.*/, namespace: "original" }, async ({ path: base }) => {
      for (const suffix of ["", ".tsx", ".ts", "/index.tsx", "/index.ts"]) {
        const filename = base + suffix;
        try {
          const original = await readFile(filename, "utf8");
          inputs.set(filename, original);
          return { contents: filename.endsWith(".json") ? original : adapt(original, filename), loader: filename.endsWith(".json") ? "json" : "tsx", resolveDir: path.dirname(filename) };
        } catch (error) { if (!["ENOENT", "EISDIR"].includes(error.code)) throw error; }
      }
      throw new Error(`Missing original source: ${base}`);
    });
    build.onLoad({ filter: /\.[jt]sx?$/ }, async ({ path: filename }) => {
      if (!filename.startsWith(sourceRoot)) return;
      const original = await readFile(filename, "utf8");
      inputs.set(filename, original);
      return { contents: adapt(original, filename), loader: "tsx", resolveDir: path.dirname(filename) };
    });
    build.onLoad({ filter: /\.css$/ }, async ({ path: filename }) => {
      styles.push(await readFile(filename, "utf8")); return { contents: "", loader: "js" };
    });
  } }],
});

const config = require(path.join(app, "tailwind.config.js"));
const css = await postcss([tailwind({ ...config, safelist: [], content: [...inputs.values(), builderModule, entry].map(raw => ({ raw, extension: "tsx" })) })])
  .process(styles.join("\n") + "\n" + await readFile(path.join(support, "frame.css"), "utf8"), { from: undefined });
await writeFile(path.join(output, "hero.css"), css.css);
await copyFile(path.join(support, "index.html"), path.join(output, "index.html"));

const assets = new Set(["/fonts/GeneralSans-Variable.woff2"]);
async function collect(directory) {
  for (const item of await readdir(path.join(app, "public", directory), { withFileTypes: true })) {
    const asset = `${directory}/${item.name}`;
    if (item.isDirectory()) { if (item.name !== "dark") await collect(asset); }
    else if (/\.webp$/.test(item.name)) assets.add(asset);
  }
}
await collect("/landing/first_view");
for (const source of inputs.values()) {
  for (const match of source.matchAll(/["'](\/(?:landing|agent_profiles)\/[^"']+\.(?:png|webp|svg|jpg))["']/g)) {
    if (!match[1].startsWith("/landing/first_view/")) assets.add(match[1]);
  }
}
const copied = [];
for (const asset of [...assets].sort()) {
  const from = path.join(app, "public", asset);
  const to = path.join(output, "assets", asset);
  await mkdir(path.dirname(to), { recursive: true });
  await copyFile(from, to);
  copied.push({ path: asset, sha256: hash(await readFile(from)) });
}
inputs.set(titleFile, titleSource);
await writeFile(path.join(output, "provenance.json"), JSON.stringify({
  repository: "https://github.com/FindKar1/portfolio-sites",
  revision: execFileSync("git", ["rev-parse", "HEAD"], { cwd: archive, encoding: "utf8" }).trim(),
  sourceFiles: [...inputs].map(([filename, source]) => ({ path: path.relative(archive, filename), sha256: hash(source) })),
  assets: copied,
  adaptations: ["Original MountainScene, position JSON, Framer Motion timing and artwork", "Original builder JSX extracted from TitleSectionNew with original React Flow nodes and animated edges", "Light theme forced; no account services, marketing copy, signup actions or surrounding homepage sections", "Original desktop composition scaled as a unit in an isolated iframe", "Visibility-triggered entrance, replay, offscreen pause and reduced-motion support", "Local asset URL prefix, no image resizing or recompression", "Preload the two rendered WebP squad layers instead of legacy PNGs and nonexistent third phase", "Workflow debug logs removed and delayed viewport setter cleaned up"],
}, null, 2) + "\n");
console.log(`Built Cmd0 hero: ${inputs.size} original sources, ${copied.length} unchanged assets.`);
