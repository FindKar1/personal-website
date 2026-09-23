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

test("new wide scene and premium agents retain transparent backgrounds", async () => {
  for (const id of ["agent-world-wide", "character-fire", "character-armor", "character-fairy", "character-einstein"]) {
    const input = sharp(path.join(root, "public", assets[id].preview.src));
    assert.equal((await input.stats()).isOpaque, false, id);
  }
  assert.ok(assets["agent-world-wide"].preview.width > assets["agent-world-wide"].preview.height * 1.5);
});

test("preserved Bytespace UI uses original sources and only local assets", async () => {
  const folder = path.join(root, "public/showcases/bytespace");
  const html = await readFile(path.join(folder, "index.html"), "utf8");
  assert.match(html, /connect-src 'none'/);
  assert.match(html, /form-action 'none'/);
  const provenance = JSON.parse(await readFile(path.join(folder, "provenance.json"), "utf8"));
  assert.equal(provenance.repository, "https://github.com/elnugget/bytespace");
  assert.match(provenance.revision, /^[a-f0-9]{40}$/);
  for (const component of ["AgentGroupsGrid.tsx", "SignInForm.tsx", "ScheduleCalendar.tsx", "AgentExecutionDemo.tsx", "EventTriggersNetwork.tsx"]) {
    assert.ok(provenance.sourceFiles.some(file => file.endsWith(component)), component);
  }
  assert.ok(!provenance.sourceFiles.some(file => /supabase|login\/actions/.test(file)));
  for (const asset of provenance.assets) assert.ok((await stat(path.join(folder, "assets", asset))).size > 0, asset);
  for (const file of ["demo.js", "demo.css"]) assert.ok((await stat(path.join(folder, file))).size > 0);
});

test("the product sequence keeps the intro-aware desktop, demos, and three portals together", async () => {
  const source = await readFile(path.join(root, "components/ProductDesign.tsx"), "utf8");
  const monitor = await readFile(path.join(root, "components/BytespaceMonitor.tsx"), "utf8");
  assert.match(monitor, /muted loop playsInline controls/);
  assert.match(source, /const portals: ImageId\[\] = \["portal-energy", "portal-garden", "portal-gateway"\]/);
  const component = source.slice(source.indexOf("export function ProductDesign"));
  assert.ok(component.indexOf("{children}") > component.indexOf("<BytespaceMonitor />"));
  assert.ok(component.indexOf("{children}") < component.indexOf('id="bytespace-live-title"'));
  assert.match(source, /Chrome Extension/);
});

test("all six original UI studies render together without a tabbed shell", async () => {
  const host = await readFile(path.join(root, "components/BytespaceStudies.tsx"), "utf8");
  const entry = await readFile(path.join(root, "scripts/bytespace-showcase/entry.jsx"), "utf8");
  const ids = [...host.matchAll(/id: "(\w+)"/g)].map(match => match[1]);
  assert.deepEqual(ids, ["spaces", "signin", "execution", "triggers", "calendar", "context"]);
  for (const id of ids) assert.ok(entry.includes(`view === "${id}"`), id);
  assert.match(host, /otherStudies\.map/);
  assert.match(host, /styles.runtimeStudies/);
  for (const study of ["workspace", "execution", "triggers", "signin"]) assert.ok(host.includes(`<LiveStudy study={${study}} />`));
  assert.match(host, /index\.html\?view=\$\{study.id\}/);
  assert.doesNotMatch(entry, /role="tab|setView\(/);
});

test("live studies remeasure cached content and validate frame messages", async () => {
  const source = await readFile(path.join(root, "components/BytespaceStudies.tsx"), "utf8");
  assert.match(source, /event.origin !== window.location.origin/);
  assert.match(source, /event.source !== frame.current\?\.contentWindow/);
  assert.match(source, /Number.isFinite\(event.data.height\)/);
  assert.match(source, /new ResizeObserver\(measure\)/);
  assert.match(source, /observeContent\(\);/);
  assert.match(source, /onLoad=\{observeContent\}/);
  assert.match(source, /resizeObserver.current\?\.disconnect\(\)/);
});

test("the presentation archive precedes the finale and image details remain available", async () => {
  const source = await readFile(path.join(root, "components/ProductDesign.tsx"), "utf8");
  const archive = source.indexOf('<details id="complete-designs"');
  const archiveEnd = source.indexOf("</details>", archive);
  const finale = source.indexOf('artwork("launch-illustration"');
  assert.ok(archive > 0 && archiveEnd < finale);
  assert.match(source.slice(archive, archiveEnd), /posters.map/);
  assert.doesNotMatch(source.slice(archive, source.indexOf(">", archive)), /\bopen\b/);
  assert.match(source, /id="product-art-detail"[^>]*>\{activeInfo\[1\]\}/);
  assert.match(source, /characters.map\(id => artwork\(id, \{ surface: styles.characterPortrait, caption: false \}\)\)/);
  assert.doesNotMatch(source, /options.detail|detail: true/);
});

test("only product videos opt into compact, accessibly named external links", async () => {
  const portfolio = await readFile(path.join(root, "components/PortfolioVideos.tsx"), "utf8");
  const player = await readFile(path.join(root, "components/YouTubeVideo.tsx"), "utf8");
  const [products, archive] = portfolio.split("export function ArchiveTalks");
  assert.match(products, /productVideos.map[^\n]*compactCaption/);
  assert.doesNotMatch(archive, /compactCaption/);
  assert.doesNotMatch(products, /title: "Bytespace 0[1-4]"/);
  assert.match(player, /compactCaption = false/);
  assert.match(player, /aria-label=\{`Watch \$\{title\} on YouTube \(opens a new tab\)`\}/);
  assert.match(player, /title="Watch on YouTube \(opens a new tab\)"/);
});

test("the closing artwork has no caption and meets only the product page footer", async () => {
  const product = await readFile(path.join(root, "components/ProductDesign.tsx"), "utf8");
  const page = await readFile(path.join(root, "app/page.tsx"), "utf8");
  assert.match(product, /artwork\("launch-illustration", \{[^}]*caption: false, fullResolution: true/);
  assert.match(page, /<footer className=\{`\$\{activeTab === "product" \? "mt-0" : "mt-16"\}/);
});

test("execution replay is in the host heading and accepts only parent-origin messages", async () => {
  const host = await readFile(path.join(root, "components/BytespaceStudies.tsx"), "utf8");
  const entry = await readFile(path.join(root, "scripts/bytespace-showcase/entry.jsx"), "utf8");
  assert.match(host, /aria-label="Replay execution"/);
  assert.match(host, /postMessage\(\{ type: "bytespace:replay" \}, window.location.origin\)/);
  const handler = entry.slice(entry.indexOf("const request = event"), entry.indexOf('window.addEventListener("message", request)'));
  assert.ok(handler.indexOf("event.origin !== window.location.origin || event.source !== window.parent") < handler.indexOf('event.data?.type === "bytespace:replay"'));
  assert.match(handler, /event.data\?\.type === "bytespace:replay" && view === "execution"/);
  assert.match(handler, /setRunning\(true\)/);
  assert.match(handler, /setReplay\(value => value \+ 1\)/);
  assert.doesNotMatch(entry, /execution-toolbar|signin-intro/);
});
