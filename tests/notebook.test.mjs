import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import sharp from "sharp";
import { notesArtifactSections } from "../app/media-artifacts.ts";

test("only the four sideways note scans receive a quarter-turn correction", async () => {
  const rotated = notesArtifactSections.flatMap(section => section.items).filter(item => item.rotation);
  assert.deepEqual(rotated.map(item => item.src.split("/").pop()), [
    "notes-network-diagram.webp",
    "notes-models-startup-org-chart.webp",
    "notes-models-paladin-model.webp",
    "notes-planning-uloop-strategy.webp",
  ]);
  for (const item of rotated) {
    assert.equal(item.rotation, 270);
    const metadata = await sharp(new URL(`../public${item.src}`, import.meta.url).pathname).metadata();
    assert.equal(metadata.width, item.width);
    assert.equal(metadata.height, item.height);
  }
});

test("Notebook has a shared introduction and each view starts with its collection", async () => {
  const source = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.match(source, /I like getting ideas out of my head and onto paper/);
  assert.doesNotMatch(source, /Before an idea becomes something useful|A partial, imperfectly remembered record/);
  assert.match(source, /notebookView === "reading"[\s\S]*?className="w-full">\s*<div className="space-y-10">/);
  assert.match(source, /notebookView === "notes"[\s\S]*?className="w-full">\s*<MediaSectionList/);
});
