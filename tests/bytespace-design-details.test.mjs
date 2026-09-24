import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalog = JSON.parse(await readFile(path.join(root, "app/bytespace-node-catalog.json"), "utf8"));
const nodes = catalog.groups.flatMap(group => group.nodes);

test("all 41 original builder actions retain their category, icon and description", () => {
  assert.deepEqual(catalog.groups.map(group => [group.name, group.nodes.length]), [["Web", 15], ["AI", 5], ["Navigation", 8], ["Logic", 6], ["Data", 6], ["Custom", 1]]);
  assert.equal(nodes.length, 41);
  assert.equal(new Set(nodes.map(node => node.label)).size, 41);
  for (const node of nodes) {
    assert.ok(node.title && node.description && node.icon, node.label);
    assert.ok(catalog.palette[node.category], node.label);
  }
  assert.equal(nodes.find(node => node.label === "clipboard").icon, "Clipboard");
  assert.equal(nodes.find(node => node.label === "extract-data").icon, "Pickaxe");
  assert.equal(nodes.find(node => node.label === "javascript-code").category, "interaction");
});

test("node artwork uses the builder's light-mode palette, including pale blue data nodes", () => {
  assert.deepEqual(catalog.palette.data, { edge: "#7EC3FF", inset: "#D4E9FF", face: "#F0F9FF", ink: "#0369A1" });
  for (const palette of Object.values(catalog.palette)) {
    assert.ok(parseInt(palette.face.slice(1, 3), 16) >= 240, "Every node face is light");
  }
});

test("original plan animations are preserved as a local, network-disabled bundle", async () => {
  const folder = path.join(root, "public/showcases/bytespace-plan-icons");
  const html = await readFile(path.join(folder, "index.html"), "utf8");
  const provenance = JSON.parse(await readFile(path.join(folder, "provenance.json"), "utf8"));
  assert.match(html, /connect-src 'none'/);
  assert.match(html, /form-action 'none'/);
  assert.match(html, /data-theme="light"/);
  for (const name of ["LaptopShape.tsx", "DiamondShape.tsx", "CrystalTower.tsx", "NodeCarousel.tsx", "WorkflowNode.tsx"]) {
    const file = provenance.sourceFiles.find(file => file.path.endsWith(name));
    assert.ok(file, name);
    assert.match(file.sha256, /^[a-f0-9]{64}$/);
  }
  assert.ok(!provenance.sourceFiles.some(file => /SubscribeCard|PricingPlans|supabase/.test(file.path)));
  assert.ok((await stat(path.join(folder, "icons.js"))).size > 0);
});

test("offscreen, paused and reduced-motion icons use still variants without running animation effects", async () => {
  const host = await readFile(path.join(root, "components/BytespacePlanIcons.tsx"), "utf8");
  const entry = await readFile(path.join(root, "scripts/bytespace-plan-icons/entry.jsx"), "utf8");
  const builder = await readFile(path.join(root, "scripts/build-bytespace-design-details.mjs"), "utf8");
  const css = await readFile(path.join(root, "components/BytespacePlanIcons.module.css"), "utf8");
  assert.match(host, /new IntersectionObserver/);
  assert.match(host, /visible.current && !paused && !document.hidden/);
  assert.match(host, /userPaused \?\? reducedMotion/);
  assert.match(host, /\{loaded && <iframe/);
  assert.match(css, /pointer-events: none/);
  for (const source of [host, entry]) {
    assert.match(source, /event.origin !== window.location.origin/);
    assert.match(source, /event.source !==/);
  }
  assert.match(entry, /running \? \[Laptop, Diamond, Towers\] : \[StillLaptop, StillDiamond, StillTowers\]/);
  assert.match(builder, /node.getText\(ast\).includes\("setInterval"\)\) return undefined/);
  assert.match(builder, /animationProps.has\(node.name.text\)\) return undefined/);
});

test("catalogue sits with the extension UI and the three plan marks sit with the original icon strip", async () => {
  const source = await readFile(path.join(root, "components/ProductDesign.tsx"), "utf8");
  assert.ok(source.indexOf("<BytespaceNodeCatalog />") > source.indexOf("Inside the extension"));
  assert.ok(source.indexOf("<BytespaceNodeCatalog />") < source.indexOf('aria-labelledby="bytespace-live-title"'));
  assert.ok(source.indexOf("<BytespacePlanIcons />") > source.indexOf('aria-label="Bytespace isometric icon system"'));
  assert.ok(source.indexOf("<BytespacePlanIcons />") < source.indexOf("styles.originGrid"));
});

test("builder nodes are a quiet contact sheet without tabs, descriptions or clickable tiles", async () => {
  const source = await readFile(path.join(root, "components/BytespaceNodeCatalog.tsx"), "utf8");
  const css = await readFile(path.join(root, "components/BytespaceNodeCatalog.module.css"), "utf8");
  assert.match(source, />Builder nodes<\/h3>/);
  assert.match(source, /allNodes.map\(node => <li/);
  assert.doesNotMatch(source, /aria-pressed|node.description|setCategory|setSelected|bytespace-node-detail/);
  assert.match(css, /repeat\(10, minmax\(0, 1fr\)\)/);
  assert.match(css, /font-size: 13px/);
});

test("forty showcased nodes fill complete rows at each breakpoint", async () => {
  const source = await readFile(path.join(root, "components/BytespaceNodeCatalog.tsx"), "utf8");
  const css = await readFile(path.join(root, "components/BytespaceNodeCatalog.module.css"), "utf8");
  assert.match(source, /\.filter\(node => node.label !== "active-tab"\)/);
  const shown = nodes.filter(node => node.label !== "active-tab");
  assert.equal(shown.length, 40);
  for (const columns of [10, 8, 4]) {
    assert.equal(shown.length % columns, 0);
    assert.ok(css.includes(`repeat(${columns}, minmax(0, 1fr))`));
  }
});

test("node display follows color families rather than source menu groups", async () => {
  const source = await readFile(path.join(root, "components/BytespaceNodeCatalog.tsx"), "utf8");
  const order = JSON.parse(source.match(/const paletteOrder: Palette\[\] = (\[[^\]]+\]);/)[1]);
  assert.deepEqual(order, ["interaction", "ai", "data", "conditions", "browser", "general"]);
  assert.deepEqual([...order].sort(), Object.keys(catalog.palette).sort());
  assert.match(source, /\.sort\(\(a, b\) => paletteOrder.indexOf\(a.category as Palette\) - paletteOrder.indexOf\(b.category as Palette\)\)/);
  const shown = nodes.filter(node => node.label !== "active-tab")
    .sort((a, b) => order.indexOf(a.category) - order.indexOf(b.category));
  const groups = order.map(category => shown.filter(node => node.category === category));
  assert.deepEqual(shown, groups.flat());
  assert.equal(groups[0].at(-1).label, "javascript-code");
  assert.notEqual(catalog.palette.ai.edge, catalog.palette.data.edge);
});

test("mobile previews twelve nodes spanning all six groups and can expand the full collection", async () => {
  const source = await readFile(path.join(root, "components/BytespaceNodeCatalog.tsx"), "utf8");
  const css = await readFile(path.join(root, "components/BytespaceNodeCatalog.module.css"), "utf8");
  const preview = catalog.groups.flatMap(group => group.nodes.slice(0, group.name === "AI" ? 3 : 2));
  assert.equal(preview.length, 12);
  assert.match(source, /group.nodes.slice\(0, group.name === "AI" \? 3 : 2\)/);
  assert.match(source, /aria-expanded=\{expanded\} aria-controls="bytespace-node-grid"/);
  assert.match(source, /data-preview=\{previewNodes.has\(node.label\)\}/);
  assert.match(css, /@media \(max-width: 700px\)[\s\S]*?\.grid\[data-expanded="false"\] \.node\[data-preview="false"\] \{ display: none/);
  assert.match(css, /\.expand \{ display: none/);
});
