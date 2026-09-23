import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const bundle = path.join(root, "public/showcases/bytespace-hero");
const provenance = JSON.parse(await readFile(path.join(bundle, "provenance.json"), "utf8"));
const read = name => readFile(path.join(root, name), "utf8");

test("hero preserves the original Cmd0 source modules and byte-identical artwork", async () => {
  assert.equal(provenance.repository, "https://github.com/FindKar1/portfolio-sites");
  assert.match(provenance.revision, /^[a-f0-9]{40}$/);
  for (const filename of ["MountainScene.tsx", "TitleSectionNew.tsx", "WorkflowPreview.tsx", "WorkflowNode.tsx", "landingWorkflowData.ts", "mountain/position.json", "nodes/positions.json"]) {
    assert.ok(provenance.sourceFiles.some(source => source.path.endsWith(filename)), filename);
  }
  for (const asset of provenance.assets) {
    const bytes = await readFile(path.join(bundle, "assets", asset.path));
    assert.equal(createHash("sha256").update(bytes).digest("hex"), asset.sha256, asset.path);
  }
  for (let layer = 1; layer <= 3; layer++) assert.ok(provenance.assets.some(asset => asset.path.endsWith(`/light/mount-${layer}.webp`)));
  assert.ok(provenance.assets.some(asset => asset.path.endsWith("phase-1-z-10.webp")));
  assert.ok(provenance.assets.some(asset => asset.path.endsWith("phase-2-z-1.webp")));
});

test("the isolated light-mode bundle has no connected services", async () => {
  const html = await readFile(path.join(bundle, "index.html"), "utf8");
  assert.match(html, /data-theme="light"/);
  assert.match(html, /connect-src 'none'/);
  assert.match(html, /form-action 'none'/);
  for (const filename of ["hero.js", "hero.css"]) assert.ok((await stat(path.join(bundle, filename))).size > 0);
  assert.ok(!provenance.sourceFiles.some(source => /supabase|auth\/|api\//.test(source.path)));
});

test("the hero appears before the desktop video without replacing existing studies", async () => {
  const source = await read("components/ProductDesign.tsx");
  const heading = source.indexOf('title={<>Bytespace<br />Chrome Extension</>}');
  const hero = source.indexOf("<BytespaceHero />");
  const video = source.indexOf("<video ref={productVideo}");
  assert.ok(heading < hero && hero < video && video < source.indexOf("<BytespaceStudies />"));
});

test("entrance starts in view and replay messages are validated in both directions", async () => {
  const host = await read("components/BytespaceHero.tsx");
  const entry = await read("scripts/bytespace-hero/entry.jsx");
  assert.match(host, /new IntersectionObserver/);
  assert.match(host, /entry.intersectionRatio >= 0.15/);
  assert.match(host, /loaded && <iframe/);
  assert.match(host, /event.origin !== window.location.origin \|\| event.source !== frame.current\?\.contentWindow/);
  assert.match(entry, /event.origin !== window.location.origin \|\| event.source !== window.parent/);
  assert.match(host, /aria-label="Replay homepage animation"/);
  assert.match(entry, /setReplay\(value => value \+ 1\)/);
  assert.match(entry, /1600/);
  assert.match(entry, /clearTimeout\(timer\)/);
  assert.match(host, /document.hidden/);
  assert.match(host, /resize.disconnect\(\)/);
  assert.match(host, /intersection.disconnect\(\)/);
});

test("scaling keeps a stable aspect ratio and motion preferences stop the builder", async () => {
  const host = await read("components/BytespaceHero.tsx");
  const css = await read("components/ProductDesign.module.css");
  const frame = await read("scripts/bytespace-hero/frame.css");
  assert.match(host, /SCENE_WIDTH = 1280/);
  assert.match(host, /SCENE_HEIGHT = 882/);
  assert.match(css, /aspect-ratio: 1280 \/ 882/);
  assert.match(css, /\.bytespaceHero \{[^}]*z-index: 1/);
  assert.match(css, /transform-origin: top left/);
  assert.match(frame, /prefers-reduced-motion: reduce/);
  assert.match(frame, /\.react-flow__edge path \{ animation: none !important/);
  assert.match(frame, /data-paused="true"/);
});
