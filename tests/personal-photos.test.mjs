import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { createRequire } from "node:module";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import sharp from "sharp";
import ts from "typescript";
import { archiveArtifactSections } from "../app/media-artifacts.ts";

const require = createRequire(import.meta.url);
const assets = JSON.parse(await readFile(new URL("../app/personal-photo-assets.json", import.meta.url), "utf8"));
const childhood = JSON.parse(await readFile(new URL("../app/biography-photo-assets.json", import.meta.url), "utf8"));
const gallerySource = await readFile(new URL("../components/PhotoGallery.tsx", import.meta.url), "utf8");
const biographySource = await readFile(new URL("../components/Biography.tsx", import.meta.url), "utf8");

function compile(source, dependencies = {}) {
  const compiledModule = { exports: {} };
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  });
  new Function("require", "module", "exports", outputText)(id => {
    if (id.endsWith(".module.css")) return new Proxy({}, { get: (_, key) => key === "__esModule" ? false : String(key) });
    return dependencies[id] ?? require(id);
  }, compiledModule, compiledModule.exports);
  return compiledModule.exports;
}

const gallery = compile(gallerySource);
const biography = compile(biographySource, {
  "@/app/biography-photo-assets.json": childhood,
  "@/app/media-artifacts": { archiveArtifactSections },
  "./PhotoGallery": gallery,
});

test("People includes the selected relationships and teams without repeated meal shots", () => {
  const photos = archiveArtifactSections[0].items;
  assert.equal(photos.length, 31);
  assert.equal(new Set(photos.map(photo => photo.src)).size, 31);
  assert.equal(photos.filter(photo => photo.src.startsWith("/media/optimized/")).length, 14);
  assert.deepEqual(photos.filter(photo => photo.src.startsWith("/media/personal/")).map(photo => photo.src.split("/").pop()), [
    "barbecue.webp", "holiday.webp", "formal-friends.webp", "dance-group.webp", "lecture.webp", "workshop.webp", "office-friends.webp", "mentors.webp", "eia-staff.webp", "olive-oil-team.webp", "booming-group.webp", "startuphouse.webp", "fraternity.webp", "birthday.webp", "korea-group.webp", "bridge-friends.webp", "outdoors.webp",
  ]);
  assert.ok(!photos.some(photo => /korea-team-meal|team-dinner-small|\/boat\.|\/tank\./.test(photo.src)));
  assert.ok(photos.every(photo => !Object.hasOwn(photo, "caption")));
  assert.ok(photos.every(photo => photo.alt.trim().length > 0));
  assert.match(photos.find(photo => photo.src === assets.mentors.src).alt, /two of my mentors/);
  assert.match(photos.find(photo => photo.src === assets["eia-staff"].src).alt, /European Innovation Academy staff/);
});

test("Usefulness pairs EIA before the bedroom immediately before the room story", () => {
  const groups = biography.biographyPhotoGroups;
  assert.deepEqual(groups.usefulness.map(group => [group.afterParagraph, group.photos.map(photo => photo.id)]), [
    [6, ["eia", "bedroom"]],
  ]);
  assert.equal(groups.usefulness[0].layout, "row");
  assert.equal(groups.school, undefined);
  assert.equal(groups.systems, undefined);
  assert.equal(groups.now, undefined);
  assert.ok(!biographySource.includes('id: "school-portrait"'));
  const markup = renderToStaticMarkup(createElement(biography.Biography, {
    sections: [{ label: "usefulness", paragraphs: Array.from({ length: 8 }, (_, i) => `Paragraph ${i + 1}`) }],
  }));
  assert.ok(markup.indexOf("Paragraph 6") < markup.indexOf("archive-early-ventures-program-break.webp"));
  assert.ok(markup.indexOf("archive-early-ventures-program-break.webp") < markup.indexOf("archive-personal-startup-bedroom.webp"));
  assert.ok(markup.indexOf("archive-personal-startup-bedroom.webp") < markup.indexOf("Paragraph 7"));
  assert.match(markup, /class="row keepRow"/);
});

test("biography renders every paragraph once and in order around the photo breaks", () => {
  const sections = Object.keys(biography.biographyPhotoGroups).concat("school", "systems", "now").map(label => ({
    label, paragraphs: Array.from({ length: 11 }, (_, i) => `${label} paragraph ${i + 1}`),
  }));
  const markup = renderToStaticMarkup(createElement(biography.Biography, { sections }));
  const paragraphs = [...markup.matchAll(/<p>([^<]+)<\/p>/g)].map(match => match[1]);
  assert.deepEqual(paragraphs, sections.flatMap(section => section.paragraphs));
  assert.equal(markup.match(/aria-label="Enlarge /g)?.length, 9);
  assert.doesNotMatch(markup, /school-portrait\.webp|\/personal\/(lecture|workshop)\.webp/);
});

test("photo gallery has accessible enlargement and preserves source aspect ratios", async () => {
  const markup = renderToStaticMarkup(createElement(gallery.PhotoGallery, { photos: archiveArtifactSections[0].items, label: "People photos", compactFirstRow: true }));
  assert.equal(markup.match(/aria-label="Enlarge /g)?.length, 31);
  assert.match(markup, /<dialog[^>]*aria-label="People photos viewer"/);
  assert.match(markup, /loading="lazy"/);
  assert.match(gallerySource, /trigger.current\?\.focus\(\{ preventScroll: true \}\)/);
  for (const action of ["Previous photo", "Next photo", "Close viewer", "ArrowRight", "ArrowLeft"]) assert.ok(gallerySource.includes(action));
  assert.match(gallerySource, /onCancel=\{\(\) => setActiveIndex\(null\)\}/);
  const css = await readFile(new URL("../components/PhotoGallery.module.css", import.meta.url), "utf8");
  assert.match(css, /object-fit: contain/);
  assert.match(css, /\.row:not\(\.keepRow\)/);
  assert.doesNotMatch(gallerySource, /active\.caption/);
  assert.doesNotMatch(css, /\.caption\b/);
});

test("enlarged photos retain accessible descriptions but ignore legacy captions", () => {
  const openGallery = compile(gallerySource, {
    react: { ...require("react"), useState: () => [0, () => {}] },
  });
  const photo = { ...assets.boat, alt: "Steering a motorboat", caption: "Legacy guessed caption" };
  const markup = renderToStaticMarkup(createElement(openGallery.PhotoGallery, { photos: [photo], label: "Photo" }));
  const viewer = markup.slice(markup.indexOf("<dialog"));
  assert.match(viewer, /alt="Steering a motorboat"/);
  assert.match(viewer, /1 \/ 1/);
  assert.doesNotMatch(viewer, /Legacy guessed caption|<p\b|<figcaption\b/);
});

test("selected personal photos are local web derivatives without source metadata", async () => {
  assert.equal(Object.keys(assets).length, 29);
  let bytes = 0;
  for (const asset of Object.values(assets)) {
    const file = new URL(`../public${asset.src}`, import.meta.url);
    const metadata = await sharp(await readFile(file)).metadata();
    assert.equal(metadata.format, "webp");
    assert.equal(metadata.width, asset.width);
    assert.equal(metadata.height, asset.height);
    assert.equal(metadata.orientation, undefined);
    assert.equal(metadata.exif, undefined);
    assert.equal(metadata.xmp, undefined);
    bytes += (await stat(file)).size;
  }
  assert.ok(bytes < 6 * 1024 * 1024);
});

test("Elsewhere groups the surfing trio, pairs board sports, and retains the boat", async () => {
  const source = await readFile(new URL("../components/ArchiveTravel.tsx", import.meta.url), "utf8");
  const travel = compile(source, { "@/app/personal-photo-assets.json": assets, "./PhotoGallery": gallery });
  const markup = renderToStaticMarkup(createElement(travel.ArchiveTravel));
  assert.equal(markup.match(/aria-label="Enlarge /g)?.length, 11);
  const rows = [...markup.matchAll(/<div class="row [^"]*"[^>]*>(.*?)<\/div>/g)].map(match => [...match[1].matchAll(/src="([^"]+)"/g)].map(image => image[1]));
  assert.deepEqual(rows, [
    [assets.skydiving.src],
    [assets["learning-to-fly"].src, assets.climbing.src],
    [assets["hang-gliding"].src],
    [assets["surf-lesson"].src, assets["surf-shore"].src, assets.surfing.src],
    [assets.snowboarding.src, assets.wakesurfing.src],
    [assets.boat.src, assets.tank.src],
  ]);
  assert.doesNotMatch(markup, /lamppost|IMG_7719|IMG_6455/);
  assert.match(markup, /aspect-ratio:1.7777777777777777/);
  assert.match(markup, /object-position:center 55%/);
  assert.equal(markup.match(/class="row /g)?.length, 6);
  assert.equal(markup.match(/class="row keepRow"/g)?.length, 1);
  assert.doesNotMatch(source, /\bcaption:/);
  assert.doesNotMatch(source, /\b(?:19|20)\d{2}\b|date:/);
});

test("wide photos break paired rows without changing photo order or duplication", () => {
  const photos = [
    { ...assets.boat, alt: "Boat" },
    { ...assets.skydiving, alt: "Skydiving", fullWidth: true },
    { ...assets["hang-gliding"], alt: "Hang-gliding", fullWidth: true },
    { ...assets.climbing, alt: "Climbing" },
    { ...assets["learning-to-fly"], alt: "Flying" },
    { ...assets.tank, alt: "Tank" },
  ];
  const markup = renderToStaticMarkup(createElement(gallery.PhotoGallery, { photos, label: "Mixed gallery" }));
  assert.deepEqual([...markup.matchAll(/src="([^"]+)"/g)].map(match => match[1]), photos.map(photo => photo.src));
  const rowCounts = [...markup.matchAll(/<div class="row [^"]*"[^>]*>(.*?)<\/div>/g)].map(match => [...match[1].matchAll(/<button /g)].length);
  assert.deepEqual(rowCounts, [1, 1, 1, 2, 1]);
  const kept = renderToStaticMarkup(createElement(gallery.PhotoGallery, { photos: photos.slice(0, 2), label: "Kept row", keepRow: true }));
  assert.equal(kept.match(/class="row keepRow"/g)?.length, 1);
});

test("explicit row groups remain separate from neighboring pairs and wide photos", () => {
  const photos = [
    { ...assets.boat, alt: "Boat" },
    { ...assets["surf-lesson"], alt: "Surf lesson", rowGroup: "surfing" },
    { ...assets["surf-shore"], alt: "Surfboard", rowGroup: "surfing" },
    { ...assets.surfing, alt: "Surfing", rowGroup: "surfing" },
    { ...assets.climbing, alt: "Climbing" },
    { ...assets["learning-to-fly"], alt: "Flying" },
    { ...assets.tank, alt: "Tank", rowGroup: "other" },
    { ...assets.skydiving, alt: "Skydiving", rowGroup: "other", fullWidth: true },
  ];
  const markup = renderToStaticMarkup(createElement(gallery.PhotoGallery, { photos, label: "Grouped gallery" }));
  const rowCounts = [...markup.matchAll(/<div class="row [^"]*"[^>]*>(.*?)<\/div>/g)].map(match => [...match[1].matchAll(/<button /g)].length);
  assert.deepEqual(rowCounts, [1, 3, 2, 1, 1]);
  assert.deepEqual([...markup.matchAll(/src="([^"]+)"/g)].map(match => match[1]), photos.map(photo => photo.src));
});

test("fraternity selection uses the preferred replacement, not both variants", async () => {
  const source = await readFile(new URL("../scripts/prepare-personal-photos.mjs", import.meta.url), "utf8");
  assert.match(source, /\["fraternity", "IMG_2666.JPG"/);
  assert.doesNotMatch(source, /IMG_2989|IMG_1476|IMG_3687|IMG_3348/);
});

test("a single portrait fills its gallery column", () => {
  const markup = renderToStaticMarkup(createElement(gallery.PhotoGallery, { photos: [{ ...assets.lamppost, alt: "Portrait beside a lamppost" }], label: "Portrait" }));
  assert.match(markup, /--columns:minmax\(0, 1fr\)/);
});

test("both travel videos are local, opt-in, and have posters and accessible descriptions", async () => {
  const source = await readFile(new URL("../components/ArchiveTravel.tsx", import.meta.url), "utf8");
  assert.equal(source.match(/<video controls playsInline muted preload="none"/g)?.length, 2);
  assert.doesNotMatch(source, /autoPlay|loop[\s=>]/);
  assert.match(source, /aria-describedby="underwater-description"/);
  assert.match(source, /aria-describedby="protest-description protest-caption"/);
  assert.match(source, />Berkeley protest\.<\/figcaption>/);
  for (const id of ["underwater", "berkeley-protest"]) {
    await stat(new URL(`../public/media/personal/${id}-poster.jpg`, import.meta.url));
    const video = await readFile(new URL(`../public/media/personal/${id}.mp4`, import.meta.url));
    assert.equal(video.toString("ascii", 4, 8), "ftyp");
    assert.ok(video.length < 2 * 1024 * 1024);
  }
});
