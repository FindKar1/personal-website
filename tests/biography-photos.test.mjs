import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import test from "node:test";
import sharp from "sharp";

const assets = JSON.parse(await readFile(new URL("../app/biography-photo-assets.json", import.meta.url), "utf8"));
const directory = new URL("../public/media/biography/", import.meta.url);

test("biography contains only the eight selected web derivatives", async () => {
  assert.deepEqual(Object.keys(assets), [
    "motorcycle", "childhood-portrait", "car", "garden", "playground", "park", "cooking", "school-portrait",
  ]);
  assert.deepEqual((await readdir(directory)).sort(), Object.keys(assets).map((id) => `${id}.webp`).sort());
});

test("Origin and Home use proportional single rows with the close-up between the vehicles", async () => {
  const component = await readFile(new URL("../components/Biography.tsx", import.meta.url), "utf8");
  const css = await readFile(new URL("../components/Biography.module.css", import.meta.url), "utf8");
  const origin = component.slice(component.indexOf("  origin:"), component.indexOf("  home:"));
  const home = component.slice(component.indexOf("  home:"), component.indexOf("  curiosity:"));

  assert.deepEqual([...origin.matchAll(/id: "([^"]+)"/g)].map((match) => match[1]), ["motorcycle", "childhood-portrait", "car"]);
  assert.match(origin, /layout: "row"/);
  assert.match(home, /layout: "row"/);
  assert.match(component, /photos\[id\]\.width \/ photos\[id\]\.height/);
  assert.match(css, /\.row\s*\{\s*grid-template-columns: var\(--photo-columns\);\s*\}/);
  assert.doesNotMatch(css, /grid-row|grid-column|nth-child/);
});

test("biography photos have accurate layout dimensions and no source metadata", async () => {
  let totalBytes = 0;
  for (const [id, asset] of Object.entries(assets)) {
    const file = new URL(`${id}.webp`, directory);
    const metadata = await sharp(await readFile(file)).metadata();
    assert.equal(asset.src, `/media/biography/${id}.webp`);
    assert.equal(metadata.format, "webp");
    assert.equal(metadata.width, asset.width);
    assert.equal(metadata.height, asset.height);
    assert.equal(metadata.orientation, undefined);
    assert.equal(metadata.exif, undefined);
    assert.equal(metadata.xmp, undefined);
    totalBytes += (await stat(file)).size;
  }
  assert.ok(totalBytes < 900 * 1024, "The entire photo set should stay under 900 KB.");
});
