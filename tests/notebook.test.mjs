import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import sharp from "sharp";
import ts from "typescript";
import { notesArtifactSections } from "../app/media-artifacts.ts";

const require = createRequire(import.meta.url);
const collageSource = await readFile(new URL("../components/NotebookCollage.tsx", import.meta.url), "utf8");
const compiled = { exports: {} };
const { outputText } = ts.transpileModule(collageSource, {
  compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, esModuleInterop: true },
});
new Function("require", "module", "exports", outputText)(id => {
  if (id.endsWith(".module.css")) return new Proxy({}, { get: (_, key) => key === "__esModule" ? false : String(key) });
  if (id === "@/app/media-artifacts") return require(fileURLToPath(new URL("../app/media-artifacts.ts", import.meta.url)));
  return require(id);
}, compiled, compiled.exports);
const collage = renderToStaticMarkup(createElement(compiled.exports.NotebookCollage));

test("the curated collage retains every remaining note exactly once", () => {
  const curated = compiled.exports.notebookRows.flatMap(row => row.items);
  const originals = notesArtifactSections.flatMap(section => section.items);
  assert.deepEqual(curated.map(item => item.src).sort(), originals.map(item => item.src).sort());
  assert.equal(new Set(curated.map(item => item.src)).size, 21);
  assert.equal(collage.match(/aria-label="Enlarge /g)?.length, 21);
  assert.equal(compiled.exports.notebookRows.filter(row => row.layout === "feature").length, 2);
});

test("the gallery has no category prose or captions, and preserves scan orientation", async () => {
  assert.doesNotMatch(collage, /<figcaption|<h[1-6]|<p\b/);
  for (const section of notesArtifactSections) assert.ok(!collage.includes(section.description));
  assert.equal(collage.match(/rotate\(270deg\)/g)?.length, 4);
  assert.match(collage, /role="group" aria-label="Notebook images"/);
  const css = await readFile(new URL("../components/NotebookCollage.module.css", import.meta.url), "utf8");
  assert.match(css, /object-fit: contain/);
  assert.doesNotMatch(css, /object-fit: cover/);
});

test("Notebook enlargement includes accessible navigation, zoom, and focus restoration", () => {
  assert.match(collage, /<dialog[^>]*aria-label="Notebook image viewer"/);
  for (const label of ["Previous image", "Next image", "Zoom in", "Zoom out", "Fit to viewer", "Close viewer"]) {
    assert.ok(collageSource.includes(`aria-label="${label}"`));
  }
  assert.match(collageSource, /trigger.current\?\.focus\(\{ preventScroll: true \}\)/);
  assert.match(collageSource, /onCancel=\{\(\) => setActiveIndex\(null\)\}/);
});

test("Notebook omits the three removed reference boards while preserving their files", async () => {
  const displayed = notesArtifactSections.flatMap(section => section.items).map(item => item.src);
  assert.equal(displayed.length, 21);
  for (const file of [
    "notes-models-rainforest-results-map.webp",
    "notes-planning-startup-grind-berkeley-board.webp",
    "notes-planning-completed-board.webp",
  ]) {
    assert.ok(!displayed.includes(`/media/optimized/${file}`));
    await access(new URL(`../public/media/optimized/${file}`, import.meta.url));
  }
});

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
  assert.match(source, /notebookView === "notes"[\s\S]*?className="w-full">\s*<NotebookCollage/);
});
