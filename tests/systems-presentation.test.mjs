import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";
import sharp from "sharp";

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
  assert.equal(markup.match(/Anonymized proposals/g)?.length, 1);
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
  assert.equal(markup.match(/aria-label="Enlarge /g)?.length, 28);
  assert.doesNotMatch(markup, /<figcaption\b/);
  assert.match(markup, /aria-label="Enlarge Process Overview"/);
});

test("Systems keeps the personal opening together and introduces the business example after its cover on mobile", () => {
  assert.equal(markup.match(/My morning routine/g)?.length, 1);
  assert.ok(markup.indexOf("My morning routine") < markup.indexOf('<nav aria-label="Systems sections"'));
  assert.match(markup, /class="hidden space-y-4 sm:block"><p>For a business/);
  const business = markup.slice(markup.indexOf('<section id="business-systems"'), markup.indexOf('<section id="ai-architecture"'));
  assert.doesNotMatch(business, /My morning routine/);
  assert.ok(business.indexOf('Enlarge Building Agile Organizations') < business.indexOf("For a business"));
  assert.ok(business.indexOf("For a business") < business.indexOf('id="structure-responsibility"'));
  assert.match(business, /class="mb-10 space-y-4 text-base leading-7 text-graphite sm:hidden"><p>For a business/);
  assert.equal(business.match(/aria-label="Enlarge Building Agile Organizations"/g)?.length, 1);
});

test("Product and Design retains its artifact captions", () => {
  const productMarkup = renderToStaticMarkup(createElement(compiled.exports.PortfolioCollection, { collection: "product" }));
  assert.match(productMarkup, /<figcaption\b/);
  assert.match(productMarkup, />A workspace for automated teams<\/p>/);
  assert.match(productMarkup, />Product design artifact<\/p>/);
});

test("chapter anchors and healthcare overviews have full-width layouts", () => {
  const figures = markup.match(/<figure\b[\s\S]*?<\/figure>/g);
  for (const title of ["Building Agile Organizations", "Role Fundamentals", "Revenue Machine", "Reporting", "People, agents, and oversight", "From disconnected tools to a shared system", "A shared data foundation", "The full patient lifecycle", "Improving the system over time"]) {
    const figure = figures.find(item => item.includes(`aria-label="Enlarge ${title}"`));
    assert.ok(figure, title);
    assert.match(figure, /^<figure class="col-span-full min-w-0">/, title);
  }
});

test("Business systems opens with the illustrated cover and moves from people to execution", () => {
  const business = markup.slice(markup.indexOf('<section id="business-systems"'), markup.indexOf('<section id="ai-architecture"'));
  assert.deepEqual([...business.matchAll(/aria-label="Enlarge ([^"]+)"/g)].map(match => match[1]), [
    "Building Agile Organizations", "Role Fundamentals", "Organizational Structure", "Optimizing Tech Stack",
    "Process Overview", "Systems, Processes &amp; Procedures", "Revenue Machine", "Marketing", "Sales",
    "Lead to Customer Transition", "Implementation", "Agile Execution", "Reporting",
  ]);
  assert.match(business, /src="\/media\/systems\/business-systems-cover.webp"/);
  assert.ok(business.indexOf('Enlarge Building Agile Organizations') < business.indexOf("Before I map an organization"));
  assert.ok(business.indexOf("Before I map an organization") < business.indexOf('Enlarge Role Fundamentals'));
  assert.equal(business.match(/Before I map an organization/g)?.length, 1);
  assert.doesNotMatch(business, />Building Agile Organizations<\/p>/);
});

test("supporting business slides stay paired around the chapter anchors", () => {
  const figures = markup.match(/<figure\b[\s\S]*?<\/figure>/g);
  for (const title of ["Organizational Structure", "Process Overview", "Systems, Processes &amp; Procedures", "Optimizing Tech Stack", "Implementation", "Agile Execution"]) {
    const figure = figures.find(item => item.includes(`aria-label="Enlarge ${title}"`));
    assert.ok(figure, title);
    assert.match(figure, /^<figure class="min-w-0">/, title);
  }
  assert.match(source, /grid items-start gap-x-5 gap-y-6 sm:grid-cols-2/);
});

test("business systems has three chapters with concise transitions in reading order", () => {
  const business = markup.slice(markup.indexOf('<section id="business-systems"'), markup.indexOf('<section id="ai-architecture"'));
  const headings = [...business.matchAll(/<h4\b[^>]*><span[^>]*>\d+<\/span>([^<]+)<\/h4>/g)].map(match => match[1]);
  assert.deepEqual(headings, ["People &amp; work", "A system in practice", "Making it work"]);
  assert.doesNotMatch(business, /Mapping the work|People &amp; responsibility/);
  assert.equal(business.match(/Then I map how work actually moves\./g)?.length, 1);
  assert.ok(business.indexOf('Enlarge Role Fundamentals') < business.indexOf('id="the-method"'));
  assert.ok(business.indexOf('id="the-method"') < business.indexOf('Enlarge Organizational Structure'));
  assert.match(business, /Once the pieces are mapped, I look at how they work together\./);
  assert.match(business, /Revenue is the example here\. The same approach applies to hiring, product development, or any other part of the business\./);
  assert.ok(business.indexOf('Once the pieces are mapped') < business.indexOf('Revenue is the example here'));
  assert.ok(business.indexOf('Revenue is the example here') < business.indexOf('Enlarge Revenue Machine'));
  assert.doesNotMatch(business, /A sale isn/);
  assert.ok(business.indexOf('This is where ownership and handoffs') < business.indexOf('Enlarge Implementation'));
  assert.match(business, /The reporting should tell us where the process needs attention/);
});

test("Systems moves from business to AI to healthcare in the page and section navigation", () => {
  const ids = ["business-systems", "ai-architecture", "workflow-planning"];
  for (let index = 1; index < ids.length; index++) {
    assert.ok(markup.indexOf(`<section id="${ids[index - 1]}"`) < markup.indexOf(`<section id="${ids[index]}"`));
    assert.ok(markup.indexOf(`href="#${ids[index - 1]}"`) < markup.indexOf(`href="#${ids[index]}"`));
  }
  assert.equal(markup.match(/>Healthcare systems</g)?.length, 2);
  assert.doesNotMatch(markup, /Workflows &amp; delivery/);
});

test("AI architecture moves from oversight through workflows to memory and feedback", () => {
  const ai = markup.slice(markup.indexOf('<section id="ai-architecture"'), markup.indexOf('<section id="workflow-planning"'));
  assert.deepEqual([...ai.matchAll(/aria-label="Enlarge ([^"]+)"/g)].map(match => match[1]), [
    "People, agents, and oversight", "Agent operating model", "Growth Engine", "Research workflow",
    "Historical Comparison Skill", "Shared memory", "Observability &amp; Analytics Layer",
  ]);
  assert.match(ai, /When does a person need to step in\?/);
  assert.match(ai, /<p>We designed around those questions\. Clear responsibilities, shared context, and human oversight built into the architecture\.<\/p>/);
  assert.doesNotMatch(ai, /These studies explore/);
  assert.match(ai, /lg:grid-cols-2/);
  const figures = ai.match(/<figure\b[\s\S]*?<\/figure>/g);
  assert.equal(figures.length, 7);
  for (const figure of figures.slice(1)) assert.match(figure, /^<figure class="min-w-0">/);
  assert.doesNotMatch(ai, /<p[^>]*>Growth Engine<\/p>|<p[^>]*>Historical Comparison Skill<\/p>/);
});

test("healthcare starts with connected tools and data, then workflows and optimization", () => {
  const healthcare = markup.slice(markup.indexOf('<section id="workflow-planning"'), markup.indexOf('<section id="full-documents"'));
  assert.deepEqual([...healthcare.matchAll(/aria-label="Enlarge ([^"]+)"/g)].map(match => match[1]), [
    "From disconnected tools to a shared system", "A shared data foundation", "The full patient lifecycle",
    "The patient journey", "The doctor&#x27;s journey", "The revenue cycle", "Marketing and acquisition",
    "Improving the system over time",
  ]);
  assert.match(healthcare, /Our healthcare work focused on connecting scattered tools and information\./);
  assert.match(healthcare, /We mapped how work moved across the organization, then designed a shared data foundation to support it\./);
  assert.match(healthcare, /Healthcare is the example here\. The same approach applies across industries\./);
  assert.match(healthcare, /Start with the people doing the work, map how the pieces connect, and design around what they need\./);
  assert.doesNotMatch(healthcare, /Healthcare made those connections|These proposals map/);
  assert.match(healthcare, /Anonymized proposals/);
  assert.doesNotMatch(healthcare, /<p[^>]*>A shared data foundation<\/p>|<p[^>]*>Improving the system over time<\/p>/);
});

test("new diagram assets match their dimensions and retain the correct public PDF references", async () => {
  const assets = JSON.parse(await readFile(new URL("../app/systems-assets.json", import.meta.url), "utf8"));
  const excerpts = [
    ["growth-engine", "ai-operating-architecture.pdf", 6],
    ["historical-comparison", "ai-operating-architecture.pdf", 8],
    ["observability-analytics", "ai-operating-architecture.pdf", 9],
    ["connected-healthcare", "bytespace-overview.pdf", 9],
    ["healthcare-data-foundation", "bytespace-overview.pdf", 11],
    ["system-optimization", "bytespace-overview.pdf", 17],
  ];
  for (const [id, document, page] of excerpts) {
    const asset = assets[id];
    assert.ok(asset, id);
    const metadata = await sharp(fileURLToPath(new URL(`../public${asset.src}`, import.meta.url))).metadata();
    assert.equal(asset.width, metadata.width, id);
    assert.equal(asset.height, metadata.height, id);
    assert.ok(asset.width >= 2300, id);
    const entry = source.split("\n").find(line => line.includes(`{ id: "${id}", title:`));
    assert.ok(entry?.includes(`document: "${document}", page: ${page},`), id);
    assert.ok(markup.includes(`src="${asset.src}"`), id);
  }
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
