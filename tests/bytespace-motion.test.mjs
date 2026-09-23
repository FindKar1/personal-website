import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { bytespaceVideoRows } from "../lib/bytespace-video-rows.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = filename => readFile(path.join(root, filename), "utf8");
const assets = "public/showcases/bytespace-motion";

test("the original marquee alternates all 20 agents with all nine builder demos", () => {
  assert.deepEqual(bytespaceVideoRows.map(row => row.length), [14, 14, 12]);
  const agents = bytespaceVideoRows.flat().filter(video => video.type === "agent");
  assert.deepEqual(agents.map(video => path.basename(video.basePath)), Array.from({ length: 20 }, (_, i) => `agent-${i + 1}`));
  assert.deepEqual(bytespaceVideoRows.map(row => row.filter(video => video.type === "demo").map(video => path.basename(video.basePath))), [
    ["demo1", "demo2", "demo3", "demo4", "demo5", "demo6", "demo7"],
    ["demo5", "demo6", "demo7", "demo8", "demo9", "demo1", "demo2"],
    ["demo7", "demo8", "demo9", "demo1", "demo2", "demo3"],
  ]);
  for (const row of bytespaceVideoRows) row.forEach((video, i) => assert.equal(video.type, i % 2 ? "demo" : "agent"));
});

test("every clip and poster is a byte-identical copy of the original Cmd0 asset", async () => {
  const manifest = JSON.parse(await read(`${assets}/provenance.json`));
  assert.match(manifest.revision, /^[a-f0-9]{40}$/);
  assert.equal(manifest.assets.length, 78);
  assert.ok(manifest.sourceFiles.some(source => source.path.endsWith("VirtualBrowsersSection.tsx")));
  for (const asset of manifest.assets) {
    const bytes = await readFile(path.join(root, assets, asset.path));
    assert.equal(createHash("sha256").update(bytes).digest("hex"), asset.sha256, asset.path);
  }
  for (const video of bytespaceVideoRows.flat()) {
    for (const ext of video.type === "agent" ? ["webm", "webp", "mp4"] : ["webm", "webp"]) {
      const relative = `${video.basePath.split("/bytespace-motion/")[1]}.${ext}`;
      assert.ok(manifest.assets.some(asset => asset.path === relative), relative);
    }
  }
});

test("video wall follows In motion without replacing the hero or extension studies", async () => {
  const source = await read("components/ProductDesign.tsx");
  const demos = source.indexOf("{children}", source.indexOf("<BytespaceHero />"));
  const wall = source.indexOf("<BytespaceVideoWall />");
  const extension = source.indexOf("Inside the extension");
  assert.ok(source.indexOf("<BytespaceHero />") < demos && demos < wall && wall < extension);
  assert.ok(source.includes("<BytespaceStudies />"));
});

test("the original responsive tile sizes and speed have an exact loop boundary", async () => {
  const css = await read("components/BytespaceVideoWall.module.css");
  assert.match(css, /animation: marquee 60s linear infinite/);
  assert.match(css, /animation-direction: reverse/);
  assert.match(css, /translateX\(-50%\)/);
  assert.match(css, /padding-right: var\(--tile-gap\)/);
  for (const width of [272, 304, 336]) assert.ok(css.includes(`width: ${width}px`));
  assert.match(css, /animation-play-state: paused/);
});

test("playback is lazy, viewport-gated, muted, pausable, and respects motion preferences", async () => {
  const source = await read("components/BytespaceVideoWall.tsx");
  assert.match(source, /prefers-reduced-motion: reduce/);
  assert.match(source, /userPaused \?\? reducedMotion/);
  assert.match(source, /inView && !paused && !document.hidden/);
  assert.match(source, /!visibleVideos.has\(video\)/);
  assert.match(source, /video.load\(\)/);
  assert.match(source, /loop muted playsInline preload="none"/);
  assert.match(source, /"Play video wall" : "Pause video wall"/);
  assert.match(source, /videoObserver.disconnect\(\)/);
  assert.match(source, /removeEventListener\("visibilitychange"/);
  assert.ok(!source.includes("?v="), "Duplicated tiles must share cacheable sources");
});
