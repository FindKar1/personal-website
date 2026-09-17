import { execFileSync } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const orgChart = process.argv[2];
if (!orgChart) throw new Error("Pass the original Bytespace organization chart image.");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "public/media/systems");
const manifest = path.join(root, "app/systems-assets.json");
const assets = JSON.parse(await readFile(manifest, "utf8"));
const temporary = await mkdtemp(path.join(tmpdir(), "systems-details-"));

// Render only the public editions, preserving anonymization in every excerpt.
const selections = [
  { id: "business-process", file: "building-agile-organizations.pdf", page: 2 },
  { id: "systems-processes-procedures", file: "building-agile-organizations.pdf", page: 5 },
  { id: "agile-execution", file: "building-agile-organizations.pdf", page: 9 },
  { id: "organization-overview", file: "building-agile-organizations.pdf", page: 11 },
  { id: "role-fundamentals", file: "building-agile-organizations.pdf", page: 12 },
  { id: "reporting", file: "building-agile-organizations.pdf", page: 15 },
  { id: "operations-map", file: "building-agile-organizations.pdf", page: 17 },
  { id: "tech-stack", file: "building-agile-organizations.pdf", page: 18 },
  { id: "marketing-system", file: "building-agile-organizations.pdf", page: 19 },
  { id: "sales-system", file: "building-agile-organizations.pdf", page: 20 },
  { id: "lead-to-customer", file: "building-agile-organizations.pdf", page: 21 },
  { id: "implementation", file: "building-agile-organizations.pdf", page: 29 },
  { id: "agent-operating-model", file: "ai-operating-architecture.pdf", page: 6, crop: [32, 90, 564, 379] },
  { id: "shared-memory", file: "ai-operating-architecture.pdf", page: 8, crop: [32, 414, 564, 668] },
];

async function encode(input, id, crop) {
  let image = sharp(input);
  if (crop) {
    const { width, height } = await image.metadata();
    const left = Math.round(crop[0] / 595 * width);
    const top = Math.round(crop[1] / 842 * height);
    image = image.extract({
      left, top,
      width: Math.round(crop[2] / 595 * width) - left,
      height: Math.round(crop[3] / 842 * height) - top,
    });
  }
  const result = await image.resize({ width: 2400, withoutEnlargement: true })
    .webp({ quality: 90, effort: 6, smartSubsample: true })
    .toFile(path.join(output, `${id}.webp`));
  assets[id] = { src: `/media/systems/${id}.webp`, width: result.width, height: result.height };
  console.log(`${id}: ${result.width}x${result.height}, ${Math.round(result.size / 1024)} KB`);
}

try {
  for (const { id, file, page, crop } of selections) {
    const prefix = path.join(temporary, id);
    execFileSync(process.env.PDFTOPPM || "pdftoppm", [
      "-f", String(page), "-l", String(page), "-singlefile", "-png",
      "-scale-to-x", "3000", "-scale-to-y", "-1",
      path.join(root, "public/documents", file), prefix,
    ]);
    await encode(`${prefix}.png`, id, crop);
  }
  await encode(orgChart, "bytespace-org-chart");
  await writeFile(manifest, `${JSON.stringify(assets, null, 2)}\n`);
} finally {
  await rm(temporary, { recursive: true, force: true });
}
