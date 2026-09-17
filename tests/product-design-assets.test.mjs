import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const assets = JSON.parse(await readFile(path.join(root, "app/product-design-assets.json"), "utf8"));

test("every product artwork has valid local preview and full-size dimensions", async () => {
  for (const [id, versions] of Object.entries(assets)) {
    for (const variant of ["preview", "full"]) {
      const image = versions[variant];
      assert.ok(image.src.startsWith("/media/product/"), id);
      const metadata = await sharp(path.join(root, "public", image.src)).metadata();
      assert.equal(metadata.width, image.width, `${id} ${variant} width`);
      assert.equal(metadata.height, image.height, `${id} ${variant} height`);
      assert.equal(metadata.format, "webp");
      assert.ok(image.width <= (variant === "preview" ? 1440 : 2800));
    }
  }
});

test("freestanding artwork keeps its transparency", async () => {
  for (const id of ["bot-octopus", "labs-statue", "agent-world", "agent-world-light", "worlds", "world-landscape", "portal-space", "portal-energy", "portal-garden", "portal-gateway", "desktop-shell", "agent-cursor", "characters", "icon-ai", "icon-control", "character-samurai", "brand-instrument"]) {
    const input = sharp(path.join(root, "public", assets[id].preview.src));
    assert.equal((await input.metadata()).hasAlpha, true, `${id} has an alpha channel`);
    assert.equal((await input.stats()).isOpaque, false, `${id} has no flattened backdrop`);
  }
});

test("the original bot0 bundle is self-contained and network-disabled", async () => {
  const folder = path.join(root, "public/showcases/bot0");
  const html = await readFile(path.join(folder, "index.html"), "utf8");
  assert.match(html, /connect-src 'none'/);
  assert.match(html, /form-action 'none'/);
  assert.match(html, /data-theme="light"/);
  for (const file of ["demo.js", "demo.css", "protein-fold.webp", "bot0-logo.png", "bytespace-labs-mark.svg", "bytespace-team-profile.webp"]) {
    assert.ok((await stat(path.join(folder, file))).size > 0, file);
  }
  const provenance = JSON.parse(await readFile(path.join(folder, "provenance.json"), "utf8"));
  assert.equal(provenance.repository, "https://github.com/FindKar1/portfolio-sites");
  assert.match(provenance.revision, /^[a-f0-9]{40}$/);
  assert.ok(provenance.sourceFiles.includes("packages/desktop/src/components/Terminal/MyModelsPanel.tsx"));
});
