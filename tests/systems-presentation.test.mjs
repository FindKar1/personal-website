import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
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
  assert.match(markup, /I tend to see businesses as systems:/);
  assert.doesNotMatch(markup, /I design systems first|Map the organization, decide what needs to change/);
  assert.equal(markup.match(/Healthcare \/ Anonymized proposals/g)?.length, 1);
  assert.equal(markup.match(/Conceptual architecture/g)?.length, 1);
  assert.doesNotMatch(markup, />Source document\s|>Methodology<|>Proposed workflow</);
});

test("all Systems diagrams remain accessible without duplicate slide titles", () => {
  assert.equal(markup.match(/aria-label="Enlarge /g)?.length, 22);
  assert.doesNotMatch(markup, />Process Overview<\/p>|>Revenue Machine<\/p>|>Reporting<\/p>/);
  assert.match(markup, /aria-label="Enlarge Process Overview"/);
});

test("organization and architecture diagrams have full-width layouts", () => {
  const figures = markup.match(/<figure\b[\s\S]*?<\/figure>/g);
  for (const title of ["Bytespace org chart", "Agent operating model", "People, agents, and oversight", "Research workflow", "Shared memory"]) {
    const figure = figures.find(item => item.includes(`aria-label="Enlarge ${title}"`));
    assert.ok(figure, title);
    assert.match(figure, /^<figure class="col-span-full min-w-0">/, title);
  }
});

test("source downloads and expanded-image context remain available", () => {
  assert.equal(markup.match(/aria-label="Download /g)?.length, 5);
  assert.match(markup, /href="\/documents\/building-agile-organizations.pdf"/);
  assert.match(source, /id="artifact-detail"[^>]*>\{active.detail\}/);
  assert.match(source, /active.document[\s\S]*?Source PDF/);
  assert.match(source, /Dashed roles show planned hires, not filled positions/);
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
