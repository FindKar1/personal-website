import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const [downloads, sourceRepo, ...selectedIds] = process.argv.slice(2);
if (!downloads || !sourceRepo) throw new Error("Usage: node scripts/prepare-product-designs.mjs <images-directory> <portfolio-sites-repo>");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "public/media/product");
await mkdir(output, { recursive: true });
sharp.cache(false);
sharp.concurrency(1);

const originals = [
  ["workflow-builder", "Frame 10180.png"],
  ["agent-run", "Frame 1116606615.png"],
  ["agent-library", "Frame 10174.png"],
  ["agent-world", "Group 99246898.png"],
  ["characters", "Group 99246802.png"],
  ["worlds", "Group 99246919.png"],
  ["browser-modern", "Group 99246916.png"],
  ["browser-legacy", "Group 99246915.png"],
  ["office-network", "Group 99246251.png"],
  ["office-process", "Group 99245635.png"],
  ["office-landscape", "Group 99245470.png"],
  ["early-agent", "Screenshot 2024-09-05 at 7.30.59 PM 1.png"],
  ["office-interface", "Group 99245366.png"],
  ["automation-scenes", "Group 99246535.png"],
  ["product-composition", "Group 99246469.png"],
  ["desktop-composition", "Group 99246458.png"],
  ["business-landscape", "Frame 109.png"],
  ["brand-instrument", "Group 99245535.png"],
  ["founders-composition", "Group 99245444.png"],
  ["launch-illustration", "Group 99246634.png"],
  ["early-access", "Group 99246317.png"],
  ["shirt-design", "Shirt Back.png"],
  ["extension-popup", "Bytespace Cursor.png"],
  ["agent-cursor", "Group 99246399.png"],
  ["world-landscape", "Group (1) 1.png"],
  ["portal-space", "Group 99246856.png"],
  ["portal-energy", "Frame 1116606767 (4).png"],
  ["portal-garden", "Frame 1116606761 (4).png"],
  ["portal-gateway", "Group 99246853.png"],
  ["agent-world-light", "Frame 1116606791 (2).png"],
  ["agent-world-wide", "Group 99246885.png"],
  ["desktop-shell", "BytespaceComputer(Big Screens).png"],
  ["icon-ai", "Group 99245775.png"],
  ["icon-control", "Group 99245773.png"],
  ["icon-identity", "Group 99245776.png"],
  ["icon-web", "Group 99245779.png"],
  ["icon-security", "Group 99245778.png"],
  ["icon-space", "Group 99245777.png"],
].map(([id, filename]) => [id, path.join(downloads, filename)]);

const labFiles = [
  ["labs-cover", "open-graph/og-landing.png"],
  ["labs-statue", "healthcare/hero-computational-statue-transparent.webp"],
  ["labs-biology", "healthcare/write-new-biology-card.webp"],
  ["labs-anatomy", "healthcare/simulate-living-systems-card.webp"],
  ["labs-materials", "healthcare/discover-new-matter-card.webp"],
  ["labs-curiosity", "healthcare/curious-minds-field-computer.webp"],
].map(([id, filename]) => [id, path.join(sourceRepo, "apps/bytespace/public", filename)]);
const botFiles = [
  ["bot-octopus", "healthcare/octopus-instrument-transparent.webp"],
  ["bot-models", "research/any-model-collage.webp"],
  ["bot-data", "research/notebooks-data-roots-transparent.webp"],
  ["bot-compute", "research/compute-setup-instrument.webp"],
  ["bot-team", "research/people-agents-hands-transparent.webp"],
].map(([id, filename]) => [id, path.join(sourceRepo, "apps/bot0/public", filename)]);
const browserFiles = [
  ["agent-run-light", "landing/demo/bytespace_demo_white.png"],
  ["character-sales", "agent_profiles/Industry/sales/fb-sales.png"],
  ["character-scientist", "agent_profiles/Industry/scientist/fb-scientist.png"],
  ["character-doctor", "agent_profiles/Industry/doctor/fb-doctor.png"],
  ["character-construction", "agent_profiles/Industry/construction/fb-construction.png"],
  ["character-samurai", "agent_profiles/Premium/samurai/samurai-fb.png"],
  ["character-ice", "agent_profiles/Premium/ice-knight/ice-knight-fb.png"],
  ["character-space", "agent_profiles/Premium/space-crew/space-crew-fb.png"],
  ["character-code", "agent_profiles/Premium/code-warlock/code-warlock-fb.png"],
  ["character-fire", "agent_profiles/Premium/fire-knight/fire-knight-fb.png"],
  ["character-armor", "agent_profiles/Premium/robot-armor/robot-armor-fb.png"],
  ["character-fairy", "agent_profiles/Premium/space-fairy/space-fairy-fb.png"],
  ["character-einstein", "agent_profiles/Premium/einstein/einstein-fb.png"],
].map(([id, filename]) => [id, path.join(sourceRepo, "apps/cmd0/public", filename)]);

const manifest = path.join(root, "app/product-design-assets.json");
const assets = selectedIds.length ? JSON.parse(await readFile(manifest, "utf8")) : {};
for (const [id, input] of [...originals, ...labFiles, ...botFiles, ...browserFiles]) {
  if (selectedIds.length && !selectedIds.includes(id)) continue;
  assets[id] = {};
  const previewWidth = id.startsWith("icon-") ? 320 : id.startsWith("character-") ? 360 : id.startsWith("bot-") && id !== "bot-octopus" ? 600 : id.startsWith("labs-") && !["labs-cover", "labs-statue"].includes(id) ? 640 : id === "characters" || id === "worlds" ? 1100 : 1440;
  for (const [variant, width, quality] of [["preview", previewWidth, 85], ["full", 2800, 92]]) {
    const filename = `${id}-${variant}.webp`;
    let pipeline = sharp(input);
    // Back only the accidental transparent bridge between the samurai's lenses.
    if (id === "character-samurai") {
      const patch = await sharp({ create: { width: 44, height: 18, channels: 4, background: "#36413c" } }).png().toBuffer();
      const repaired = await pipeline.composite([{ input: patch, left: 179, top: 92, blend: "dest-over" }]).png().toBuffer();
      pipeline = sharp(repaired);
    }
    // The wide export has large empty side margins; retain the entire illustrated scene.
    if (id === "agent-world-wide") pipeline.extract({ left: 1050, top: 0, width: 4615, height: 2882 });
    const result = await pipeline.resize({ width, withoutEnlargement: true }).webp({ quality, effort: 6 }).toFile(path.join(output, filename));
    assets[id][variant] = { src: `/media/product/${filename}`, width: result.width, height: result.height };
    console.log(`${filename}: ${result.width}x${result.height}, ${Math.round(result.size / 1024)} KB`);
  }
}
await writeFile(manifest, JSON.stringify(assets, null, 2) + "\n");
