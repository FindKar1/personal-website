import { execFile } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import sharp from "sharp";

const sourceDirectory = process.argv[2];
if (!sourceDirectory) throw new Error("Usage: node scripts/prepare-biography-photos.mjs <photos-directory>");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "public/media/biography");
const temporary = await mkdtemp(path.join(os.tmpdir(), "kar-biography-"));
const run = promisify(execFile);

// Bounds are fractions of the upright source. Publish only these cropped,
// metadata-free copies, not the originals with print labels or location data.
const photos = [
  { id: "motorcycle", file: "IMG_7217.PNG", crop: [0.10, 0.135, 0.82, 0.615], width: 800 },
  { id: "childhood-portrait", file: "IMG_3299.HEIC", crop: [0.075, 0.09, 0.86, 0.815], width: 900 },
  { id: "car", file: "IMG_3236.jpeg", crop: [0, 0, 0.94, 0.89], width: 640 },
  { id: "garden", file: "IMG_1997.jpeg", crop: [0.16, 0.205, 0.84, 0.495], width: 640 },
  { id: "playground", file: "IMG_6301.JPG", crop: [0.13, 0, 0.70, 0.875], width: 900 },
  { id: "park", file: "IMG_4658.HEIC", crop: [0.15, 0.345, 0.72, 0.585], width: 800 },
  { id: "cooking", file: "IMG_1889.jpg", crop: [0.14, 0.255, 0.68, 0.665], width: 720 },
  { id: "school-portrait", file: "IMG_3304.jpg", crop: [0.235, 0.15, 0.525, 0.69], width: 560 },
];

await mkdir(output, { recursive: true });
const assets = {};
try {
  for (const photo of photos) {
    let input = path.join(sourceDirectory, photo.file);
    if (photo.file.endsWith(".HEIC")) {
      const converted = path.join(temporary, `${photo.id}.jpg`);
      await run(process.env.HEIF_CONVERT || "heif-convert", [input, converted]);
      input = converted;
    }
    const upright = await sharp(input).autoOrient().toBuffer();
    const metadata = await sharp(upright).metadata();
    const [left, top, width, height] = photo.crop;
    const filename = `${photo.id}.webp`;
    const result = await sharp(upright)
      .extract({
        left: Math.round(left * metadata.width),
        top: Math.round(top * metadata.height),
        width: Math.round(width * metadata.width),
        height: Math.round(height * metadata.height),
      })
      .resize({ width: photo.width, withoutEnlargement: true })
      .webp({ quality: 88, effort: 6 })
      .toFile(path.join(output, filename));
    assets[photo.id] = { src: `/media/biography/${filename}`, width: result.width, height: result.height };
    console.log(`${filename}: ${result.width}x${result.height}, ${Math.round(result.size / 1024)} KB`);
  }
  await writeFile(path.join(root, "app/biography-photo-assets.json"), `${JSON.stringify(assets, null, 2)}\n`);
} finally {
  await rm(temporary, { recursive: true, force: true });
}
