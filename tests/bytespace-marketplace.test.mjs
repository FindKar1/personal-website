import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "public/showcases/bytespace-marketplace");
const read = file => readFile(path.join(root, file), "utf8");
const provenance = JSON.parse(await readFile(path.join(output, "provenance.json"), "utf8"));

test("all six marketplace features preserve original source components", () => {
  for (const component of ["AgentCardBase", "VideoBackground", "PixelBlast", "CardDetails", "WorkflowPreview", "AgentRunSettings", "animated-beam", "QuickWinAgentCards", "ElectricBorder"]) {
    assert.ok(provenance.sourceFiles.some(file => file.endsWith(`/${component}.tsx`)), component);
  }
  assert.ok(provenance.assets.some(asset => asset.path.endsWith("allAgentsMarketplace.webm")));
});

test("marketplace bundle is local and disconnected from real accounts", async () => {
  const html = await readFile(path.join(output, "index.html"), "utf8");
  assert.match(html, /connect-src 'none'/);
  assert.match(html, /form-action 'none'/);
  assert.match(html, /media-src 'self'/);
  const bundles = [path.join(output, "entry.js"), ...(await readdir(path.join(output, "chunks"))).filter(file => file.endsWith(".js")).map(file => path.join(output, "chunks", file))];
  for (const file of bundles) {
    const source = await readFile(file, "utf8");
    assert.ok(!/\/api\/marketplace|\/api\/deployments|supabaseBrowser|x-vercel-protection-bypass/.test(source), `${path.basename(file)} contains a connected service reference`);
    for (const match of source.matchAll(/from["'](\.\/[^"']+)["']/g)) assert.ok((await stat(path.resolve(path.dirname(file), match[1]))).size > 0);
  }
});

test("original films, local logos and posters are available", async () => {
  for (const file of ["landing/marketplace/allAgentsMarketplace.webm", "landing/demo/quickwindemo.webm", "ensemble-poster.webp", "quickwin-poster.webp", "apps/linkedin.png", "apps/notion.png"]) {
    assert.ok((await stat(path.join(output, "assets", file))).size > 0, file);
  }
  for (const asset of provenance.assets) assert.match(asset.sha256, /^[a-f0-9]{64}$/);
});

test("builder entry uses original artwork and component without changing quick-win animation", async () => {
  assert.ok(provenance.sourceFiles.some(file => file.endsWith("/ActionCardsGrid.tsx")));
  for (const file of ["landing/marketplace/builderVideo.webm", "landing/marketplace/buildYourOwn.png", "landing/demo/quickwindemo.webm"]) {
    const original = provenance.assets.find(asset => asset.path === `/${file}`);
    assert.ok(original, file);
    assert.equal(createHash("sha256").update(await readFile(path.join(output, "assets", file))).digest("hex"), original.sha256, `${file} stays byte-identical`);
  }
  const builder = await read("scripts/build-bytespace-marketplace.mjs");
  const entry = await read("scripts/bytespace-marketplace/entry.jsx");
  const host = await read("components/BytespaceMarketplace.tsx");
  assert.match(builder, /Turn any company website into a meeting-ready brief\./);
  assert.match(builder, /useArchivePreview\(videoRef, \{ continuous: true \}\)/);
  assert.doesNotMatch(builder, /A website review, a roast, and a meme\./);
  assert.match(entry, /builderLoaded && <Suspense/);
  assert.match(builder, /useArchivePreview\(builderVideoRef, \{ resetOnLeave: true \}\)/);
  assert.match(host, /event.data.id === undefined \|\| event.data.id === "builder"/);
});

test("host validates frame messages, preserves focus, and honors motion preferences", async () => {
  const host = await read("components/BytespaceMarketplace.tsx");
  const entry = await read("scripts/bytespace-marketplace/entry.jsx");
  assert.match(host, /event.origin !== location.origin/);
  assert.match(host, /event.source === frame.current\?\.contentWindow/);
  assert.match(host, /agentIds.has\(event.data.id\)/);
  assert.match(host, /Number.isFinite\(event.data.height\)/);
  assert.match(host, /userPaused \?\? reducedMotion/);
  assert.match(host, /!paused && !document.hidden/);
  assert.match(host, /modal.showModal\(\)/);
  assert.match(host, /document.body.style.overflow = overflow/);
  assert.match(host, /fromDetails && event.data\?\.type === "bytespace-marketplace:close"/);
  assert.match(entry, /event.source !== window.parent/);
  assert.match(entry, /focus\(\{ preventScroll: true \}\)/);
  assert.match(entry, /event.key === "Escape" && !document.fullscreenElement/);
  assert.match(entry, /running && heroVisible/);
  assert.match(entry, /useArchivePreview\(video, \{ resetOnLeave: true \}\)/);
  const preview = await read("scripts/bytespace-marketplace/preview.jsx");
  assert.match(preview, /controller.current\?\.setEnabled\(running\)/);
  assert.match(preview, /IntersectionObserver/);
  assert.match(preview, /event.pointerType === "mouse"/);
  assert.match(preview, /:focus-visible:not\(input\):not\(textarea\)/);
  assert.match(preview, /data-replay disabled=\{!running\}/);
});

test("marketplace is placed with extension interfaces and retains a compact mobile rail", async () => {
  const page = await read("components/ProductDesign.tsx");
  assert.ok(page.indexOf("<BytespaceMarketplace />") > page.indexOf("Inside the extension"));
  assert.ok(page.indexOf("<BytespaceMarketplace />") < page.indexOf("<BytespaceNodeCatalog />"));
  const css = await read("scripts/bytespace-marketplace/frame.css");
  assert.match(css, /grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(css, /\.agent-rail \{ display: flex; overflow-x: auto/);
  const builder = await read("scripts/build-bytespace-marketplace.mjs");
  assert.match(builder, /zoomOnScroll=\{false\}/);
  assert.match(builder, /preventScrolling=\{false\}/);
  assert.match(builder, /clearTimeout\(beam\); clearTimeout\(next\)/);
});
