import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const sourceDirectory = process.argv[2];
if (!sourceDirectory) throw new Error("Pass the directory containing the four original Bytespace PNGs.");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "public/media/systems/bytespace");
await mkdir(output, { recursive: true });

// Process one large source at a time. The originals remain outside the public site.
sharp.cache(false);
sharp.concurrency(1);
const sources = [
  ["product-roadmap", "Bytespace Product Roadmap (1).png"],
  ["use-cases", "Bytespace Use Cases (1).png"],
  ["company-overview", "Bytespace 1-Pager (2) (1).png"],
  ["team-overview", "Bytespace Team 1-Pager (1).png"],
];
const manifest = path.join(root, "app/bytespace-design-assets.json");
const detailsOnly = process.argv.includes("--details-only");
const assets = detailsOnly ? JSON.parse(await readFile(manifest, "utf8")) : {};

async function encode(input, id, width, quality, crop) {
  let pipeline = sharp(input);
  if (crop) pipeline = pipeline.extract(crop);
  const result = await pipeline.resize({ width, withoutEnlargement: true })
    .webp({ quality, effort: 6, smartSubsample: true })
    .toFile(path.join(output, `${id}.webp`));
  console.log(`${id}: ${result.width}x${result.height}, ${(result.size / 1024).toFixed(0)} KB`);
  return { src: `/media/systems/bytespace/${id}.webp`, width: result.width, height: result.height };
}

for (const [id, filename] of sources) {
  const input = path.join(sourceDirectory, filename);
  if (!detailsOnly) {
    assets[id] = {
      preview: await encode(input, `${id}-preview`, 640, 78),
      full: await encode(input, id, 2400, 90),
    };
  }
  const { width, height } = await sharp(input).metadata();
  const region = id === "product-roadmap" ? [0, 0.79, 1, 0.21]
    : id === "use-cases" ? [0.035, 0.175, 0.93, 0.077] : null;
  if (region) {
    const left = Math.round(width * region[0]);
    const top = Math.round(height * region[1]);
    const crop = {
      left, top,
      width: Math.min(width - left, Math.round(width * region[2])),
      height: Math.min(height - top, Math.round(height * region[3])),
    };
    assets[`${id}-detail`] = {
      preview: await encode(input, `${id}-detail-preview`, 1200, 86, crop),
      full: await encode(input, `${id}-detail`, 2400, 92, crop),
    };
  }
}

await writeFile(manifest, `${JSON.stringify(assets, null, 2)}\n`);
