import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

const require = createRequire(import.meta.url);
const source = await readFile(new URL("../components/PortfolioCollection.tsx", import.meta.url), "utf8");
const compiled = { exports: {} };
// Transpile the existing client component for server-rendered presentation checks.
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, esModuleInterop: true },
});
new Function("require", "module", "exports", outputText)(
  id => require(id.startsWith("@/") ? fileURLToPath(new URL(`../${id.slice(2)}`, import.meta.url)) : id),
  compiled,
  compiled.exports,
);
const markup = renderToStaticMarkup(createElement(compiled.exports.PortfolioCollection, { collection: "systems" }));

test("Systems keeps one introduction and only section-level qualification labels", () => {
  assert.equal(markup.match(/help but see everything as systems, processes, and procedures\./g)?.length, 1);
  assert.doesNotMatch(markup, /I tend to see businesses as systems:|I design systems first|Map the organization, decide what needs to change/);
  assert.equal(markup.match(/Healthcare \/ Anonymized proposals/g)?.length, 1);
  assert.equal(markup.match(/Conceptual architecture/g)?.length, 1);
  assert.doesNotMatch(markup, />Source document\s|>Methodology<|>Proposed workflow</);
});

test("Systems introduces the personal habit, onboarding example, and feedback in separate paragraphs", () => {
  const intro = markup.match(/<div class="max-w-4xl space-y-4 text-base leading-7 text-graphite">([\s\S]*?)<\/div>/)?.[1];
  assert.ok(intro);
  const paragraphs = [...intro.matchAll(/<p>([\s\S]*?)<\/p>/g)].map(match => match[1]);
  assert.equal(paragraphs.length, 4);
  assert.match(paragraphs[1], /My morning routine\. The way I set up my desk\./);
  assert.match(paragraphs[2], /Bringing a new customer onboard is one process within it\./);
  assert.match(paragraphs[2], /People might handle some steps\. Software might handle others\./);
  assert.match(paragraphs[3], /Look at the results and adjust\./);
  assert.match(paragraphs[3], /just as much as designing the thing in the first place\.$/);
  assert.doesNotMatch(intro, /These are some of the frameworks/);
});

test("all Systems diagrams remain accessible without duplicate slide titles", () => {
  assert.equal(markup.match(/aria-label="Enlarge /g)?.length, 22);
  assert.doesNotMatch(markup, />Process Overview<\/p>|>Revenue Machine<\/p>|>Reporting<\/p>/);
  assert.match(markup, /aria-label="Enlarge Process Overview"/);
});

test("the opener, revenue overview, and architecture diagrams retain full-width layouts", () => {
  const figures = markup.match(/<figure\b[\s\S]*?<\/figure>/g);
  for (const title of ["Building Agile Organizations", "Revenue Machine", "Agent operating model", "People, agents, and oversight", "Research workflow", "Shared memory"]) {
    const figure = figures.find(item => item.includes(`aria-label="Enlarge ${title}"`));
    assert.ok(figure, title);
    assert.match(figure, /^<figure class="col-span-full min-w-0">/, title);
  }
});

test("Business systems opens with the illustrated cover and moves from people to execution", () => {
  const business = markup.slice(markup.indexOf('<section id="business-systems"'), markup.indexOf('<section id="workflow-planning"'));
  assert.deepEqual([...business.matchAll(/aria-label="Enlarge ([^"]+)"/g)].map(match => match[1]), [
    "Building Agile Organizations", "Role Fundamentals", "Organizational Structure",
    "Process Overview", "Systems, Processes &amp; Procedures", "Revenue Machine", "Marketing", "Sales",
    "Lead to Customer Transition", "Optimizing Tech Stack", "Implementation", "Agile Execution", "Reporting",
  ]);
  assert.match(business, /src="\/media\/systems\/business-systems-cover.webp"/);
  assert.ok(business.indexOf('Enlarge Building Agile Organizations') < business.indexOf("Before I map an organization"));
  assert.ok(business.indexOf("Before I map an organization") < business.indexOf('Enlarge Role Fundamentals'));
  assert.equal(business.match(/Before I map an organization/g)?.length, 1);
  assert.doesNotMatch(business, />Building Agile Organizations<\/p>/);
});

test("supporting business slides use compact paired layouts", () => {
  const figures = markup.match(/<figure\b[\s\S]*?<\/figure>/g);
  for (const title of ["Role Fundamentals", "Organizational Structure", "Process Overview", "Systems, Processes &amp; Procedures", "Optimizing Tech Stack", "Implementation", "Agile Execution", "Reporting"]) {
    const figure = figures.find(item => item.includes(`aria-label="Enlarge ${title}"`));
    assert.ok(figure, title);
    assert.match(figure, /^<figure class="min-w-0">/, title);
  }
  assert.match(source, /grid items-start gap-x-5 gap-y-6 sm:grid-cols-2/);
});

test("the Bytespace org chart is removed from the gallery but its asset is preserved", async () => {
  assert.doesNotMatch(markup, /Bytespace org chart|bytespace-org-chart\.webp/);
  assert.doesNotMatch(source, /id: "bytespace-org-chart"/);
  const assets = JSON.parse(await readFile(new URL("../app/systems-assets.json", import.meta.url), "utf8"));
  const asset = assets["bytespace-org-chart"];
  assert.ok(asset);
  assert.ok((await stat(new URL(`../public${asset.src}`, import.meta.url))).size > 0);
});

test("Systems lightbox follows the page order instead of the old artifact order", () => {
  assert.match(source, /collectionSections\.flatMap\(\(section\) => section\.items\.map/);
});

test("source downloads and expanded-image context remain available", () => {
  assert.equal(markup.match(/aria-label="Download /g)?.length, 5);
  assert.match(markup, /href="\/documents\/building-agile-organizations.pdf"/);
  assert.match(source, /id="artifact-detail"[^>]*>\{active.detail\}/);
  assert.match(source, /active.document[\s\S]*?Source PDF/);
});

test("About previews two uncropped AI architecture diagrams without extra captions", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const preview = page.match(/function SystemsPreview\(\) \{[\s\S]*?\n\}/)?.[0];
  assert.ok(preview);
  assert.deepEqual([...preview.matchAll(/systemsAssets\["([^"]+)"\]/g)].map(match => match[1]), [
    "human-agent-architecture", "shared-memory",
  ]);
  assert.match(preview, /sm:grid-cols-2/);
  assert.match(preview, /object-contain/);
  assert.match(preview, /href="\/\?tab=systems#ai-architecture"/);
  assert.doesNotMatch(preview, /<p\b|<figcaption\b/);
});
