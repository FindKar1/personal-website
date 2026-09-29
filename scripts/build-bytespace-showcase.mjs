import { createRequire } from "node:module";
import { readFile, writeFile, mkdir, copyFile, access, readdir, unlink } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { extractAnalytics } from "./bytespace-showcase/extract-analytics.mjs";

if (process.argv.length < 4) throw new Error("Pass elnugget/bytespace and portfolio-sites checkouts.");
const [sourceRepo, archiveRepo] = process.argv.slice(2).map(value => path.resolve(value));
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const support = path.join(root, "scripts/bytespace-showcase");
const output = path.join(root, "public/showcases/bytespace");
const sourceRoot = path.join(sourceRepo, "src");
const archiveApp = path.join(archiveRepo, "apps/cmd0");
const archiveRequire = createRequire(path.join(archiveApp, "package.json"));
const botRequire = createRequire(path.join(archiveRepo, "apps/bot0/package.json"));
const toolRequire = createRequire(botRequire.resolve("tsx/package.json"));
const extraRequire = createRequire(path.join(support, "package.json"));
const { build } = toolRequire("esbuild");
const ts = archiveRequire("typescript");
const postcss = archiveRequire("postcss");
const tailwind = archiveRequire("tailwindcss");
const inputs = new Map();
const originalStyles = [];
const excludedImports = new Set(["@/lib/supabase/browser", "./ActionCardsGrid", "./QuickWinAgentCards", "./SpacesInstructionCard", "./FloatingSelectionPanel"]);
const adapters = new Set(["next/image", "next/link", "next/navigation", "@/components/sidebar/SidebarProvider", "@/contexts/AgentSelectionContext", "@/components/ui/favicon-image", "sonner"]);

function statements(source, filename) { return ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX); }
function variableName(node) { return ts.isVariableStatement(node) ? node.declarationList.declarations[0].name.getText() : ""; }
function adaptSource(source, filename) {
  const ast = statements(source, filename);
  if (filename.endsWith("AgentGroupsGrid.tsx")) {
    // Preserve the original rendering and animated graphs, excluding the service-backed page.
    const end = ast.statements.findIndex(node => variableName(node) === "CreateSpaceCard");
    const renderer = ast.statements.slice(0, end).filter(node => !(ts.isImportDeclaration(node) && excludedImports.has(node.moduleSpecifier.text)) && !["AGENT_GROUPS", "UNGROUPED_AGENTS"].includes(variableName(node))).map(node => node.getFullText(ast)).join("\n");
    const renderedAst = statements(renderer, filename);
    const transformed = ts.transform(renderedAst, [context => {
      const visit = node => {
        const empty = () => ts.isJsxElement(node.parent) || ts.isJsxFragment(node.parent)
          ? ts.factory.createJsxExpression(undefined, ts.factory.createNull())
          : ts.factory.createNull();
        // The showcase always presents every agent, including at narrow widths.
        if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name)) {
          const values = {
            totalPages: ts.factory.createNumericLiteral(1),
            pageItems: ts.factory.createIdentifier("allItems"),
            calculatedAgents: ts.factory.createPropertyAccessExpression(ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier("group"), "agents"), "length"),
          };
          if (values[node.name.text]) return ts.factory.updateVariableDeclaration(node, node.name, node.exclamationToken, node.type, values[node.name.text]);
        }
        // These controls mutate real accounts; omit them in the archive.
        if (ts.isJsxElement(node) && node.openingElement.tagName.getText(renderedAst) === "button" && ((/<Plus\b/.test(node.getText(renderedAst)) && /Add Agent/.test(node.getText(renderedAst))) || /aria-label="Edit space name"/.test(node.getText(renderedAst)))) return empty();
        if (ts.isJsxSelfClosingElement(node) && ["SpaceOptionsMenu", "button"].includes(node.tagName.getText(renderedAst))) return empty();
        const isButton = ts.isJsxElement(node) && node.openingElement.tagName.getText(renderedAst) === "button";
        if (isButton) {
          const label = node.children.filter(ts.isJsxText).map(child => child.text.trim()).join("");
          if (["Table", "Summary"].includes(label)) {
            return ts.factory.createJsxElement(
              ts.factory.createJsxOpeningElement(ts.factory.createIdentifier("span"), undefined, ts.factory.createJsxAttributes([])),
              node.children,
              ts.factory.createJsxClosingElement(ts.factory.createIdentifier("span")));
          }
          return empty();
        }
        return ts.visitEachChild(node, visit, context);
      };
      return node => ts.visitNode(node, visit);
    }]);
    const result = `import { agentExamples } from ${JSON.stringify(path.join(support, "agent-fixtures.mjs"))};\n` + ts.createPrinter().printFile(transformed.transformed[0])
      .replace("const AgentCard", "export const AgentCard")
      .replace("initial={{ opacity: 0 }}", "initial={false}")
      .replace("animate={{ opacity: isCalculating ? 0 : 1 }}", "animate={{ opacity: 1 }}")
      .replace('drag="x"', 'drag={false}')
      .replace("Math.min(actualRows, 3)", "actualRows")
      .replace("totalRows = 1247,", "agentId, totalRows = 1247,")
      .replace("<TablePreview totalRows={totalRows}", "<TablePreview agentId={agentId} totalRows={totalRows}")
      .replace('<div className="h-3 w-12 rounded bg-gray-200 dark:bg-white/[0.08]"/>', '{agentExamples[agentId]?.rows[rowIdx]?.[colIdx] ?? ""}')
      .replaceAll("{col.length > 8 ? `${col.substring(0, 8)}...` : col}", "{col}")
      .replaceAll("isHovered ? 'translate-x-[-8px] opacity-0' : 'translate-x-0 opacity-100'", "'translate-x-0 opacity-100'")
      .replaceAll("repeat(auto-fill, minmax(315px, 1fr))", "repeat(auto-fill, minmax(min(315px, 100%), 1fr))")
      .replaceAll("computedColumns = 3;", "computedColumns = 2;")
      .replaceAll("alert('Table data clicked');", 'window.dispatchEvent(new CustomEvent("showcase-output", { detail: "table" }));')
      .replaceAll("alert('Variable data clicked');", 'window.dispatchEvent(new CustomEvent("showcase-output", { detail: "summary" }));')
      .replaceAll("alert('Fork to Builder clicked');", 'window.dispatchEvent(new CustomEvent("showcase-notice", { detail: "Workflow editing is disconnected in this interface archive." }));');
    transformed.dispose();
    return result;
  }
  if (filename.endsWith("OwnerAgentView.tsx")) return extractAnalytics(ts, source, filename);
  if (filename.endsWith("RunOutputDisplay.tsx")) {
    const transformed = ts.transform(ast, [context => {
      const visit = node => {
        if (ts.isJsxElement(node) && ["button", "DropdownMenu"].includes(node.openingElement.tagName.getText(ast))) return ts.isJsxElement(node.parent) || ts.isJsxFragment(node.parent) ? ts.factory.createJsxExpression(undefined, ts.factory.createNull()) : ts.factory.createNull();
        return ts.visitEachChild(node, visit, context);
      };
      return node => ts.visitNode(node, visit);
    }]);
    const result = ts.createPrinter().printFile(transformed.transformed[0]);
    transformed.dispose();
    return result;
  }
  if (filename.endsWith("LatestRunItem.tsx")) {
    return source.replace("  started_at,", "  started_at, time,")
      .replace("{timeAgo}", "{time}").replace("onClick={handleClick}", "")
      .replaceAll("cursor-pointer", "cursor-default");
  }
  if (filename.endsWith("WorkflowPreview.tsx")) {
    // Fit measured nodes even when the original interactive controls are omitted.
    const setter = ast.statements.find(node => variableName(node) === "ViewportSetter");
    return source.replace("  useReactFlow,", "  useReactFlow, useNodesInitialized,")
      .replace(setter.getText(ast), `const ViewportSetter = () => {
        const ready = useNodesInitialized();
        const { fitView } = useReactFlow();
        useEffect(() => {
          if (!ready) return;
          const container = document.querySelector('.react-flow');
          if (!container) return;
          let frame;
          const fit = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => fitView({ padding: 0.16, minZoom: 0.05, maxZoom: 1, duration: 0 })); };
          const observer = new ResizeObserver(fit);
          observer.observe(container); fit();
          return () => { observer.disconnect(); cancelAnimationFrame(frame); };
        }, [ready, fitView]);
        return null;
      };`)
      .replace("nodesDraggable={false}", "nodesDraggable={false} nodesFocusable={false} edgesFocusable={false}");
  }
  if (filename.endsWith("WorkflowNode.tsx")) {
    return source.replaceAll('tabIndex={0}', 'tabIndex={-1}')
      .replaceAll("text-gray-200", "text-gray-700")
      .replaceAll("bg-red-900", "bg-red-100").replaceAll("bg-red-950", "bg-red-50")
      .replaceAll("text-red-200", "text-red-700")
      .replaceAll("bg-yellow-900", "bg-yellow-100").replaceAll("bg-yellow-950", "bg-yellow-50")
      .replaceAll("text-yellow-200", "text-yellow-700");
  }
  if (filename.endsWith("nodes/TriggerNode.tsx")) {
    return source.replaceAll('tabIndex={0}', 'tabIndex={-1}')
      .replaceAll('cmd0 Agent', 'Lead Generator')
      .replaceAll('bg-[#3B3B06]', 'bg-[#FFF4C4]').replaceAll('bg-[#323200]', 'bg-[#FFFEF5]')
      .replaceAll('bg-gray-800', 'bg-gray-50').replaceAll('bg-gray-700', 'bg-white')
      .replaceAll('text-gray-200', 'text-gray-700').replaceAll('text-gray-300', 'text-gray-600')
      .replaceAll('from-gray-700 to-gray-800', 'from-gray-100 to-gray-200');
  }
  if (filename.endsWith("AgentExecutionDemo.tsx")) {
    return source
      .replace(/https:\/\/hebbkx1anhila5yf[^"']+/, "/agent_profiles/Premium/samurai/samurai.png")
      .replace("<style jsx>", "<style>")
      .replace("setVisibleActions(prev => [...prev, DEMO_ACTIONS[actionIndex]]);", "const nextAction = DEMO_ACTIONS[actionIndex]; setVisibleActions(prev => [...prev, nextAction]);")
      .replaceAll("setTimeout(", "schedule(")
      .replace("let timeElapsed = 0;", "const timers = new Set<ReturnType<typeof setTimeout>>(); const schedule = (callback: () => void, delay: number) => { const timer = setTimeout(callback, delay); timers.add(timer); return timer; }; let timeElapsed = 0;")
      .replace("clearTimeout(initialTimeout);", "clearTimeout(initialTimeout); timers.forEach(clearTimeout);");
  }
  if (filename.endsWith("PremiumDashboardLayout.tsx")) {
    return source.replace('className="h-full flex flex-col gap-1 relative min-w-[200px]', 'className="showcase-dashboard h-full flex flex-col gap-1 relative min-w-[200px]');
  }
  if (filename.endsWith("SignInForm.tsx")) {
    const printer = ts.createPrinter();
    const transformed = ts.transform(ast, [context => {
      const visit = node => {
        if (ts.isImportDeclaration(node) && node.moduleSpecifier.text.includes("login/actions")) return undefined;
        if (ts.isJsxElement(node)) {
          const headerClass = node.openingElement.attributes.properties.find(attribute => ts.isJsxAttribute(attribute) && attribute.name.getText(ast) === "className" && ts.isStringLiteral(attribute.initializer) && attribute.initializer.text === "flex items-center border-b bg-muted/50 px-4 py-2");
          if (headerClass) {
            const f = ts.factory;
            const attributes = f.createJsxAttributes(node.openingElement.attributes.properties.map(attribute => attribute === headerClass ? f.createJsxAttribute(f.createIdentifier("className"), f.createStringLiteral(`showcase-signin-header ${headerClass.initializer.text}`)) : attribute));
            const portrait = f.createJsxSelfClosingElement(f.createIdentifier("img"), undefined, f.createJsxAttributes([
              f.createJsxAttribute(f.createIdentifier("src"), f.createStringLiteral("/showcases/bytespace/assets/agent_profiles/Premium/einstein/einstein-fb.png")),
              f.createJsxAttribute(f.createIdentifier("alt"), f.createStringLiteral("Einstein agent")),
            ]));
            return f.updateJsxElement(node, f.updateJsxOpeningElement(node.openingElement, node.openingElement.tagName, node.openingElement.typeArguments, attributes), [...node.children, portrait], node.closingElement);
          }
        }
        if (ts.isFunctionDeclaration(node) && node.name?.text === "onSubmit") {
          const f = ts.factory;
          return f.updateFunctionDeclaration(node, node.modifiers, node.asteriskToken, node.name, undefined, [], undefined,
            f.createBlock([f.createExpressionStatement(f.createCallExpression(f.createPropertyAccessExpression(f.createIdentifier("window"), "dispatchEvent"), undefined, [f.createNewExpression(f.createIdentifier("CustomEvent"), undefined, [f.createStringLiteral("showcase-enter")])]))], true));
        }
        return ts.visitEachChild(node, visit, context);
      };
      return node => ts.visitNode(node, visit);
    }]);
    const result = printer.printFile(transformed.transformed[0])
      .replace('password: ""', 'password: "preview-only"')
      .replace('type="password"', 'type="password" readOnly autoComplete="off"')
      .replace('type="submit"', 'type="button" onClick={() => onSubmit()}')
      .replace("'Execute'", "'Enter preview'");
    transformed.dispose();
    return result;
  }
  return source;
}

await mkdir(output, { recursive: true });
const previousBundles = JSON.parse(await readFile(path.join(output, "provenance.json"), "utf8").catch(() => "{}")).bundles ?? [];
const entry = await readFile(path.join(support, "entry.jsx"), "utf8");
const result = await build({
  entryPoints: { demo: path.join(support, "entry.jsx") },
  outdir: output, chunkNames: "chunks/[name]-[hash]", splitting: true, bundle: true, minify: true, metafile: true,
  platform: "browser", format: "esm", jsx: "automatic", target: ["es2020"],
  define: { "process.env.NODE_ENV": '"production"' },
  plugins: [{ name: "archived-interface", setup(build) {
    build.onResolve({ filter: /.*/ }, ({ path: name, importer }) => {
      if (adapters.has(name)) return { path: name, namespace: "adapter" };
      if (name === "showcase-fixtures") return { path: name, namespace: "fixture" };
      if (name.startsWith("@/")) return { path: path.join(sourceRoot, name.slice(2)), namespace: "source-resolution" };
      if (importer.includes("node_modules") && !/^react(?:-dom)?(?:\/|$)/.test(name)) return;
      if (!name.startsWith(".") && !path.isAbsolute(name)) {
        try { return { path: archiveRequire.resolve(name) }; }
        catch { return { path: extraRequire.resolve(name) }; }
      }
      // Let esbuild resolve relative modules normally.
      if (importer?.startsWith(sourceRoot) && name.endsWith(".css")) return { path: path.resolve(path.dirname(importer), name) };
    });
    build.onLoad({ filter: /.*/, namespace: "source-resolution" }, async ({ path: base }) => {
      for (const extension of ["", ".tsx", ".ts", "/index.tsx", "/index.ts"]) {
        const filename = base + extension;
        try {
          const original = await readFile(filename, "utf8");
          if (filename.endsWith(".css")) { originalStyles.push(original); return { contents: "", loader: "js" }; }
          const contents = adaptSource(original, filename); inputs.set(filename, contents);
          return { contents, loader: "tsx", resolveDir: path.dirname(filename) };
        } catch (error) { if (!["ENOENT", "EISDIR"].includes(error.code)) throw error; }
      }
      throw new Error(`Missing original module ${base}`);
    });
    build.onLoad({ filter: /\.[jt]sx?$/ }, async ({ path: filename }) => {
      if (!filename.startsWith(sourceRoot)) return;
      const contents = adaptSource(await readFile(filename, "utf8"), filename);
      inputs.set(filename, contents);
      return { contents, loader: "tsx", resolveDir: path.dirname(filename) };
    });
    build.onLoad({ filter: /\.css$/ }, async ({ path: filename }) => {
      originalStyles.push(await readFile(filename, "utf8")); return { contents: "", loader: "js" };
    });
    build.onLoad({ filter: /.*/, namespace: "adapter" }, ({ path: name }) => ({
      contents: name === "next/link" ? `export { Link as default } from ${JSON.stringify(path.join(support, "adapters.jsx"))};` : `export { default } from ${JSON.stringify(path.join(support, "adapters.jsx"))}; export * from ${JSON.stringify(path.join(support, "adapters.jsx"))};`,
      loader: "jsx", resolveDir: support,
    }));
    build.onLoad({ filter: /.*/, namespace: "fixture" }, async () => {
      const filename = path.join(sourceRoot, "components/agents/SpacesInstructionCard.tsx");
      const source = await readFile(filename, "utf8");
      const ast = statements(source, filename);
      const contents = "export " + ast.statements.find(node => variableName(node) === "PREVIEW_SPACES").getText(ast);
      inputs.set(filename, contents); return { contents, loader: "tsx", resolveDir: sourceRoot };
    });
  } }],
});

const colorNames = ["background", "foreground", "border", "input", "ring"];
const colors = Object.fromEntries(colorNames.map(name => [name, `hsl(var(--${name}))`]));
for (const name of ["card", "popover", "primary", "secondary", "muted", "accent", "destructive"]) colors[name] = { DEFAULT: `hsl(var(--${name}))`, foreground: `hsl(var(--${name}-foreground))` };
const css = await postcss([tailwind({
  content: [...inputs.values(), entry, ...await Promise.all(["adapters.jsx", "AgentDetailStudies.jsx"].map(file => readFile(path.join(support, file), "utf8")))].map(raw => ({ raw, extension: "tsx" })),
  safelist: ["fill-emerald-500", "fill-yellow-500", "fill-red-500", "stroke-white"],
  darkMode: "class", theme: { extend: { colors } }, plugins: [],
})]).process(originalStyles.join("\n") + "\n" + await readFile(path.join(support, "frame.css"), "utf8"), { from: undefined });
await writeFile(path.join(output, "demo.css"), css.css);
await copyFile(path.join(support, "index.html"), path.join(output, "index.html"));

// Collect local artwork from the original modules. Agent cards also resolve full-body variants at runtime.
const assets = new Set(["/agent_profiles/Premium/einstein/einstein-fb.png", "/fonts/GeneralSans-Variable.woff2"]);
for (const content of [...inputs.values(), entry]) {
  for (const match of content.matchAll(/["'](\/(?:agent_profiles|landing|icons|images)\/[^"']+\.(?:png|webp|svg|jpg))["']/g)) assets.add(match[1]);
}
for (const asset of [...assets]) if (asset.startsWith("/agent_profiles/")) {
  const directory = path.posix.dirname(asset);
  try { for (const filename of await readdir(path.join(archiveApp, "public", directory))) if (/\.(png|webp)$/.test(filename)) assets.add(`${directory}/${filename}`); } catch { /* Report absent files below. */ }
}
const copied = [];
for (const asset of assets) {
  const from = path.join(archiveApp, "public", asset);
  try { await access(from); } catch { console.warn(`Unused/missing archived asset: ${asset}`); continue; }
  const to = path.join(output, "assets", asset);
  await mkdir(path.dirname(to), { recursive: true });
  if (/\.(svg|woff2)$/.test(asset)) await copyFile(from, to);
  else await sharp(from).resize({ width: 440, height: 520, fit: "inside", withoutEnlargement: true }).toFile(to);
  copied.push(asset);
}
const bundles = Object.keys(result.metafile.outputs).map(filename => path.relative(output, path.resolve(filename)));
await writeFile(path.join(output, "provenance.json"), JSON.stringify({
  repository: "https://github.com/elnugget/bytespace",
  revision: execFileSync("git", ["rev-parse", "HEAD"], { cwd: sourceRepo, encoding: "utf8" }).trim(),
  assetsRepository: "https://github.com/FindKar1/portfolio-sites",
  assetsRevision: execFileSync("git", ["rev-parse", "HEAD"], { cwd: archiveRepo, encoding: "utf8" }).trim(),
  sourceFiles: [...inputs.keys()].map(filename => path.relative(sourceRepo, filename)), assets: copied, bundles,
  adaptations: ["Original AgentGroupCard and AgentCard with activity graphs and counters", "Sales overview and populated expanded cards are separate, always-visible studies", "Agent rows are visible from first paint and never paginated or draggable", "Original OwnerAgentView analytics composition extracted without its service lifecycle or tabs", "Original workflow renderer fitted to show the entire example without panning", "Original run outputs and history with consistent synthetic fixtures", "Disconnected workspace and output controls removed", "Original sign-in form with read-only fixture credentials and local preview action", "Original calendar, execution, context and trigger animations", "Compact execution and trigger layouts, repaired chart height constraints, and sign-in header portrait", "Origin-validated execution replay control in the host heading", "Local image and navigation adapters", "Service-backed page excluded", "External favicons replaced locally", "Network and forms disabled by CSP", "Light theme with nine auto-sized studies in the host page's responsive grid"],
}, null, 2) + "\n");
for (const file of previousBundles) {
  if (/^chunks\/[\w-]+\.js$/.test(file) && !bundles.includes(file)) await unlink(path.join(output, file)).catch(error => { if (error.code !== "ENOENT") throw error; });
}
console.log(`Built Bytespace showcase: ${inputs.size} original source files, ${copied.length} local assets, ${Object.keys(result.metafile.inputs).length} modules.`);
