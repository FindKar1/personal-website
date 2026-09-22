import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
const intro = page.slice(page.indexOf('{isAbout && ('), page.indexOf("</header>"));

test("About opens with the curiosity-led welcome instead of the resume summary", () => {
  assert.match(intro, /id="about-intro"/);
  assert.match(intro, /Most of the things I care about started with a question I/);
  assert.match(intro, /Hi, I&apos;m Kar\. Welcome to my space!/);
  assert.match(intro, /relationship between technology\s+and society/);
  assert.match(intro, /Some of it is finished work\. Some is still taking shape\./);
  assert.match(intro, /people driven by a mission/);
  assert.doesNotMatch(intro, /founder and operator|closed tens of millions/);
});

test("the invitation is a separate paragraph linking to a focusable contact footer", () => {
  const invitation = intro.match(/<p className="mt-6 max-w-4xl">([\s\S]*?)<\/p>/)?.[1];
  assert.ok(invitation);
  assert.match(invitation, /If something here sparks your interest/);
  assert.match(invitation, /href="#contact"/);
  assert.match(invitation, /reach out/);
  assert.match(invitation, /I&apos;m always happy to make new friends\./);
  assert.doesNotMatch(invitation, /<button|mailto:/);
  assert.match(page, /<footer[^>]*id="contact"[^>]*tabIndex=\{-1\}/);
});

test("the archive strip appears once between the opening line and welcome", () => {
  const opening = intro.indexOf("Most of the things I care about");
  const archive = intro.indexOf("<ArchivePreview />");
  const welcome = intro.indexOf("Hi, I&apos;m Kar.");

  assert.ok(opening < archive && archive < welcome);
  assert.equal(page.match(/<ArchivePreview \/>/g)?.length, 1);
});
