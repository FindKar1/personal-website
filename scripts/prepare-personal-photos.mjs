import { execFile } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import sharp from "sharp";

const source = process.argv[2];
if (!source) throw new Error("Usage: node scripts/prepare-personal-photos.mjs <photos-directory>");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "public/media/personal");
const run = promisify(execFile);
const selections = [
  ["lecture", "IMG_0455.JPG", 1600],
  ["workshop", "IMG_8536.JPG", 1400],
  ["dance-group", "IMG_0354.JPG", 1800],
  ["fraternity", "IMG_2666.JPG", 1800],
  ["formal-friends", "IMG_2961.JPG", 1200],
  ["holiday", "IMG_0843.JPG", 1200],
  ["bridge-friends", "IMG_0882.JPG", 1200],
  ["outdoors", "IMG_2851.JPG", 1200],
  ["barbecue", "IMG_8728.JPG", 1600],
  ["birthday", "IMG_2336.JPG", 1400],
  ["office-friends", "IMG_8758.jpg", 1600],
  ["korea-group", "IMG_8557.JPG", 1400],
  ["mentors", "IMG_7660.JPG", 1600],
  ["eia-staff", "IMG_7200.JPG", 1600],
  ["olive-oil-team", "IMG_2455.JPG", 1600],
  ["booming-group", "IMG_1968.JPG", 1400],
  ["startuphouse", "IMG_1334.JPG", 1600],
  ["hang-gliding", "GOPR5076.JPG", 1600],
  ["lamppost", "IMG_9859.jpg", 1200],
  ["boat", "IMG_4427.JPG", 1600],
  ["tank", "IMG_2916.JPG", 1600],
  ["skydiving", "6D0BB4CC-DE38-45DE-87FB-A9ED08B53C7B.JPG", 2000],
  ["learning-to-fly", "IMG_6444.JPG", 1600],
  ["climbing", "IMG_3442.jpg", 1400],
  ["surf-lesson", "IMG_6371.JPG", 1000],
  ["surf-shore", "IMG_2441.JPG", 1000],
  ["surfing", "IMG_6262.HEIC", 1600],
  ["snowboarding", "IMG_4475.jpg", 1400],
  ["wakesurfing", "IMG_5829.JPG", 1400],
];

await mkdir(output, { recursive: true });
const assets = {};
const temporary = await mkdtemp(path.join(tmpdir(), "personal-photos-"));
try {
  for (const [id, filename, width] of selections) {
    let input = path.join(source, filename);
    if (/\.heic$/i.test(filename)) {
      const decoded = path.join(temporary, `${id}.png`);
      await run("sips", ["-s", "format", "png", input, "--out", decoded]);
      input = decoded;
    }
    const result = await sharp(input).autoOrient()
      .resize({ width, withoutEnlargement: true }).webp({ quality: 85, effort: 6 })
      .toFile(path.join(output, `${id}.webp`));
    assets[id] = { src: `/media/personal/${id}.webp`, width: result.width, height: result.height };
    console.log(`${id}: ${result.width}x${result.height}, ${Math.round(result.size / 1024)} KB`);
  }
} finally {
  await rm(temporary, { recursive: true, force: true });
}
await writeFile(path.join(root, "app/personal-photo-assets.json"), `${JSON.stringify(assets, null, 2)}\n`);

// Both clips are silent visuals, with playback opt-in.
for (const [id, filename, posterTime] of [["underwater", "IMG_4348.MOV", "3.5"], ["berkeley-protest", "IMG_2691.MOV", "0.5"]]) {
  await run("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-i", path.join(source, filename),
    "-map", "0:v:0", "-an", "-map_metadata", "-1", "-c:v", "libx264", "-preset", "slow", "-crf", "26",
    "-pix_fmt", "yuv420p", "-movflags", "+faststart", path.join(output, `${id}.mp4`)]);
  await run("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-ss", posterTime, "-i", path.join(output, `${id}.mp4`),
    "-frames:v", "1", "-update", "1", "-q:v", "3", path.join(output, `${id}-poster.jpg`)]);
}
