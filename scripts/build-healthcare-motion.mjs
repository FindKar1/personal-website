import { createRequire } from "node:module";
import { readFile, writeFile, mkdir, copyFile, readdir, unlink } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

if (!process.argv[2]) throw new Error("Pass the portfolio-sites checkout.");
const archive = path.resolve(process.argv[2]);
const app = path.join(archive, "apps/bytespace");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const support = path.join(root, "scripts/healthcare-motion");
const output = path.join(root, "public/showcases/healthcare-motion");
const require = createRequire(path.join(app, "package.json"));
const botRequire = createRequire(path.join(archive, "apps/bot0/package.json"));
const { build } = createRequire(botRequire.resolve("tsx/package.json"))("esbuild");
const ts = require("typescript");
const hash = data => createHash("sha256").update(data).digest("hex");
const files = {
  "original-pixels": "src/components/ui/pixelated-canvas.tsx",
  "original-morph": "src/components/landing-v2/HeroChipScene.tsx",
};
const sources = [];
const wrapper = await readFile(path.join(support, "scene-wrapper.tsx.txt"), "utf8");

await mkdir(path.join(output, "assets"), { recursive: true });
const result = await build({
  entryPoints: [path.join(support, "entry.jsx")], outdir: output,
  bundle: true, minify: true, splitting: true, format: "esm", platform: "browser", metafile: true,
  jsx: "automatic", target: ["es2020"], mainFields: ["browser", "module", "main"],
  nodePaths: [path.join(app, "node_modules")],
  define: { "process.env.NODE_ENV": '"production"' },
  plugins: [{ name: "original-healthcare-animations", setup(build) {
    build.onResolve({ filter: /^react(?:-dom)?(?:\/|$)/ }, ({ path: name }) => ({ path: require.resolve(name) }));
    build.onResolve({ filter: /^original-(pixels|morph)$/ }, ({ path: name }) => ({ path: name, namespace: "original" }));
    // The original production scene disables these development-only orbit controls.
    build.onResolve({ filter: /^@react-three\/drei$/ }, () => ({ path: "orbit", namespace: "adapter" }));
    build.onLoad({ filter: /.*/, namespace: "adapter" }, () => ({ contents: "export const OrbitControls = () => null;", loader: "js" }));
    build.onLoad({ filter: /.*/, namespace: "original" }, async ({ path: name }) => {
      const filename = path.join(app, files[name]);
      const original = await readFile(filename, "utf8");
      sources.push({ path: path.relative(archive, filename), sha256: hash(original) });
      let contents = original;
      if (name === "original-pixels") {
        // Preserve the hero's sampling density while mapping input into its scaled canvas.
        for (const [before, after] of [
          ["e.clientX - rect.left", "(e.clientX - rect.left) * (width / rect.width)"],
          ["e.clientY - rect.top", "(e.clientY - rect.top) * (height / rect.height)"],
        ]) {
          if (!contents.includes(before)) throw new Error(`Original pixel pointer mapping not found: ${before}`);
          contents = contents.replace(before, after);
        }
      }
      if (name === "original-morph") {
        const ast = ts.createSourceFile(filename, original, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
        const scene = ast.statements.find(node => ts.isFunctionDeclaration(node) && node.name?.text === "GpuChipScene");
        if (!scene) throw new Error("Original GpuChipScene wrapper not found.");
        // Keep the original DNA geometry and particle animation, with a fixed camera and DNA-only wrapper.
        contents = original.slice(0, scene.getStart(ast)) + wrapper + original.slice(scene.end);
        for (const [before, after] of [
          ["targetGroupPosition.set(shapeIsChip ? 0.15 : 0.32, shapeIsChip ? -1.05 : -0.02, 0);", "targetGroupPosition.set(0, 0, 0);"],
          ["<group ref={groupRef}>", "<group ref={groupRef} rotation={[0.16, -0.2, -0.16]} scale={1.22}>"],
          ["<group ref={chipLayerRef}>", "<group ref={chipLayerRef} visible={false}>"],
        ]) {
          if (!contents.includes(before)) throw new Error(`Original DNA framing anchor not found: ${before}`);
          contents = contents.replace(before, after);
        }
      }
      return { contents, loader: "tsx", resolveDir: app };
    });
  } }],
});
const generated = new Set(Object.keys(result.metafile.outputs).map(file => path.resolve(file)));
for (const file of await readdir(output)) {
  if (file.endsWith(".js") && !generated.has(path.join(output, file))) await unlink(path.join(output, file));
}
for (const file of ["index.html", "frame.css"]) await copyFile(path.join(support, file), path.join(output, file));
const asset = "landing/hero-pixel-background.webp";
const assetData = await readFile(path.join(app, "public", asset));
await copyFile(path.join(app, "public", asset), path.join(output, "assets", path.basename(asset)));
const hero = "src/components/landing-v2/Hero.tsx";
sources.push({ path: path.join("apps/bytespace", hero), sha256: hash(await readFile(path.join(app, hero))) });
await writeFile(path.join(output, "provenance.json"), JSON.stringify({
  repository: "https://github.com/FindKar1/portfolio-sites",
  revision: execFileSync("git", ["rev-parse", "HEAD"], { cwd: archive, encoding: "utf8" }).trim(),
  sourceFiles: sources.sort((a, b) => a.path.localeCompare(b.path)),
  assets: [{ path: `apps/bytespace/public/${asset}`, output: `assets/${path.basename(asset)}`, sha256: hash(assetData) }],
  adaptations: [
    "Original pixel canvas and Three.js DNA geometry, materials, lights and animated particles; protein and compute transitions disabled",
    "Responsive full-width pixel field with the DNA helix centered over it, without homepage copy, buttons or service integrations",
    "1100px-wide pixel sampling with responsive height and matching pointer coordinates preserves square pixels without stretching; transparent background fits the portfolio",
    "Original hero scroll-freeze replaced with parent visibility and local pointer interaction",
    "Fixed DNA camera and centered initial transform with zoom 0.96 to fill the height with edge clearance",
    "Lazy loading, independent offscreen pause and reduced-motion static rendering",
    "Development-only orbit controls omitted; all scripts and assets served locally",
  ],
}, null, 2) + "\n");
console.log("Built healthcare pixel field and DNA-only animation.");
