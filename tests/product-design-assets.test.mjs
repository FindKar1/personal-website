import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const assets = JSON.parse(await readFile(path.join(root, "app/product-design-assets.json"), "utf8"));

test("the personal page intro leads into bot0 and cmd0 without a Labs chapter", async () => {
  const source = await readFile(path.join(root, "components/ProductDesign.tsx"), "utf8");
  const botStart = source.indexOf('<section id="bot0"');
  const cmdStart = source.indexOf('<section id="product-design"');
  assert.ok(botStart > 0 && botStart < cmdStart);
  const bot = source.slice(botStart, cmdStart);
  const cmd = source.slice(cmdStart);
  assert.match(bot, /<ChapterHeader number="01" id="bot0" title="bot0"/);
  assert.match(cmd, /<ChapterHeader number="02" id="product-design" title="cmd0" category="Bytespace Chrome Extension"/);
  assert.equal([...source.matchAll(/<ChapterHeader\b/g)].length, 2);
  assert.doesNotMatch(source, /id="bytespace-labs"|href="#bytespace-labs"|"labs-statue"|We brought together a team/);
  assert.match(bot, /images\["bot-octopus"\][\s\S]*bot0 began as a workspace for scientific research\./);
  assert.match(bot, /images\["bot-octopus"\]\.preview\}[^>]*loading="eager"/);
  assert.match(cmd, /Workflows followed defined steps, while AI helped people build them and repair broken selectors when a page changed\./);
  assert.match(cmd, /Giving them faces and personalities made them more approachable/);
  for (const [id, label] of [["bot0", "bot0"], ["product-design", "cmd0"]]) {
    assert.ok(source.includes(`<a href="#${id}">${label}`));
    assert.equal([...source.matchAll(new RegExp(`<section id="${id}"`, "g"))].length, 1);
  }
  assert.doesNotMatch(source, /Bytespace Labs & bot0|Bytespace Labs<br \/>& bot0/);
  assert.doesNotMatch(source, /<p>\{children\}<\/p>/);
  assert.doesNotMatch(source, /A scientific identity shared with Bytespace Labs/);
  const introStart = source.indexOf('<div className={styles.intro}>');
  const navStart = source.indexOf('<nav aria-label="Product and design sections"');
  assert.ok(introStart > 0 && introStart < navStart && navStart < botStart);
  const intro = source.slice(introStart, navStart);
  assert.equal([...intro.matchAll(/<p>/g)].length, 4);
  assert.match(intro, /I love designing products and user experiences\./);
  assert.doesNotMatch(intro, /I fucking love product and design\./);
  assert.match(intro, /<p>A clever idea doesn&apos;t mean much if using it is a pain in the ass\.<\/p>/);
  assert.match(intro, /I can lose hours to the smallest details\./);
  assert.match(intro, /Below are two products from that work\. bot0, an agent workspace originally designed for researchers\. And cmd0, my favorite, a Chrome extension that brings browser automation and world-building together\./);
});

test("bot0 retains the full research triptych separately from its feature illustrations", async () => {
  const source = await readFile(path.join(root, "components/ProductDesign.tsx"), "utf8");
  const bot = source.slice(source.indexOf('<section id="bot0"'), source.indexOf('<section id="product-design"'));
  const intro = bot.indexOf('className={styles.botIntro}');
  const demo = bot.indexOf('className={styles.demo}');
  const features = bot.indexOf('className={styles.botIdentity}');
  const healthcare = bot.indexOf('<HealthcareAnimations />');
  const research = bot.indexOf('className={styles.labStudies}');
  assert.ok(intro >= 0 && intro < demo && demo < features && features < healthcare && healthcare < research);
  assert.equal([...source.matchAll(/className=\{styles.labStudies\}/g)].length, 1);
  assert.match(bot.slice(research), /"labs-biology", "labs-anatomy", "labs-materials"/);
  assert.ok(assets["labs-statue"], "cyborg artwork remains available for future placement");
});

test("healthcare is framed as a later exploration after the bot0 product illustrations", async () => {
  const source = await readFile(path.join(root, "components/ProductDesign.tsx"), "utf8");
  const start = source.indexOf('<div id="labs-healthcare"');
  const end = source.indexOf('<HealthcareAnimations />', start);
  const narrative = source.slice(start, end);
  const identity = source.indexOf('<div className={styles.botIdentity}>');
  assert.ok(identity > source.indexOf('title="bot0 interactive product showcase"') && start > identity && start < end);
  assert.doesNotMatch(source, /Interactive archive \/ No live compute/);
  assert.equal([...narrative.matchAll(/<p\b/g)].length, 1);
  assert.match(narrative, /We later explored how the same foundation might serve hospitals and clinics\./);
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

test("chapter typography is shared and research illustrations span the full content width", async () => {
  const css = await readFile(path.join(root, "components/ProductDesign.module.css"), "utf8");
  assert.match(css, /\.chapterLead \{[^}]*color: var\(--graphite\); font: 400 22px\/1.65 "Hoefler Text", Palatino, Georgia, serif/);
  assert.match(css, /\.chapterHeader h2 \{[^}]*font-size: 56px/);
  assert.doesNotMatch(css, /\.botIntro \.chapterHeader h2/);
  assert.match(css, /\.labStudies \{[^}]*grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/);
  assert.doesNotMatch(css, /\.labStudies \{[^}]*(?:max-width|margin-inline)|\.labIllustration \{[^}]*height:/);
  assert.match(css, /\.labIllustration \{ aspect-ratio: 640 \/ 1137/);
  assert.match(css, /\.labIllustration img \{ width: 100%; height: auto/);
  assert.doesNotMatch(css, /\.scienceIdentity|\.scienceCopy|\.scienceStatement|\.scienceStage|\.statueField/);
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

test("cmd0 keeps its opening and follows with world-building, marketplace, interfaces and origins", async () => {
  const source = await readFile(path.join(root, "components/ProductDesign.tsx"), "utf8");
  const monitor = await readFile(path.join(root, "components/BytespaceMonitor.tsx"), "utf8");
  assert.match(monitor, /muted loop playsInline controls/);
  assert.match(source, /const portals: ImageId\[\] = \["portal-energy", "portal-gateway", "portal-garden"\]/);
  const component = source.slice(source.indexOf("export function ProductDesign"));
  const sequence = [
    "<BytespaceHero />", "<BytespaceMonitor />", "{children}", "<BytespaceVideoWall />",
    'id="bytespace-world"', "styles.portalGrid", "styles.characterLineup",
    "<BytespaceMarketplace />", "<BytespaceNodeCatalog />", 'artwork("world-landscape"',
    'id="bytespace-interfaces"', 'artwork("extension-popup"', "<BytespaceStudies />",
    'id="design-evolution"', 'artwork("product-composition"', 'artwork("office-landscape"',
  ].map(value => component.indexOf(value));
  assert.ok(sequence.every((position,index) => position >= 0 && (!index || position > sequence[index-1])));
  assert.equal([...component.matchAll(/styles.portalGrid/g)].length,1);
  assert.equal([...component.matchAll(/styles.characterLineup/g)].length,1);
  assert.match(source, /Chrome Extension/);
});

test("the portals and seven head-scaled agents form separate layered compositions", async () => {
  const source = await readFile(path.join(root, "components/ProductDesign.tsx"), "utf8");
  const css = await readFile(path.join(root, "components/ProductDesign.module.css"), "utf8");
  const lineup = source.match(/const characters: ImageId\[\] = \[([^\]]+)\]/)[1].match(/"[^"]+"/g);
  assert.equal(lineup.length,7);
  assert.equal(lineup[3],'"character-samurai"');
  assert.ok(lineup.includes('"character-pirate"'));
  assert.ok(!lineup.includes('"character-fairy"'));
  assert.match(source,/open\("characters"\)/);
  assert.match(css,/\.portalGrid \{[^}]*isolation: isolate; aspect-ratio: 1\.92/);
  assert.match(css,/\.portalGrid > \.gatewayPortal \{ z-index: 2; top: 0; left: 22%; width: 56%/);
  assert.doesNotMatch(css,/\.gatewayPortal img \{ object-fit: fill/);
  assert.match(css,/\.characterLineup \{[^}]*isolation: isolate; aspect-ratio: 2/);
  assert.match(css,/\.characterLineup > \.artwork \{ position: absolute/);
  for (const id of lineup) {
    assert.ok(css.includes(`[data-artwork=${id}]`), `${id} has an individual placement`);
  }
  assert.match(css,/\[data-artwork="character-samurai"\] \{ z-index: 4; width: 34\.5%/);
  assert.match(css,/\.characterPortrait img \{ width: 100%; height: auto/);
  assert.doesNotMatch(css,/\.characterLineup[^}]*grid-template-columns/);
});

test("agent pairs share foot baselines without stretching their artwork", async () => {
  const css = await readFile(path.join(root, "components/ProductDesign.module.css"), "utf8");
  function placement(id) {
    const rule = css.match(new RegExp(`\\[data-artwork="${id}"\\] \\{([^}]+)\\}`))[1];
    return Object.fromEntries([...rule.matchAll(/(width|left|bottom|top): ([\d.]+)%/g)].map(([,key,value]) => [key,Number(value)]));
  }
  assert.equal(placement("character-ice").bottom, placement("character-fire").bottom);
  assert.equal(placement("character-code").bottom, placement("character-armor").bottom);
  const height = id => placement(id).width * assets[id].preview.height / assets[id].preview.width;
  assert.ok(height("character-armor") > height("character-code"), "armored agent stands taller on the same baseline");
  for (const id of ["character-space", "character-pirate", "character-code", "character-armor", "character-ice", "character-fire", "character-samurai"]) {
    const { width, left, bottom = 0, top = 0 } = placement(id);
    assert.ok(left >= 0 && left + width <= 100, `${id} stays within the horizontal stage`);
    assert.ok(bottom + top + height(id) * 2 <= 100, `${id} stays within the reserved vertical stage`);
  }
});

test("portal separation and layer order survive viewer focus restoration", async () => {
  const css = await readFile(path.join(root, "components/ProductDesign.module.css"), "utf8");
  assert.match(css,/\.portalGrid > \.gatewayPortal \{[^}]*filter: drop-shadow\(/);
  assert.doesNotMatch(css,/\.(?:portalGrid|characterLineup)[^{}]*:focus[^{}]*\{[^}]*z-index/);
  assert.match(css,/\.artButton:focus-visible \{[^}]*outline: 2px solid/);
});

test("the featured pirate uses the original transparent character artwork", async () => {
  const preparation = await readFile(path.join(root, "scripts/prepare-product-designs.mjs"), "utf8");
  assert.match(preparation,/\["character-pirate", "agent_profiles\/Premium\/freedom-fighter\/freedom-fighter-fb.png"\]/);
  for (const variant of ["preview", "full"]) {
    const metadata = await sharp(path.join(root, "public", assets["character-pirate"][variant].src)).metadata();
    assert.equal(metadata.hasAlpha,true);
  }
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

test("all nine original UI studies render together without a tabbed shell", async () => {
  const host = await readFile(path.join(root, "components/BytespaceStudies.tsx"), "utf8");
  const entry = await readFile(path.join(root, "scripts/bytespace-showcase/entry.jsx"), "utf8");
  const ids = [...host.matchAll(/id: "(\w+)"/g)].map(match => match[1]);
  assert.deepEqual(ids, ["spaces", "agents", "analytics", "results", "signin", "execution", "triggers", "calendar", "context"]);
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
  assert.doesNotMatch(source, /"agent-run-light"/);
  assert.match(source, /portals.map/);
});

test("the full-resolution product overview opens Early cmd0 without a duplicate run-view image", async () => {
  const source = await readFile(path.join(root, "components/ProductDesign.tsx"), "utf8");
  const css = await readFile(path.join(root, "components/ProductDesign.module.css"), "utf8");
  const overview = source.indexOf('artwork("product-composition"');
  assert.ok(overview > source.indexOf('id="evolution-title"'));
  assert.ok(overview < source.indexOf('artwork("office-landscape"'));
  assert.doesNotMatch(source, /"agent-run-light"|<h3>Inside the extension<\/h3>/);
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
