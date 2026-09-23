import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import ts from "typescript";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = filename => readFile(path.join(root, filename), "utf8");
const source = await read("lib/bytespace-welcome.ts");
const exported = {};
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true } }).outputText;
new Function("require", "exports", compiled)(createRequire(path.join(root, "lib/bytespace-welcome.ts")), exported);
const { welcomePixels, welcomeLines, welcomeDuration, welcomeTiming, getWelcomeVisit } = exported;

test("original pixel alphabet spells Welcome to Bytespace without substituted glyphs", async () => {
  const original = JSON.parse(await read("lib/bytespace-welcome-patterns.json"));
  assert.equal(original.source.repository, "https://github.com/elnugget/bytespace");
  assert.match(original.source.sha256, /^[a-f0-9]{64}$/);
  assert.deepEqual(original.source.backgroundSources.map(source => source.path), [
    "src/components/magicui/flickering-grid.tsx", "src/components/auth/earlyAccess/AccessCodeCard.tsx",
  ]);
  assert.ok(original.source.backgroundSources.every(source => /^[a-f0-9]{64}$/.test(source.sha256)));
  assert.deepEqual(welcomeLines, ["Welcome", "to", "Bytespace!"]);
  for (const char of welcomeLines.join("").toUpperCase()) {
    const letter = original.letters[char];
    assert.equal(letter.length, 8);
    for (const row of letter) {
      assert.equal(row.length, 8);
      assert.ok(row.every(value => value === 0 || value === 1));
    }
  }
  const expectedPixels = welcomeLines.join("").toUpperCase().split("").reduce((count, char) => count + original.letters[char].flat().filter(Boolean).length, 0);
  assert.equal(welcomePixels.length, expectedPixels);
  assert.equal(new Set(welcomePixels.map(pixel => `${pixel.row}:${pixel.col}`)).size, expectedPixels);
  assert.ok(welcomePixels.every(pixel => pixel.row >= 45 && pixel.row <= 71 && pixel.col >= 0 && pixel.col < 120));
});

test("signup timing retains the progressive reveal, hold, and single exit", () => {
  assert.deepEqual(welcomeTiming, { reveal: 2600, mountDelay: 100, pixelFade: 100, hold: 1400, exit: 500 });
  assert.equal(welcomeDuration, 4500);
});

test("progress survives remounts within the document, but not a fresh page visit", () => {
  const document = {};
  const first = getWelcomeVisit(document);
  first.elapsed = 1234;
  assert.equal(getWelcomeVisit(document).elapsed, 1234);
  first.complete = true;
  assert.equal(getWelcomeVisit(document).complete, true);
  assert.deepEqual(getWelcomeVisit({}), { elapsed: 0, complete: false });
});

test("only the welcome exit releases playback; a video loop cannot restart the intro", async () => {
  const component = await read("components/BytespaceMonitor.tsx");
  assert.match(component, /if \(event.target === intro\) showDemo\(\)/);
  assert.match(component, /visit.complete = true/);
  assert.match(component, /element.dataset.phase = "demo"/);
  assert.match(component, /if \(active && !preference.matches\)/);
  assert.match(component, /entry.intersectionRatio >= 0.6/);
  assert.match(component, /!document.hidden/);
  assert.match(component, /muted loop playsInline controls/);
  assert.ok(!component.includes("autoPlay"));
  assert.ok(!component.includes("onEnded") && !component.includes('"ended"'));
  assert.match(component, /visit.elapsed = Number\(exit\?\.currentTime/);
  assert.match(component, /animation.currentTime = visit.elapsed/);
  assert.match(component, /removeEventListener\("animationend"/);
});

test("intro uses green lettering over a dark grid and black video letterboxing", async () => {
  const css = await read("components/BytespaceMonitor.module.css");
  assert.match(css, /background: #22c55e/);
  assert.match(css, /\.screen \{[^}]*background: #000/);
  assert.match(css, /\.screen video \{[^}]*object-fit: contain; background: #000/);
  assert.match(css, /\.welcome \{[^}]*background: #000/);
  assert.match(css, /\.background \{[^}]*position: absolute; inset: 0/);
  assert.ok(!css.includes("#fff"));
  assert.match(css, /repeat\(120, 1fr\)/);
  assert.match(css, /both paused/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /\[data-phase="demo"\] \.welcome \{ display: none/);
  const component = await read("components/BytespaceMonitor.tsx");
  assert.match(component, /<canvas[^>]*aria-hidden="true"/);
  assert.match(component, /grid\?\.setRunning\(active && !visit.complete && !preference.matches\)/);
  assert.match(component, /visit.complete = true;\s*grid\?\.destroy\(\)/);
  assert.match(component, /observer.disconnect\(\);\s*grid\?\.destroy\(\)/);
});
