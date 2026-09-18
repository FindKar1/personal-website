import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("favicon contains valid 16, 32, and 48px browser-tab images", async () => {
  const icon = await readFile(path.join(root, "app/favicon.ico"));
  assert.equal(icon.readUInt16LE(0), 0);
  assert.equal(icon.readUInt16LE(2), 1);
  assert.equal(icon.readUInt16LE(4), 3);

  for (const [index, size] of [16, 32, 48].entries()) {
    const entry = 6 + index * 16;
    assert.equal(icon[entry], size);
    assert.equal(icon[entry + 1], size);
    const length = icon.readUInt32LE(entry + 8);
    const offset = icon.readUInt32LE(entry + 12);
    const frame = sharp(icon.subarray(offset, offset + length));
    const metadata = await frame.metadata();
    assert.equal(metadata.format, "png");
    assert.equal(metadata.width, size);
    assert.equal(metadata.height, size);
    const { channels } = await frame.stats();
    assert.ok(channels[0].min < 32 && channels[0].max > 240);
    const corner = await frame.clone().extract({ left: 0, top: 0, width: 1, height: 1 }).removeAlpha().raw().toBuffer();
    assert.ok([...corner].every(channel => channel > 240), "favicon has a white background");
  }
});

test("browser and Apple touch icons have their intended dimensions", async () => {
  for (const [name, size] of [["icon.png", 192], ["apple-icon.png", 180]]) {
    const metadata = await sharp(path.join(root, "app", name)).metadata();
    assert.equal(metadata.format, "png");
    assert.equal(metadata.width, size);
    assert.equal(metadata.height, size);
  }
});
