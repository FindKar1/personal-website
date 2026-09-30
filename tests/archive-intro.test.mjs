import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
const archive = page.slice(page.indexOf('{activeTab === "archive" && ('), page.indexOf('{activeTab === "notebook" && notebookView === "notes"'));
const intro = archive.slice(0, archive.indexOf("<WorkPhotoCollage"));
const details = page.slice(page.indexOf("function ArchiveIntroDetails"), page.indexOf("function WorkPhotoCollage"));
const paragraphs = [...`${intro}${details}`.matchAll(/<p>([\s\S]*?)<\/p>/g)].map(match => match[1].replace(/\s+/g, " ").trim());

test("Archive introduces the motivations behind the work in five paragraphs", () => {
  assert.equal(paragraphs.length, 5);
  assert.equal(paragraphs[0], "I&apos;ve spent a lot of time moving between very different worlds.");
  assert.match(paragraphs[1], /At Bytespace, that meant getting people out of soul-crushing, repetitive work\./);
  assert.equal(paragraphs[2], "At 6x7 Networks, I was fascinated by what telecommunications could unlock for people. Internet access could put the world&apos;s accumulated knowledge within reach for more people. Learning shouldn&apos;t depend so heavily on where you were born or what you could afford.");
  assert.doesNotMatch(paragraphs[2], /Ambitious, I know|every man, woman, and child/);
  assert.match(paragraphs[3], /At Paladin Partners, it was helping companies make complicated technology easier to understand\./);
  assert.equal(paragraphs[4], "These are some photos from the journey so far.");
  assert.doesNotMatch(intro, /Rooftops and data centers/);
});

test("Archive keeps shared intro typography and its existing media order", () => {
  assert.match(intro, /max-w-4xl space-y-4 text-base leading-7 text-graphite/);
  const media = ["<WorkPhotoCollage", "<ArchiveTalks", "<PeoplePhotoCollage", "<ArchiveTravel"];
  for (let index = 1; index < media.length; index++) {
    assert.ok(archive.indexOf(media[index - 1]) < archive.indexOf(media[index]));
  }
});

test("Archive moves the shared continuation after its opening three photos only on phones", () => {
  assert.match(intro, /className="hidden space-y-4 sm:block"><ArchiveIntroDetails/);
  const collage = page.slice(page.indexOf("function WorkPhotoCollage"), page.indexOf("const readingSections"));
  assert.match(collage, /const collageItems = \[fieldWork, startupEvent, networkBuild, \.\.\.otherPhotos\]/);
  assert.match(collage, /const \[fieldWork, networkBuild, startupEvent, \.\.\.otherPhotos\] = items.slice\(0, -3\)/);
  assert.match(collage, /index === 1 && <div className="col-span-full py-7 sm:hidden">/);
  assert.match(collage, /<ArchiveIntroDetails \/>/);
  assert.equal(collage.match(/src=\{hero.src\}/g)?.length, 1);
  assert.ok(collage.indexOf("src={artifact.src}") < collage.indexOf("<ArchiveIntroDetails"));
});

test("Startup Grind fills the last phone row without changing the desktop collage", () => {
  const classes = [...page.match(/const workCollageClasses = \[([\s\S]*?)\];/)[1].matchAll(/"([^"]+)"/g)].map(match => match[1]);
  assert.equal(classes.length, 7);
  assert.deepEqual(classes.map(value => Number(value.match(/^col-span-(\d+)/)[1])), [1, 1, 1, 1, 1, 1, 2]);
  assert.deepEqual(classes.map(value => Number(value.match(/sm:col-span-(\d+)/)[1])), [3, 3, 2, 2, 2, 3, 3]);
  assert.match(classes[6], /aspect-\[1179\/664\].*sm:aspect-\[4\/3\]/);
  assert.match(page, /sizes=\{index === 6 \? "\(min-width: 640px\) 256px, 100vw"/);
});
