import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = file => readFile(path.join(root, file), "utf8");
const output = "public/showcases/healthcare-motion";

test("the animations follow the healthcare artwork and lead directly into the four illustrations", async () => {
  const source = await read("components/ProductDesign.tsx");
  const animation = source.indexOf("<HealthcareAnimations />");
  const end = source.indexOf('<div className={styles.botIdentity}>');
  assert.ok(animation > source.indexOf('artwork("labs-healthcare"'));
  assert.ok(animation < end);
  assert.equal(source.slice(animation, end).trim(), "<HealthcareAnimations />");
  const deferred = [
    "Talking with hospitals, clinics, and diagnostic labs raised another question. How could they use better AI without losing control of their data?",
    "These organizations were sitting on years of knowledge. We thought they should be able to put it to work on their own terms. That could mean adapting a model to their needs and running it on their own infrastructure. But finding a suitable open-weight model was only part of the equation. Getting it running reliably meant managing the compute and infrastructure behind it.",
    "The challenge wasn't just technical. People had different levels of familiarity with AI. Few had time to learn another complicated tool. Administrative staff needed everyday tasks to be simpler. Doctors needed support with documentation and clinical decision-making. Leadership needed to understand what was happening across the organization and where money was going.",
    "Engineering teams needed room to build. They had to be able to create new automations and adapt workflows as needs changed. That work needed to feed back into the tools everyone else used. Not become another disconnected system.",
    "That led us to think about bot0 in layers.",
    "One shared workspace, with access shaped around each person's role. It needed to feel straightforward for the people using established workflows while giving the people building them deeper control.",
  ];
  for (const paragraph of deferred) assert.ok(!source.replaceAll("&apos;", "'").includes(paragraph));
});

test("the original animation source and unchanged pixel asset have recorded provenance", async () => {
  const provenance = JSON.parse(await read(`${output}/provenance.json`));
  assert.equal(provenance.repository, "https://github.com/FindKar1/portfolio-sites");
  assert.match(provenance.revision, /^[a-f0-9]{40}$/);
  for (const name of ["Hero.tsx", "HeroChipScene.tsx", "pixelated-canvas.tsx"]) {
    assert.ok(provenance.sourceFiles.some(file => file.path.endsWith(`/${name}`) && /^[a-f0-9]{64}$/.test(file.sha256)));
  }
  for (const asset of provenance.assets) {
    const bytes = await readFile(path.join(root, output, asset.output));
    assert.equal(createHash("sha256").update(bytes).digest("hex"), asset.sha256);
  }
  const build = await read("scripts/build-healthcare-motion.mjs");
  assert.match(build, /original.slice\(0, scene.getStart\(ast\)\) \+ wrapper \+ original.slice\(scene.end\)/);
});

test("bundled animations are local and pixels do not load the 3D bundle", async () => {
  const html = await read(`${output}/index.html`);
  assert.match(html, /connect-src 'none'/);
  assert.match(html, /form-action 'none'/);
  const entry = await read("scripts/healthcare-motion/entry.jsx");
  assert.match(entry, /lazy\(\(\) => import\("\.\/pixels.jsx"\)\)/);
  assert.match(entry, /lazy\(\(\) => import\("\.\/morph.jsx"\)\)/);
  const files = await readdir(path.join(root, output));
  assert.ok(files.some(file => /^pixels-.*\.js$/.test(file)));
  assert.ok(files.some(file => /^morph-.*\.js$/.test(file)));
  for (const file of files.filter(file => file.endsWith(".js"))) {
    const contents = await read(`${output}/${file}`);
    for (const match of contents.matchAll(/(?:from|import\()\s*["'](\.\/[^"']+\.js)["']/g)) {
      assert.ok((await stat(path.join(root, output, match[1]))).size > 0);
    }
  }
});

test("each scene pauses independently and validates parent/frame message identity", async () => {
  const host = await read("components/HealthcareAnimations.tsx");
  const entry = await read("scripts/healthcare-motion/entry.jsx");
  for (const source of [host, entry]) {
    assert.match(source, /event.origin !== window.location.origin/);
    assert.match(source, /event.source !==/);
    assert.match(source, /visibilitychange/);
    assert.match(source, /removeEventListener\("message"/);
  }
  assert.match(host, /new IntersectionObserver/);
  assert.match(host, /loaded && <iframe/);
  assert.match(host, /<HealthcareScene scene="pixels"/);
  assert.match(host, /<HealthcareScene scene="morph"/);
  assert.match(entry, /typeof event.data.visible !== "boolean"/);
});

test("reduced motion keeps static rendering and the scene no longer depends on page scroll", async () => {
  const entry = await read("scripts/healthcare-motion/entry.jsx");
  const wrapper = await read("scripts/healthcare-motion/scene-wrapper.tsx.txt");
  const pixels = await read("scripts/healthcare-motion/pixels.jsx");
  assert.match(entry, /prefers-reduced-motion: reduce/);
  assert.match(entry, /preference.addEventListener\("change"/);
  assert.match(wrapper, /active && !reducedMotion \? 'always' : 'demand'/);
  assert.match(wrapper, /<TransistorField[^>]*previewMode="dna"/);
  assert.doesNotMatch(wrapper, /previewMode=\{|'play'|'chip'|<SceneContents/);
  assert.match(wrapper, /position: DNA_CAMERA_POSITION/);
  assert.match(wrapper, /camera.lookAt\(\.\.\.DNA_FRAMING_CENTER\)/);
  const build = await read("scripts/build-healthcare-motion.mjs");
  assert.match(build, /targetGroupPosition.set\(0, 0, 0\)/);
  assert.match(build, /rotation=\{\[0.16, -0.2, -0.16\]\} scale=\{1.22\}/);
  assert.doesNotMatch(wrapper, /window.scrollY|addEventListener\('scroll'|MORPH_FREEZE_SCROLL_Y/);
  assert.match(wrapper, /container.addEventListener\('pointermove'/);
  assert.match(pixels, /interactive=\{active && !reducedMotion\}/);
  assert.match(pixels, /width=\{1100\} height=\{height\}/);
  assert.match(pixels, /new ResizeObserver/);
  assert.match(pixels, /Math.round\(1100 \* height \/ width\)/);
  assert.match(pixels, /observer.disconnect\(\)/);
  assert.match(pixels, /backgroundColor=""/);
});

test("animations share one reserved composition on desktop and mobile without visible captions", async () => {
  const host = await read("components/HealthcareAnimations.tsx");
  const css = await read("components/ProductDesign.module.css");
  assert.doesNotMatch(host, /<h[1-6]|<figcaption|<p>/);
  assert.match(host, /data-scene=\{scene\}/);
  assert.match(css, /\.healthcareAnimations \{[^}]*aspect-ratio: 5 \/ 2/);
  assert.match(css, /\.healthcareScene \{[^}]*position: absolute; inset: 0/);
  assert.doesNotMatch(css, /\.healthcareScene\[data-scene="morph"\]/);
  assert.match(css, /@media \(max-width: 700px\)[\s\S]*?\.healthcareAnimations \{ aspect-ratio: 4 \/ 3/);
});
