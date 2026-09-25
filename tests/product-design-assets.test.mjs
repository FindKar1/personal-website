import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const assets = JSON.parse(await readFile(path.join(root, "app/product-design-assets.json"), "utf8"));

test("the Labs opening uses the approved narrative without changing the page intro", async () => {
  const source = await readFile(path.join(root, "components/ProductDesign.tsx"), "utf8");
  const opening = source.slice(source.indexOf('<ChapterHeader number="01"'), source.indexOf('<div className={styles.demo}>'));
  const paragraphs = [
    "We brought together a team of ML researchers, data scientists, and operators. Bytespace Labs became the banner for that work. A way to bring different kinds of expertise into the same conversation.",
    "AI was finding its way into almost every industry, and we thought scientific research was one of the most interesting places it could go next.",
    "Giving researchers access to powerful models was one layer. But what about the data those models would work with? How would researchers set up and run computational experiments? Where would the compute come from, and who would manage the infrastructure underneath it all?",
    "We wanted a workspace where people could turn questions into experiments without building the infrastructure themselves.",
  ];
  assert.deepEqual([...opening.matchAll(/<p>(.*?)<\/p>/g)].map(match => match[1]), paragraphs);
  assert.doesNotMatch(source, /<p>\{children\}<\/p>/);
  assert.doesNotMatch(source, /A scientific identity shared with Bytespace Labs/);
  assert.match(source, /<p className=\{styles.intro\}>I like the part of building where an idea starts to feel like something you can actually use\. The interface, the way things move, the little details that give it personality\. This is a collection of that work: research tools, browser automations, and the characters and visual worlds that grew around them\.<\/p>/);
});

test("the healthcare artwork follows the demo without the deferred narrative passages", async () => {
  const source = await readFile(path.join(root, "components/ProductDesign.tsx"), "utf8");
  const start = source.indexOf('<div id="labs-healthcare"');
  const end = source.indexOf('<HealthcareAnimations />', start);
  const narrative = source.slice(start, end);
  assert.ok(start > source.indexOf('title="bot0 interactive product showcase"') && start < end);
  assert.doesNotMatch(source, /Interactive archive \/ No live compute/);
  assert.doesNotMatch(narrative, /<p>/);
  const deferred = [
    "Working with hospitals made us realize how much work came before AI. Some of the clinical notes we received from Guatemala were handwritten. The knowledge was there, but getting it into a form a system could reliably use was another problem.",
    "We explored OCR to turn those notes into text. Once we saw the datasets, though, we realized some of the handwriting was difficult even for people to decipher. This wasn't going to be a straightforward scanning project.",
    "Before we could think about what a model might do with the information, we had to figure out how to capture it accurately in the first place.",
    "We also noticed how casually people were choosing AI tools. A recommendation from a friend. An impressive demo on X. But once those tools entered real workflows, the results were mixed. How would people know whether a tool would actually help?",
    "It felt like a question too few people were asking.",
    "That got us thinking about a baseline. A set of real tasks with reviewed results that an AI-augmented system could be tested against. The same benchmark could be used before switching to a newer or more powerful model. Newer didn't automatically mean better for the work.",
    "We didn't get far enough with the hospitals to put that evaluation process into practice. But the question stayed with us. How do you improve a system if you haven't established what a good result looks like?",
  ];
  for (const paragraph of deferred) assert.ok(!source.replaceAll("&apos;", "'").includes(paragraph));
  const artwork = narrative.indexOf('artwork("labs-healthcare", { caption: false })');
  assert.ok(artwork >= 0);
  assert.equal([...source.matchAll(/artwork\("labs-healthcare",/g)].length, 1);
  assert.match(source, /"labs-healthcare": \["Bytespace Healthcare"\]/);
  assert.doesNotMatch(source, /Bytespace Healthcare \/ Brand artwork|The original healthcare website composition|not a photograph of a hospital deployment/);
  const prepare = await readFile(path.join(root, "scripts/prepare-product-designs.mjs"), "utf8");
  assert.match(prepare, /\["labs-healthcare", "landing\/healthcare-narrative-visual.webp"\]/);
  assert.ok(assets["labs-healthcare"].preview.width > 1000);
});

test("removed prose leaves no empty wrappers and undescribed images omit the viewer caption", async () => {
  const css = await readFile(path.join(root, "components/ProductDesign.module.css"), "utf8");
  const source = await readFile(path.join(root, "components/ProductDesign.tsx"), "utf8");
  assert.doesNotMatch(css, /\.narrativeCopy|\.ownershipNarrative/);
  assert.doesNotMatch(source, /styles.narrativeCopy|styles.ownershipNarrative|id="bot0-layers"/);
  assert.match(source, /aria-describedby=\{activeInfo\?\.\[1\] \? "product-art-detail" : undefined\}/);
  assert.match(source, /\{activeInfo\[1\] && <p id="product-art-detail"/);
});

test("every product artwork has valid local preview and full-size dimensions", async () => {
  for (const [id, versions] of Object.entries(assets)) {
    for (const variant of ["preview", "full"]) {
      const image = versions[variant];
      assert.ok(image.src.startsWith("/media/product/"), id);
      const metadata = await sharp(path.join(root, "public", image.src)).metadata();
      assert.equal(metadata.width, image.width, `${id} ${variant} width`);
      assert.equal(metadata.height, image.height, `${id} ${variant} height`);
      assert.equal(metadata.format, "webp");
      assert.ok(image.width <= (variant === "preview" ? 1440 : 2800));
    }
  }
});

test("freestanding artwork keeps its transparency", async () => {
  for (const id of ["bot-octopus", "labs-statue", "agent-world", "agent-world-light", "worlds", "world-landscape", "portal-space", "portal-energy", "portal-garden", "portal-gateway", "desktop-shell", "agent-cursor", "characters", "icon-ai", "icon-control", "character-samurai", "brand-instrument"]) {
    const input = sharp(path.join(root, "public", assets[id].preview.src));
    assert.equal((await input.metadata()).hasAlpha, true, `${id} has an alpha channel`);
    assert.equal((await input.stats()).isOpaque, false, `${id} has no flattened backdrop`);
  }
});

test("the original bot0 bundle is self-contained and network-disabled", async () => {
  const folder = path.join(root, "public/showcases/bot0");
  const html = await readFile(path.join(folder, "index.html"), "utf8");
  assert.match(html, /connect-src 'none'/);
  assert.match(html, /form-action 'none'/);
  assert.match(html, /data-theme="light"/);
  for (const file of ["demo.js", "demo.css", "protein-fold.webp", "bot0-logo.png", "bytespace-labs-mark.svg", "bytespace-team-profile.webp"]) {
    assert.ok((await stat(path.join(folder, file))).size > 0, file);
  }
  const provenance = JSON.parse(await readFile(path.join(folder, "provenance.json"), "utf8"));
  assert.equal(provenance.repository, "https://github.com/FindKar1/portfolio-sites");
  assert.match(provenance.revision, /^[a-f0-9]{40}$/);
  assert.ok(provenance.sourceFiles.includes("packages/desktop/src/components/Terminal/MyModelsPanel.tsx"));
});

test("new wide scene and premium agents retain transparent backgrounds", async () => {
  for (const id of ["agent-world-wide", "character-fire", "character-armor", "character-fairy", "character-einstein"]) {
    const input = sharp(path.join(root, "public", assets[id].preview.src));
    assert.equal((await input.stats()).isOpaque, false, id);
  }
  assert.ok(assets["agent-world-wide"].preview.width > assets["agent-world-wide"].preview.height * 1.5);
});

test("preserved Bytespace UI uses original sources and only local assets", async () => {
  const folder = path.join(root, "public/showcases/bytespace");
  const html = await readFile(path.join(folder, "index.html"), "utf8");
  assert.match(html, /connect-src 'none'/);
  assert.match(html, /form-action 'none'/);
  const provenance = JSON.parse(await readFile(path.join(folder, "provenance.json"), "utf8"));
  assert.equal(provenance.repository, "https://github.com/elnugget/bytespace");
  assert.match(provenance.revision, /^[a-f0-9]{40}$/);
  for (const component of ["AgentGroupsGrid.tsx", "SignInForm.tsx", "ScheduleCalendar.tsx", "AgentExecutionDemo.tsx", "EventTriggersNetwork.tsx"]) {
    assert.ok(provenance.sourceFiles.some(file => file.endsWith(component)), component);
  }
  assert.ok(!provenance.sourceFiles.some(file => /supabase|login\/actions/.test(file)));
  for (const asset of provenance.assets) assert.ok((await stat(path.join(folder, "assets", asset))).size > 0, asset);
  for (const file of ["demo.js", "demo.css"]) assert.ok((await stat(path.join(folder, file))).size > 0);
});

test("the product sequence keeps the intro-aware desktop, demos, and three portals together", async () => {
  const source = await readFile(path.join(root, "components/ProductDesign.tsx"), "utf8");
  const monitor = await readFile(path.join(root, "components/BytespaceMonitor.tsx"), "utf8");
  assert.match(monitor, /muted loop playsInline controls/);
  assert.match(source, /const portals: ImageId\[\] = \["portal-energy", "portal-gateway", "portal-garden"\]/);
  const component = source.slice(source.indexOf("export function ProductDesign"));
  assert.ok(component.indexOf("{children}") > component.indexOf("<BytespaceMonitor />"));
  assert.ok(component.indexOf("{children}") < component.indexOf('id="bytespace-live-title"'));
  assert.match(source, /Chrome Extension/);
});

test("the samurai eye band is backed in gray without flattening the artwork", async () => {
  for (const variant of ["preview", "full"]) {
    const image = sharp(path.join(root, "public", assets["character-samurai"][variant].src));
    const { data } = await image.clone().extract({ left: 198, top: 101, width: 1, height: 1 }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    assert.equal(data[3], 255, `${variant} bridge is opaque`);
    assert.ok(Math.max(...data.subarray(0, 3)) < 90, `${variant} bridge stays dark gray`);
    assert.equal((await image.stats()).isOpaque, false, `${variant} retains its transparent surroundings`);
  }
});

test("all six original UI studies render together without a tabbed shell", async () => {
  const host = await readFile(path.join(root, "components/BytespaceStudies.tsx"), "utf8");
  const entry = await readFile(path.join(root, "scripts/bytespace-showcase/entry.jsx"), "utf8");
  const ids = [...host.matchAll(/id: "(\w+)"/g)].map(match => match[1]);
  assert.deepEqual(ids, ["spaces", "signin", "execution", "triggers", "calendar", "context"]);
  for (const id of ids) assert.ok(entry.includes(`view === "${id}"`), id);
  assert.match(host, /otherStudies\.map/);
  assert.match(host, /styles.runtimeStudies/);
  for (const study of ["workspace", "execution", "triggers", "signin"]) assert.ok(host.includes(`<LiveStudy study={${study}} />`));
  assert.match(host, /index\.html\?view=\$\{study.id\}/);
  assert.doesNotMatch(entry, /role="tab|setView\(/);
});

test("the animated hero is not repeated as static artwork or a gallery slide", async () => {
  const source = await readFile(path.join(root, "components/ProductDesign.tsx"), "utf8");
  assert.doesNotMatch(source, /"agent-world-wide"/);
  assert.match(source, /<BytespaceHero \/>/);
  assert.match(source, /styles.portalGrid/);
  assert.match(source, /aria-label="Bytespace character designs"/);
});

test("live studies remeasure cached content and validate frame messages", async () => {
  const source = await readFile(path.join(root, "components/BytespaceStudies.tsx"), "utf8");
  assert.match(source, /event.origin !== window.location.origin/);
  assert.match(source, /event.source !== frame.current\?\.contentWindow/);
  assert.match(source, /Number.isFinite\(event.data.height\)/);
  assert.match(source, /new ResizeObserver\(measure\)/);
  assert.match(source, /observeContent\(\);/);
  assert.match(source, /onLoad=\{observeContent\}/);
  assert.match(source, /resizeObserver.current\?\.disconnect\(\)/);
});

test("lazy studies reserve their layout and visual demos do not capture page scrolling", async () => {
  const source = await readFile(path.join(root, "components/BytespaceStudies.tsx"), "utf8");
  const css = await readFile(path.join(root, "components/ProductDesign.module.css"), "utf8");
  assert.match(source, /readyState !== "complete" \|\| !content/);
  assert.match(source, /querySelector<HTMLElement>\(`\.study-\$\{study.id\}`\)/);
  assert.match(source, /resizeObserver.current.observe\(content\)/);
  assert.match(source, /if \(measured >= 80\) setHeight/);
  assert.doesNotMatch(source, /Math.max\(80|body.getBoundingClientRect/);
  assert.match(source, /"--study-height": `\$\{study.height\}px`/);
  assert.match(css, /height: var\(--study-height\)/);
  assert.match(css, /container-type: inline-size; overflow-anchor: none/);
  assert.match(css, /@container \(max-width: 380px\)[\s\S]*?\.executionStudy iframe \{ height: 401px/);
  assert.match(css, /\.executionStudy iframe, \.triggerStudy iframe \{ pointer-events: none/);
  assert.match(css, /prefers-reduced-motion: reduce[\s\S]*?\.executionStudy iframe \{ pointer-events: auto/);
});

test("the presentation archive is always visible before the finale and image details remain available", async () => {
  const source = await readFile(path.join(root, "components/ProductDesign.tsx"), "utf8");
  const archive = source.indexOf('<section id="complete-designs"');
  const archiveEnd = source.indexOf("</section>", archive);
  const finale = source.indexOf('artwork("launch-illustration"');
  assert.ok(archive > 0 && archiveEnd < finale);
  assert.match(source.slice(archive, archiveEnd), /posters.map/);
  assert.match(source.slice(archive, archiveEnd), /aria-labelledby="design-archive-title"/);
  assert.match(source.slice(archive, archiveEnd), /<h3 id="design-archive-title">Presentations & design archive<\/h3>/);
  assert.doesNotMatch(source.slice(archive, archiveEnd), /<details|<summary/);
  assert.match(source, /id="product-art-detail"[^>]*>\{activeInfo\[1\]\}/);
  assert.match(source, /characters.map\(id => artwork\(id, \{ surface: styles.characterPortrait, caption: false \}\)\)/);
  assert.doesNotMatch(source, /options.detail|detail: true/);
});

test("the design archive retains its distinct artwork without repeating earlier interfaces and agents", async () => {
  const source = await readFile(path.join(root, "components/ProductDesign.tsx"), "utf8");
  const archive = source.slice(source.indexOf('<section id="complete-designs"'), source.indexOf('artwork("launch-illustration"'));
  for (const id of ["office-process", "early-access"]) {
    assert.ok(archive.includes(`artwork("${id}"`), `${id} remains visible`);
  }
  for (const id of ["product-composition", "shirt-design"]) {
    assert.ok(!archive.includes(`artwork("${id}"`), `${id} moves into the earlier showcase`);
    assert.equal([...source.matchAll(new RegExp(`artwork\\("${id}"`, "g"))].length, 1, `${id} is not duplicated`);
  }
  for (const id of ["workflow-builder", "agent-run", "agent-world", "agent-world-light", "worlds", "desktop-composition"]) {
    assert.ok(!source.includes(`"${id}"`), `${id} is absent from the page and lightbox sequence`);
  }
  assert.doesNotMatch(archive, /artwork\("characters"/);
  assert.match(source, /open\("characters"\)/);
  assert.match(source, /artwork\("agent-run-light"/);
  assert.match(source, /portals.map/);
});

test("the product overview follows the demos at full resolution before the interface details", async () => {
  const source = await readFile(path.join(root, "components/ProductDesign.tsx"), "utf8");
  const css = await readFile(path.join(root, "components/ProductDesign.module.css"), "utf8");
  const overview = source.indexOf('artwork("product-composition"');
  assert.ok(overview > source.indexOf("<BytespaceVideoWall />"));
  assert.ok(overview < source.indexOf("<h3>Inside the extension</h3>"));
  assert.match(source, /artwork\("product-composition", \{ className: styles.productOverview, fullResolution: true \}\)/);
  assert.match(css, /\.productOverview \.artButton \{ aspect-ratio: 2800 \/ 1540/);
  assert.match(css, /@media \(min-width: 1200px\)[\s\S]*?\.productOverview \{ margin-inline: -60px/);
  assert.match(css, /\.explorationsBody \{[^}]*grid-template-columns: minmax\(0, 1fr\)/);
});

test("the matrix graphic sits beside the stacked browser studies with its empty footer cropped", async () => {
  const source = await readFile(path.join(root, "components/ProductDesign.tsx"), "utf8");
  const css = await readFile(path.join(root, "components/ProductDesign.module.css"), "utf8");
  const studies = source.slice(source.indexOf('<div className={styles.browserStudies}>'), source.indexOf('<div className={styles.iconStrip}'));
  for (const id of ["browser-modern", "browser-legacy", "shirt-design"]) assert.ok(studies.includes(`artwork("${id}"`));
  assert.match(css, /\.browserStudies \{[^}]*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(css, /\.browserPair \{[^}]*grid-template-columns: minmax\(0, 1fr\)/);
  assert.match(css, /\.browserGraphic \{ width: min\(100%, 480px\); justify-self: center/);
  assert.match(css, /\.browserGraphic \.artButton \{ aspect-ratio: 2800 \/ 3100/);
  assert.match(css, /@media \(max-width: 700px\)[\s\S]*?\.browserStudies \{ grid-template-columns: minmax\(0, 1fr\)/);
});

test("only product videos opt into compact, accessibly named external links", async () => {
  const portfolio = await readFile(path.join(root, "components/PortfolioVideos.tsx"), "utf8");
  const player = await readFile(path.join(root, "components/YouTubeVideo.tsx"), "utf8");
  const [products, archive] = portfolio.split("export function ArchiveTalks");
  assert.match(products, /productVideos.map[^\n]*compactCaption/);
  assert.doesNotMatch(archive, /compactCaption/);
  assert.doesNotMatch(products, /title: "Bytespace 0[1-4]"/);
  assert.match(player, /compactCaption = false/);
  assert.match(player, /aria-label=\{`Watch \$\{title\} on YouTube \(opens a new tab\)`\}/);
  assert.match(player, /title="Watch on YouTube \(opens a new tab\)"/);
});

test("the closing artwork has no caption and meets only the product page footer", async () => {
  const product = await readFile(path.join(root, "components/ProductDesign.tsx"), "utf8");
  const page = await readFile(path.join(root, "app/page.tsx"), "utf8");
  assert.match(product, /artwork\("launch-illustration", \{[^}]*caption: false, fullResolution: true/);
  assert.match(page, /<footer className=\{`\$\{activeTab === "product" \? "mt-0" : "mt-16"\}/);
});

test("execution replay is in the host heading and accepts only parent-origin messages", async () => {
  const host = await readFile(path.join(root, "components/BytespaceStudies.tsx"), "utf8");
  const entry = await readFile(path.join(root, "scripts/bytespace-showcase/entry.jsx"), "utf8");
  assert.match(host, /aria-label="Replay execution"/);
  assert.match(host, /postMessage\(\{ type: "bytespace:replay" \}, window.location.origin\)/);
  const handler = entry.slice(entry.indexOf("const request = event"), entry.indexOf('window.addEventListener("message", request)'));
  assert.ok(handler.indexOf("event.origin !== window.location.origin || event.source !== window.parent") < handler.indexOf('event.data?.type === "bytespace:replay"'));
  assert.match(handler, /event.data\?\.type === "bytespace:replay" && view === "execution"/);
  assert.match(handler, /setRunning\(true\)/);
  assert.match(handler, /setReplay\(value => value \+ 1\)/);
  assert.doesNotMatch(entry, /execution-toolbar|signin-intro/);
});
