import { createRequire } from "node:module";
import { readFile, writeFile, mkdir, copyFile, readdir, unlink } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

if (process.argv.length < 4) throw new Error("Pass the original Bytespace and portfolio-sites checkouts.");
const [sourceRepo, archiveRepo] = process.argv.slice(2).map(value => path.resolve(value));
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const support = path.join(root, "scripts/bytespace-marketplace");
const output = path.join(root, "public/showcases/bytespace-marketplace");
const sourceRoot = path.join(sourceRepo, "src");
const archivePublic = path.join(archiveRepo, "apps/cmd0/public");
const archiveRequire = createRequire(path.join(archiveRepo, "apps/cmd0/package.json"));
const botRequire = createRequire(path.join(archiveRepo, "apps/bot0/package.json"));
const extraRequire = createRequire(path.join(root, "scripts/bytespace-showcase/package.json"));
const marketRequire = createRequire(path.join(support, "package.json"));
const { build } = createRequire(botRequire.resolve("tsx/package.json"))("esbuild");
const ts = archiveRequire("typescript");
const inputs = new Map();
const originalStyles = [];
const assets = new Set(["/fonts/GeneralSans-Variable.woff2", "/landing/marketplace/allAgentsMarketplace.webm", "/landing/demo/quickwindemo.webm"]);
const adapterFile = path.join(support, "adapters.jsx");
const previewFile = path.join(support, "preview.jsx");
const astOf = (source, name) => ts.createSourceFile(name, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
function synthesized(node) { ts.setTextRange(node, { pos: -1, end: -1 }); ts.forEachChild(node, child => { synthesized(child); }); return node; }

function adaptSource(source, filename) {
  const ast = astOf(source, filename);
  const quickwin = filename.endsWith("QuickWinAgentCards.tsx");
  const actionCards = filename.endsWith("ActionCardsGrid.tsx");
  const listing = filename.endsWith("AgentCardBase.tsx");
  const detail = filename.endsWith("CardDetails.tsx");
  const background = filename.endsWith("VideoBackground.tsx");
  const transformed = ts.transform(ast, [context => {
    const f = ts.factory;
    const visit = node => {
      if ((listing || actionCards) && ts.isVariableStatement(node) && node.declarationList.declarations.every(declaration => /^handle(?:Builder|Marketplace)?Mouse(?:Enter|Leave)$/.test(declaration.name.getText(ast)))) return undefined;
      if ((listing || actionCards) && ts.isJsxAttribute(node) && ["onMouseEnter", "onMouseLeave"].includes(node.name.getText(ast))) return undefined;
      if (actionCards && ts.isImportDeclaration(node) && node.moduleSpecifier.text.endsWith("/sampleWorkflowData")) {
        const imports = f.createNamedImports([f.createImportSpecifier(false, f.createIdentifier("landingWorkflowData"), f.createIdentifier("sampleWorkflowData"))]);
        return f.updateImportDeclaration(node, node.modifiers, f.createImportClause(false, undefined, imports), f.createStringLiteral("@/components/marketplace/workflow-preview/landingWorkflowData"), node.attributes);
      }
      if (actionCards && ts.isJsxOpeningElement(node) && node.attributes.getText(ast).includes('relative flex-1 bg-')) {
        return f.updateJsxOpeningElement(node, node.tagName, node.typeArguments, f.createJsxAttributes([...node.attributes.properties, f.createJsxAttribute(f.createIdentifier("inert")), f.createJsxAttribute(f.createIdentifier("aria-hidden"), f.createStringLiteral("true"))]));
      }
      if (actionCards && ts.isJsxExpression(node) && node.getText(ast).startsWith("{!hideMarketplace &&")) return f.createJsxExpression(undefined, f.createNull());
      if (actionCards && ts.isStringLiteral(node) && node.text.startsWith("/landing/marketplace/")) {
        assets.add(node.text);
        return f.createStringLiteral(`/showcases/bytespace-marketplace/assets${node.text}`);
      }
      if (actionCards && ts.isVariableDeclaration(node) && node.name.getText(ast) === "handleBuilderClick") {
        const initializer = synthesized(astOf('const open = () => window.parent.postMessage({ type: "bytespace-marketplace:film", id: "builder" }, location.origin);', 'builder-click.tsx').statements[0].declarationList.declarations[0].initializer);
        return f.updateVariableDeclaration(node, node.name, node.exclamationToken, node.type, initializer);
      }
      if ((ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) && /^https?:/.test(node.text) && URL.canParse(node.text)) {
        const url = new URL(node.text);
        const pathname = url.pathname.replace(/^\/+/, "/");
        if (pathname.startsWith("/agent_profiles/")) {
          const asset = pathname === "/agent_profiles/Core/basic-agent.png" ? "/agent_profiles/Core/bytespace-hat/bytespace-hat.png" : pathname;
          assets.add(asset);
          return f.createStringLiteral(`/showcases/bytespace-marketplace/assets${asset}`);
        }
      }
      if (ts.isImportDeclaration(node) && background && node.moduleSpecifier.text.includes("ScrollTrigger")) return undefined;
      if (ts.isExpressionStatement(node)) {
        const text = node.getText(ast);
        if (/^console\.(log|error|warn)/.test(text)) return undefined;
        if (background && (/^ScrollTrigger\.create/.test(text) || /^gsap\.registerPlugin/.test(text))) return undefined;
        if (quickwin && ts.isCallExpression(node.expression) && node.expression.expression.getText(ast) === "useEffect" && text.includes("fetchDeploymentData")) return undefined;
        if (quickwin && ts.isCallExpression(node.expression) && node.expression.expression.getText(ast) === "useEffect" && text.includes("const shouldPause")) return undefined;
        if (detail && ts.isCallExpression(node.expression) && node.expression.expression.getText(ast) === "useEffect" && text.includes("const animationCycle")) {
          return synthesized(astOf(`useEffect(() => {
            if (!archiveRunning) { setShowBeam(false); return; }
            setShowBeam(false);
            const beam = setTimeout(() => setShowBeam(true), 1300);
            const next = setTimeout(() => setCurrentAnimatedIndex(previous => previous >= Math.min(appsUsed.length - 1, 7) ? 0 : previous + 1), 2300);
            return () => { clearTimeout(beam); clearTimeout(next); };
          }, [currentAnimatedIndex, appsUsed.length, archiveRunning]);`, "effect.tsx").statements[0]);
        }
      }
      // Remove service effects at build time, not only with runtime network blocking.
      if (ts.isIfStatement(node) && /^(id|deploymentId)$/.test(node.expression.getText(ast)) && node.getText(ast).includes("/api/marketplace/increment-run")) return undefined;
      if (quickwin && ts.isVariableDeclaration(node) && node.name.getText(ast) === "handleOpenRuntimeSidebar") {
        const replacement = synthesized(astOf(`const handler = (url) => openSidebar('agent-detail', {agentId:'website-roast', input:url});`, "handler.tsx").statements[0].declarationList.declarations[0].initializer);
        return f.updateVariableDeclaration(node, node.name, node.exclamationToken, node.type, replacement);
      }
      if (filename.endsWith("WorkflowPreview.tsx")) {
        if (ts.isJsxSelfClosingElement(node) && node.tagName.getText(ast) === "ViewportSetter") return f.createJsxExpression(undefined, f.createNull());
        if (ts.isVariableDeclaration(node) && ["fitToView", "handleFitView"].includes(node.name.getText(ast))) {
          const initializer = synthesized(astOf('const fit = () => fitView({ padding: 0.15, duration: 0 });', 'fit.tsx').statements[0].declarationList.declarations[0].initializer);
          return f.updateVariableDeclaration(node, node.name, node.exclamationToken, node.type, initializer);
        }
      }
      if (filename.endsWith("AgentCardBase.tsx") && ts.isJsxExpression(node) && node.getText(ast).includes("<DropdownMenu>")) return f.createJsxExpression(undefined, f.createNull());
      if (ts.isJsxOpeningElement(node) && node.tagName.getText(ast) === "video" && (detail || quickwin || listing || actionCards)) {
        const keep = node.attributes.properties.filter(attribute => !ts.isJsxAttribute(attribute) || !["autoPlay", "preload", "muted", "playsInline", ...(!detail ? ["loop"] : []), ...(quickwin ? ["poster"] : [])].includes(attribute.name.getText(ast)));
        const props = [f.createJsxAttribute(f.createIdentifier("preload"), f.createStringLiteral("none")), f.createJsxAttribute(f.createIdentifier("muted"), undefined), f.createJsxAttribute(f.createIdentifier("playsInline"), undefined)];
        if (quickwin) props.push(f.createJsxAttribute(f.createIdentifier("poster"), f.createStringLiteral("/showcases/bytespace-marketplace/assets/quickwin-poster.webp")));
        return f.updateJsxOpeningElement(node, node.tagName, node.typeArguments, f.createJsxAttributes([...keep, ...props]));
      }
      if (detail && ts.isJsxElement(node) && node.openingElement.attributes.getText(ast).includes('className="flex items-center cursor-pointer flex-1 min-w-0"')) {
        return synthesized(astOf('const label = <div className="text-xs text-gray-500 flex-1">Illustrative listing</div>;', "label.tsx").statements[0].declarationList.declarations[0].initializer);
      }
      if (detail && ts.isJsxOpeningElement(node) && node.attributes.getText(ast).includes('viewMode ===')) {
        const mode = node.attributes.getText(ast).includes('viewMode === "demo"') ? 'demo' : 'workflow';
        const attributes = astOf(`const panel = <div inert={viewMode !== "${mode}" || isTransitioning} aria-hidden={viewMode !== "${mode}"} />;`, "panel.tsx").statements[0].declarationList.declarations[0].initializer.attributes.properties.map(synthesized);
        return f.updateJsxOpeningElement(node, node.tagName, node.typeArguments, f.createJsxAttributes([...node.attributes.properties, ...attributes]));
      }
      return ts.visitEachChild(node, visit, context);
    };
    return node => ts.visitNode(node, visit);
  }]);
  let result = ts.createPrinter().printFile(transformed.transformed[0]);
  transformed.dispose();
  if (background) result = `import { usePlayback } from ${JSON.stringify(adapterFile)};\n` + result
    .replace('const VideoBackground: React.FC = () => {', 'const VideoBackground = ({ archiveVisible = false }) => {\nconst archiveRunning = usePlayback();')
    .replace('}, []);', `}, []);
      useEffect(() => {
        gsap.getTweensOf(Array.from(containerRef.current?.children ?? [])).forEach(tween => tween.paused(!archiveVisible || !archiveRunning));
      }, [archiveVisible, archiveRunning]);`)
    .replace("objects.forEach(object => object.remove());", "gsap.killTweensOf(objects); objects.forEach(object => object.remove());")
    .replaceAll("window.addEventListener('mousemove'", "container.addEventListener('mousemove'")
    .replaceAll("window.removeEventListener('mousemove'", "container.removeEventListener('mousemove'");
  if (actionCards) {
    result = `import { useArchivePreview } from ${JSON.stringify(previewFile)};\n` + result;
    result = result
      .replace('const hoverVideoEnabled = isToggleMode ? true : showVideoOnHover;', 'const hoverVideoEnabled = false;')
      .replace('const autoplayEnabled = isToggleMode ? false : autoplayVideos;', 'const { started: autoplayEnabled } = useArchivePreview(builderVideoRef, { resetOnLeave: true });')
      .replace('const shouldRenderVideo = hoverVideoEnabled || autoplayEnabled;', 'const shouldRenderVideo = showVideoOnHover || autoplayVideos;')
      .replaceAll('autoplayEnabled', 'archiveStarted')
      .replace('onClick={handleBuilderClick}', 'onClick={handleBuilderClick} aria-label="Open Agent Builder animation" title="Open Agent Builder animation"')
      .replace('Click to Open Agent Builder', 'Agent Builder');
  }
  if (listing) result = `import { useArchivePreview } from ${JSON.stringify(previewFile)};\n` + result
    .replace('const [isHovered, setIsHovered] = useState(false);', 'const { active: isHovered } = useArchivePreview(videoRef, { hoverOnly: true });')
    .replace('const shouldShowMetaRow = !isLandingVariant;', 'const shouldShowMetaRow = false;')
    .replace('className={cardContainerClasses}', 'className={cardContainerClasses} role="button" tabIndex={0} aria-label={`Open ${title}`} onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); handleCardClick(); } }}')
    .replace("muted\n", 'muted preload="none"\n');
  if (detail) {
    result = `import { usePlayback } from ${JSON.stringify(adapterFile)};\n` + result;
    result = result.replace('const [viewMode, setViewMode]', 'const archiveRunning = usePlayback();\nconst [viewMode, setViewMode]')
      .replace('const [showThumbnail, setShowThumbnail] = useState(true);', 'const [showThumbnail, setShowThumbnail] = useState(false);')
      .replace('"h-[calc(100vh-69px)] overflow-y-scroll"', '"archive-details"')
      .replace('startAnimation={currentAnimatedIndex === index && showBeam}', 'startAnimation={archiveRunning && currentAnimatedIndex === index && showBeam}')
      .replace('currentAnimatedIndex === index ?', 'archiveRunning && currentAnimatedIndex === index ?')
      .replace('<span>Run Agent</span>', '<span>Configure inputs</span>')
      .replace('<source src={videoUrl} type="video/mp4"', '<source src={videoUrl} type="video/webm"')
      .replace('controls\n', 'controls muted playsInline preload="none"\n');
  }
  if (filename.endsWith("WorkflowPreview.tsx")) {
    result = `import { ArchiveWorkflowFit } from ${JSON.stringify(path.join(support, "builder-fit.jsx"))};\n` + result;
    result = result
      .replace('zoomOnScroll={!disableInteraction && interactionsEnabled}', 'zoomOnScroll={false}')
      .replace('preventScrolling={!disableInteraction && interactionsEnabled}', 'preventScrolling={false}')
      .replace('fitView={false}', 'fitView fitViewOptions={{ padding: 0.15 }}')
      .replace('<ReactFlowProvider>', '<ReactFlowProvider>{disableInteraction && <ArchiveWorkflowFit />}')
      .replace('className="absolute inset-0 z-20 cursor-pointer"', 'className="absolute inset-0 z-20 cursor-pointer" role="button" tabIndex={0} aria-label="Activate workflow preview" onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setInteractionsEnabled(true); } }}');
  }
  if (filename.endsWith("AgentRunSettings.tsx")) result = result.replace('<span>Run Agent</span>', '<span>Preview output</span>');
  if (quickwin) result = `import { useArchivePreview } from ${JSON.stringify(previewFile)};\n` + result
    .replace('const [electricSpeed, setElectricSpeed] = useState(1);', 'const { active: archiveActive } = useArchivePreview(videoRef, { continuous: true });\nconst electricSpeed = archiveActive ? .2 : 0;')
    .replace('const [electricColor, setElectricColor] = useState("#BE25C1");', 'const electricColor = archiveActive ? "#BE25C1" : "#6b7280";')
    .replace('const [isPaused, setIsPaused] = useState(false);', 'const isPaused = !archiveActive;')
    .replace('ctaText: "Run"', 'ctaText: "Preview"')
    .replace('useState("")', 'useState("https://example.com")')
    .replace('const [isValidUrl, setIsValidUrl] = useState(false);', 'const [isValidUrl, setIsValidUrl] = useState(true);')
    .replace('Get your first taste of how cmd0 agents work by dropping any website url. This agent will analyze it, roast it, and generate a meme that perfectly sums it up.', 'Turn any company website into a meeting-ready brief.')
    .replace('videoRef.current.play();', 'videoRef.current.play().catch(() => {});')
    .replace('placeholder="https://mywebsite.com"', 'aria-label="Website URL" placeholder="https://mywebsite.com"');
  result = result.replaceAll('"/landing/demo/quickwindemo.webm"', '"/showcases/bytespace-marketplace/assets/landing/demo/quickwindemo.webm"');
  inputs.set(filename, result);
  return result;
}

await mkdir(output, { recursive: true });
const built = await build({
  entryPoints: [path.join(support, "entry.jsx")], outdir: output, bundle: true, splitting: true, minify: true,
  platform: "browser", format: "esm", jsx: "automatic", target: ["es2020"], chunkNames: "chunks/[name]-[hash]", metafile: true,
  define: { "process.env.NODE_ENV": '"production"' },
  plugins: [{ name: "archived-marketplace", setup(build) {
    build.onResolve({ filter: /.*/ }, ({ path: name, importer }) => {
      if (["next/image", "next/navigation", "next-themes"].includes(name) || /(?:^|\/)(?:SidebarProvider|favicon-image|cropped-profile-picture|AgentSignupModal)$/.test(name)) return { path: name, namespace: "adapter" };
      if (name.startsWith("@/")) return { path: path.join(sourceRoot, name.slice(2)), namespace: "source-resolution" };
      if (name.includes("public/") && /\.(png|webp)$/.test(name)) {
        const asset = "/" + name.split("public/")[1]; assets.add(asset);
        return { path: asset, namespace: "art" };
      }
      if (importer.includes("node_modules") && !/^react(?:-dom)?(?:\/|$)/.test(name)) return;
      if (!name.startsWith(".") && !path.isAbsolute(name)) {
        try { return { path: archiveRequire.resolve(name) }; }
        catch { try { return { path: extraRequire.resolve(name) }; } catch { return { path: marketRequire.resolve(name) }; } }
      }
    });
    build.onLoad({ filter: /.*/, namespace: "source-resolution" }, async ({ path: base }) => {
      for (const extension of ["", ".tsx", ".ts", "/index.tsx", "/index.ts"]) {
        const filename = base + extension;
        try { return { contents: adaptSource(await readFile(filename, "utf8"), filename), loader: "tsx", resolveDir: path.dirname(filename) }; }
        catch (error) { if (!["ENOENT", "EISDIR"].includes(error.code)) throw error; }
      }
      throw new Error(`Missing source module ${base}`);
    });
    build.onLoad({ filter: /\.[jt]sx?$/ }, async ({ path: filename }) => {
      if (!filename.startsWith(sourceRoot)) return;
      return { contents: adaptSource(await readFile(filename, "utf8"), filename), loader: "tsx", resolveDir: path.dirname(filename) };
    });
    build.onLoad({ filter: /\.css$/ }, async ({ path: filename }) => { originalStyles.push(await readFile(filename, "utf8")); return { contents: "", loader: "js" }; });
    build.onLoad({ filter: /.*/, namespace: "adapter" }, () => ({ contents: `export { default } from ${JSON.stringify(adapterFile)}; export * from ${JSON.stringify(adapterFile)};`, loader: "jsx", resolveDir: support }));
    build.onLoad({ filter: /.*/, namespace: "art" }, ({ path: asset }) => ({ contents: `export default { src: ${JSON.stringify(`/showcases/bytespace-marketplace/assets${asset}`)} };`, loader: "js" }));
  } }],
});

const supportSources = await Promise.all((await readdir(support)).filter(file => /\.[jt]sx?$/.test(file)).map(file => readFile(path.join(support, file), "utf8")));
const colors = Object.fromEntries(["background", "foreground", "border", "input", "ring"].map(name => [name, `hsl(var(--${name}))`]));
for (const name of ["card", "popover", "primary", "secondary", "muted", "accent", "destructive"]) colors[name] = { DEFAULT: `hsl(var(--${name}))`, foreground: `hsl(var(--${name}-foreground))` };
const css = await archiveRequire("postcss")([archiveRequire("tailwindcss")({ content: [...inputs.values(), ...supportSources].map(raw => ({ raw, extension: "tsx" })), darkMode: "class", theme: { extend: { colors } }, plugins: [] })]).process(originalStyles.join("\n") + "\n" + await readFile(path.join(support, "frame.css"), "utf8"), { from: undefined });
await writeFile(path.join(output, "marketplace.css"), css.css);
await copyFile(path.join(support, "index.html"), path.join(output, "index.html"));
const copied = [];
for (const asset of assets) {
  const from = path.join(archivePublic, asset), to = path.join(output, "assets", asset);
  await mkdir(path.dirname(to), { recursive: true });
  if (/\.(png|webp)$/.test(asset) && !asset.startsWith("/landing/marketplace/")) await sharp(from).resize({ width: 100, withoutEnlargement: true }).toFile(to);
  else await copyFile(from, to);
  copied.push({ path: asset, sha256: createHash("sha256").update(await readFile(from)).digest("hex") });
}
await mkdir(path.join(output, "assets/apps"), { recursive: true });
const icons = { linkedin: "/application_logos/linkedin.png", drive: "/landing/app_logos/app-logo-2.png", reddit: "/landing/app_logos/app-logo-10.png", notion: "/landing/app_logos/app-logo-17.png", gmail: "/landing/app_logos/app-logo-19.png", airtable: "/landing/app_logos/app-logo-6.png", calendar: "/landing/app_logos/app-logo-1.png" };
for (const [name, asset] of Object.entries(icons)) {
  await sharp(path.join(archivePublic, asset)).resize({width: 80, height: 80, fit: "inside", withoutEnlargement: true}).png().toFile(path.join(output, "assets/apps", `${name}.png`));
  copied.push({ path: asset, output: `apps/${name}.png`, sha256: createHash("sha256").update(await readFile(path.join(archivePublic, asset))).digest("hex") });
}
for (const [asset, poster] of [["/landing/marketplace/allAgentsMarketplace.webm", "ensemble"], ["/landing/demo/quickwindemo.webm", "quickwin"]]) {
  const frame = execFileSync("ffmpeg", ["-v", "error", "-i", path.join(archivePublic, asset), "-frames:v", "1", "-vf", "scale=800:-1", "-f", "image2pipe", "-c:v", "png", "pipe:1"], { maxBuffer: 8 * 1024 * 1024 });
  await sharp(frame).webp({ quality: 86 }).toFile(path.join(output, "assets", `${poster}-poster.webp`));
}
await writeFile(path.join(output, "provenance.json"), JSON.stringify({
  repository: "https://github.com/elnugget/bytespace", revision: execFileSync("git", ["rev-parse", "HEAD"], { cwd: sourceRepo, encoding: "utf8" }).trim(),
  assetsRepository: "https://github.com/FindKar1/portfolio-sites", assetsRevision: execFileSync("git", ["rev-parse", "HEAD"], { cwd: archiveRepo, encoding: "utf8" }).trim(),
  sourceFiles: [...inputs.keys()].map(filename => path.relative(sourceRepo, filename)), assets: copied,
  adaptations: ["Original marketplace cards, details, input configuration, app beams, PixelBlast, floating logos and electric-border onboarding", "Illustrative listings and outputs; original sample workflow and archived demo footage are not historical listing data", "Account services, API calls, creator metrics and signup removed", "Local asset adapters, compact responsive light layout, keyboard controls", "First-agent film and electric border loop in view; other featured films play once, then hover/focus or tap replay; listings animate on hover/focus only", "Viewport-gated motion and original background scroll trigger removed", "Network connections and form submissions blocked by CSP"],
}, null, 2) + "\n");
console.log(`Built marketplace from ${inputs.size} original source files.`);
const liveChunks = new Set(Object.keys(built.metafile.outputs).map(filename => path.resolve(filename)));
for (const filename of await readdir(path.join(output, "chunks"))) {
  const full = path.join(output, "chunks", filename);
  if (filename.endsWith(".js") && !liveChunks.has(full)) await unlink(full);
}
