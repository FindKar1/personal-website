import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "assets/branding/kd-mark-light.png");
const sizes = [16, 32, 48];
const frames = [];

for (const size of sizes) {
  frames.push(await sharp(source).resize(size, size).png().toBuffer());
}

// ICO directory entries point to individually sized PNG frames.
const directory = Buffer.alloc(6 + sizes.length * 16);
directory.writeUInt16LE(1, 2);
directory.writeUInt16LE(sizes.length, 4);
let offset = directory.length;
for (const [index, size] of sizes.entries()) {
  const entry = 6 + index * 16;
  directory[entry] = size;
  directory[entry + 1] = size;
  directory.writeUInt16LE(1, entry + 4);
  directory.writeUInt16LE(32, entry + 6);
  directory.writeUInt32LE(frames[index].length, entry + 8);
  directory.writeUInt32LE(offset, entry + 12);
  offset += frames[index].length;
}

await writeFile(path.join(root, "app/favicon.ico"), Buffer.concat([directory, ...frames]));
await sharp(source).resize(192, 192).png().toFile(path.join(root, "app/icon.png"));
await sharp(source).resize(180, 180).png().toFile(path.join(root, "app/apple-icon.png"));
